import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { ADMIN_COOKIE, config, sessionCookieOptions } from '../config';
import { db, nowIso } from '../db';
import { HttpError, getClientIp } from './http';

export interface AuthAdmin {
  id: number;
  email: string;
  name: string;
  role: 'owner' | 'editor' | 'advisor';
}

export interface AdminSession {
  id: number;
  admin: AuthAdmin;
  csrfToken: string;
  expiresAt: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AuthAdmin;
      adminSession?: AdminSession;
    }
  }
}

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function createAdminSession(req: Request, adminId: number) {
  const token = crypto.randomBytes(32).toString('base64url');
  const csrfToken = crypto.randomBytes(24).toString('base64url');
  const expiresAt = new Date(Date.now() + config.sessionTtlHours * 60 * 60 * 1000).toISOString();
  db.prepare(
    `INSERT INTO admin_sessions (token_hash, admin_id, csrf_token, ip, user_agent, expires_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    hashToken(token),
    adminId,
    csrfToken,
    getClientIp(req),
    req.get('user-agent')?.slice(0, 400) ?? null,
    expiresAt,
    nowIso(),
  );
  db.prepare('DELETE FROM admin_sessions WHERE expires_at < ?').run(nowIso());
  return { token, csrfToken, expiresAt };
}

export function setSessionCookie(res: Response, token: string) {
  res.cookie(ADMIN_COOKIE, token, sessionCookieOptions);
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(ADMIN_COOKIE, { ...sessionCookieOptions, maxAge: undefined });
}

export function loadAdminSession(req: Request): AdminSession | null {
  const token = req.cookies?.[ADMIN_COOKIE];
  if (typeof token !== 'string' || token.length < 32) return null;
  const row = db
    .prepare(
      `SELECT s.id, s.csrf_token, s.expires_at, a.id AS admin_id, a.email, a.name, a.role, a.is_active
       FROM admin_sessions s
       JOIN admins a ON a.id = s.admin_id
       WHERE s.token_hash = ? AND s.expires_at > ? AND a.is_active = 1`,
    )
    .get(hashToken(token), nowIso()) as
    | {
        id: number;
        csrf_token: string;
        expires_at: string;
        admin_id: number;
        email: string;
        name: string;
        role: AuthAdmin['role'];
        is_active: number;
      }
    | undefined;
  if (!row) return null;
  return {
    id: row.id,
    csrfToken: row.csrf_token,
    expiresAt: row.expires_at,
    admin: {
      id: row.admin_id,
      email: row.email,
      name: row.name,
      role: row.role,
    },
  };
}

export function optionalAdmin(req: Request, _res: Response, next: NextFunction) {
  const session = loadAdminSession(req);
  if (session) {
    req.admin = session.admin;
    req.adminSession = session;
  }
  next();
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const session = loadAdminSession(req);
  if (!session) {
    next(new HttpError(401, 'Your session has expired. Please sign in again.', 'UNAUTHENTICATED'));
    return;
  }
  req.admin = session.admin;
  req.adminSession = session;
  next();
}

export function requireCsrf(req: Request, _res: Response, next: NextFunction) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    next();
    return;
  }
  const provided = req.get('x-csrf-token');
  if (!req.adminSession || !provided) {
    next(new HttpError(403, 'Security token missing. Refresh the page and try again.', 'CSRF_REJECTED'));
    return;
  }
  const a = Buffer.from(provided);
  const b = Buffer.from(req.adminSession.csrfToken);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    next(new HttpError(403, 'Security token invalid. Refresh the page and try again.', 'CSRF_REJECTED'));
    return;
  }
  next();
}

export function requireRole(...roles: AuthAdmin['role'][]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      next(new HttpError(403, 'You do not have permission to perform this action.', 'FORBIDDEN'));
      return;
    }
    next();
  };
}

export function revokeSession(req: Request) {
  const token = req.cookies?.[ADMIN_COOKIE];
  if (typeof token === 'string') {
    db.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').run(hashToken(token));
  }
}
