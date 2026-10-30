import type { Request, Router } from 'express';
import type { ZodObject, ZodRawShape } from 'zod';
import { db, nowIso } from '../db';
import { requireRole } from './auth';
import { HttpError, asyncHandler, logActivity } from './http';
import { serializeRow, serializeRows } from './serialize';

interface CrudConfig<T extends ZodObject<ZodRawShape>> {
  path: string;
  table: string;
  entityLabel: string;
  schema: T;
  orderBy: string;
  listSql?: string;
  listParams?: unknown[];
  searchColumns?: string[];
  transformCreate?: (data: Record<string, unknown>, req: Request) => Record<string, unknown>;
  transformUpdate?: (data: Record<string, unknown>, req: Request) => Record<string, unknown>;
}

function prepareValue(value: unknown) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
    return JSON.stringify(value);
  }
  return value;
}

export function registerCrud<T extends ZodObject<ZodRawShape>>(router: Router, config: CrudConfig<T>) {
  const writeAccess = requireRole('owner', 'editor');
  const getById = db.prepare(`SELECT * FROM ${config.table} WHERE id = ?`);

  router.get(
    `${config.path}`,
    asyncHandler(async (req, res) => {
      const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
      let sql = config.listSql || `SELECT * FROM ${config.table}`;
      const params = [...(config.listParams || [])];
      if (search && config.searchColumns?.length) {
        const clause = config.searchColumns.map((column) => `${column} LIKE ?`).join(' OR ');
        sql += `${sql.includes('WHERE') ? ' AND' : ' WHERE'} (${clause})`;
        params.push(...config.searchColumns.map(() => `%${search}%`));
      }
      sql += ` ORDER BY ${config.orderBy}`;
      const rows = db.prepare(sql).all(...params);
      res.json({ items: serializeRows(rows) });
    }),
  );

  router.get(
    `${config.path}/:id`,
    asyncHandler(async (req, res) => {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'Invalid record id.', 'INVALID_ID');
      const row = getById.get(id);
      if (!row) throw new HttpError(404, `${config.entityLabel} not found.`, 'NOT_FOUND');
      res.json({ item: serializeRow(row) });
    }),
  );

  router.post(
    `${config.path}`,
    writeAccess,
    asyncHandler(async (req, res) => {
      const parsed = config.schema.parse(req.body);
      const data: Record<string, unknown> = { ...(parsed as Record<string, unknown>) };
      const now = nowIso();
      const finalData = config.transformCreate ? config.transformCreate(data, req) : data;
      const fields: Record<string, unknown> = {
        ...finalData,
        created_at: now,
        updated_at: now,
      };
      const columns = Object.keys(fields).filter((key) => fields[key] !== undefined);
      const sql = `INSERT INTO ${config.table} (${columns.join(', ')}) VALUES (${columns
        .map(() => '?')
        .join(', ')})`;
      try {
        const result = db.prepare(sql).run(...columns.map((column) => prepareValue(fields[column])));
        const row = getById.get(result.lastInsertRowid);
        logActivity({
          adminId: req.admin?.id,
          action: 'create',
          entityType: config.entityLabel.toLowerCase(),
          entityId: Number(result.lastInsertRowid),
          details: { table: config.table },
          ip: req.ip,
        });
        res.status(201).json({ item: serializeRow(row) });
      } catch (error) {
        if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
          throw new HttpError(409, 'A record with this URL slug already exists.', 'DUPLICATE_SLUG');
        }
        throw error;
      }
    }),
  );

  router.patch(
    `${config.path}/:id`,
    writeAccess,
    asyncHandler(async (req, res) => {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'Invalid record id.', 'INVALID_ID');
      const exists = getById.get(id);
      if (!exists) throw new HttpError(404, `${config.entityLabel} not found.`, 'NOT_FOUND');
      const parsed = config.schema.partial().parse(req.body);
      let data: Record<string, unknown> = { ...(parsed as Record<string, unknown>) };
      if (config.transformUpdate) data = config.transformUpdate(data, req);
      const fields: Record<string, unknown> = { ...data, updated_at: nowIso() };
      const columns = Object.keys(fields).filter((key) => fields[key] !== undefined);
      if (columns.length <= 1) throw new HttpError(400, 'No changes were provided.', 'NO_CHANGES');
      try {
        db.prepare(
          `UPDATE ${config.table} SET ${columns.map((column) => `${column} = ?`).join(', ')} WHERE id = ?`,
        ).run(...columns.map((column) => prepareValue(fields[column])), id);
        const row = getById.get(id);
        logActivity({
          adminId: req.admin?.id,
          action: 'update',
          entityType: config.entityLabel.toLowerCase(),
          entityId: id,
          details: { fields: Object.keys(data) },
          ip: req.ip,
        });
        res.json({ item: serializeRow(row) });
      } catch (error) {
        if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
          throw new HttpError(409, 'A record with this URL slug already exists.', 'DUPLICATE_SLUG');
        }
        throw error;
      }
    }),
  );

  router.delete(
    `${config.path}/:id`,
    writeAccess,
    asyncHandler(async (req, res) => {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'Invalid record id.', 'INVALID_ID');
      const exists = getById.get(id) as { id: number } | undefined;
      if (!exists) throw new HttpError(404, `${config.entityLabel} not found.`, 'NOT_FOUND');
      db.prepare(`DELETE FROM ${config.table} WHERE id = ?`).run(id);
      logActivity({
        adminId: req.admin?.id,
        action: 'delete',
        entityType: config.entityLabel.toLowerCase(),
        entityId: id,
        details: { table: config.table },
        ip: req.ip,
      });
      res.json({ ok: true });
    }),
  );
}
