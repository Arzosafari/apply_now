import type { NextFunction, Request, Response } from 'express';
import type { ZodError } from 'zod';
import { config } from '../config';
import { db, nowIso } from '../db';

export class HttpError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, message: string, code = 'REQUEST_ERROR', details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function validationError(error: ZodError) {
  return new HttpError(
    400,
    'Please review the highlighted fields and try again.',
    'VALIDATION_ERROR',
    error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    })),
  );
}

export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction) {
  const isHttp = error instanceof HttpError;
  const status = isHttp ? error.status : 500;
  if (!isHttp) {
    console.error(`[${req.method} ${req.originalUrl}]`, error);
  }
  const body: Record<string, unknown> = {
    error: isHttp ? error.message : 'Something went wrong. Please try again.',
    code: isHttp ? error.code : 'INTERNAL_ERROR',
  };
  if (isHttp && error.details) body.details = error.details;
  if (!config.isProduction && !isHttp && error instanceof Error) body.debug = error.message;
  res.status(status).json(body);
}

export function notFoundHandler(req: Request, res: Response) {
  if (req.originalUrl.startsWith('/api/')) {
    res.status(404).json({ error: 'API endpoint not found.', code: 'NOT_FOUND' });
    return;
  }
  res.status(404).sendFile('index.html', { root: `${config.rootDir}/dist` }, (error) => {
    if (error) res.status(404).json({ error: 'Not found.', code: 'NOT_FOUND' });
  });
}

export function logActivity(input: {
  adminId?: number | null;
  action: string;
  entityType: string;
  entityId?: string | number | null;
  details?: unknown;
  ip?: string | null;
}) {
  db.prepare(
    `INSERT INTO activity_logs (admin_id, action, entity_type, entity_id, details, ip, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    input.adminId ?? null,
    input.action,
    input.entityType,
    input.entityId === undefined || input.entityId === null ? null : String(input.entityId),
    JSON.stringify(input.details ?? {}),
    input.ip ?? null,
    nowIso(),
  );
}

export function getClientIp(req: Request) {
  return req.ip || req.socket.remoteAddress || null;
}

export function assertTrustedOrigin(req: Request) {
  const origin = req.get('origin');
  if (!origin) return;
  const allowed = new Set(
    [config.appOrigin, config.publicSiteUrl]
      .filter(Boolean)
      .map((value) => value.replace(/\/$/, '')),
  );
  if (!allowed.has(origin.replace(/\/$/, ''))) {
    throw new HttpError(403, 'This request originated from an untrusted origin.', 'ORIGIN_REJECTED');
  }
}

export function requireString(value: unknown, field: string, max = 500) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new HttpError(400, `${field} is required.`, 'VALIDATION_ERROR');
  }
  if (value.length > max) {
    throw new HttpError(400, `${field} is too long.`, 'VALIDATION_ERROR');
  }
  return value.trim();
}

export function csvEscape(value: unknown) {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export function sendCsv(res: Response, filename: string, headers: string[], rows: unknown[][]) {
  const lines = [headers.map(csvEscape).join(','), ...rows.map((row) => row.map(csvEscape).join(','))];
  // BOM keeps Persian text readable in spreadsheet software.
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(`\uFEFF${lines.join('\r\n')}`);
}

export function parsePagination(query: Request['query']) {
  const page = Math.max(1, Math.min(10000, Number(query.page || 1) || 1));
  const pageSize = Math.max(1, Math.min(100, Number(query.pageSize || 20) || 20));
  return { page, pageSize, offset: (page - 1) * pageSize };
}
