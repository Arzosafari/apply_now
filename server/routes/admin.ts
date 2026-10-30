import crypto from 'node:crypto';
import fs from 'node:fs';
import bcrypt from 'bcryptjs';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import { z } from 'zod';
import { config } from '../config';
import { db, nowIso, parseJson } from '../db';
import {
  clearSessionCookie,
  createAdminSession,
  requireAdmin,
  requireCsrf,
  requireRole,
  revokeSession,
  setSessionCookie,
} from '../lib/auth';
import { registerCrud } from '../lib/crud';
import {
  HttpError,
  asyncHandler,
  getClientIp,
  logActivity,
  parsePagination,
  sendCsv,
  validationError,
} from '../lib/http';
import {
  articleSchema,
  categorySchema,
  consultationStatusSchema,
  contactStatusSchema,
  destinationSchema,
  expertSchema,
  faqSchema,
  noteSchema,
  packageSchema,
  serviceSchema,
  settingsUpdateSchema,
  testimonialSchema,
} from '../lib/schemas';
import { serializeRow, serializeRows } from '../lib/serialize';

export const adminRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: 'Too many sign-in attempts. Please wait 15 minutes.', code: 'RATE_LIMITED' },
});

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(500),
});

adminRouter.post(
  '/login',
  loginLimiter,
  asyncHandler(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) throw validationError(parsed.error);
    const admin = db
      .prepare('SELECT * FROM admins WHERE email = ? COLLATE NOCASE')
      .get(parsed.data.email) as
      | {
          id: number;
          email: string;
          name: string;
          role: 'owner' | 'editor' | 'advisor';
          password_hash: string;
          is_active: number;
        }
      | undefined;
    const hash = admin?.password_hash || '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalid';
    const valid = bcrypt.compareSync(parsed.data.password, hash);
    if (!admin || !valid || admin.is_active !== 1) {
      throw new HttpError(401, 'Email or password is incorrect.', 'INVALID_CREDENTIALS');
    }
    revokeSession(req);
    const session = createAdminSession(req, admin.id);
    setSessionCookie(res, session.token);
    db.prepare('UPDATE admins SET last_login_at = ?, updated_at = ? WHERE id = ?').run(
      nowIso(),
      nowIso(),
      admin.id,
    );
    logActivity({
      adminId: admin.id,
      action: 'login',
      entityType: 'admin',
      entityId: admin.id,
      ip: getClientIp(req),
    });
    res.json({
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        is_active: true,
      },
      csrfToken: session.csrfToken,
      expiresAt: session.expiresAt,
    });
  }),
);

adminRouter.get(
  '/session',
  asyncHandler(async (req, res) => {
    if (!req.admin || !req.adminSession) {
      res.json({ admin: null, csrfToken: null, expiresAt: null });
      return;
    }
    res.json({
      admin: req.admin,
      csrfToken: req.adminSession.csrfToken,
      expiresAt: req.adminSession.expiresAt,
    });
  }),
);

adminRouter.use(requireAdmin);
adminRouter.use(requireCsrf);

adminRouter.get(
  '/me',
  asyncHandler(async (req, res) => {
    res.json({
      admin: req.admin,
      csrfToken: req.adminSession?.csrfToken,
      expiresAt: req.adminSession?.expiresAt,
    });
  }),
);

adminRouter.post(
  '/logout',
  asyncHandler(async (req, res) => {
    revokeSession(req);
    clearSessionCookie(res);
    logActivity({
      adminId: req.admin?.id,
      action: 'logout',
      entityType: 'admin',
      entityId: req.admin?.id,
      ip: getClientIp(req),
    });
    res.status(204).end();
  }),
);

const passwordSchema = z.object({
  currentPassword: z.string().min(1).max(500),
  newPassword: z
    .string()
    .min(12, 'Use at least 12 characters.')
    .max(200)
    .regex(/[a-z]/, 'Include a lowercase letter.')
    .regex(/[A-Z]/, 'Include an uppercase letter.')
    .regex(/[0-9]/, 'Include a number.'),
});

adminRouter.post(
  '/account/password',
  requireRole('owner', 'editor', 'advisor'),
  asyncHandler(async (req, res) => {
    const parsed = passwordSchema.safeParse(req.body);
    if (!parsed.success) throw validationError(parsed.error);
    const record = db.prepare('SELECT password_hash FROM admins WHERE id = ?').get(req.admin!.id) as {
      password_hash: string;
    };
    if (!bcrypt.compareSync(parsed.data.currentPassword, record.password_hash)) {
      throw new HttpError(400, 'Current password is incorrect.', 'INVALID_PASSWORD');
    }
    db.prepare('UPDATE admins SET password_hash = ?, updated_at = ? WHERE id = ?').run(
      bcrypt.hashSync(parsed.data.newPassword, 12),
      nowIso(),
      req.admin!.id,
    );
    db.prepare('DELETE FROM admin_sessions WHERE admin_id = ? AND id != ?').run(
      req.admin!.id,
      req.adminSession!.id,
    );
    logActivity({
      adminId: req.admin!.id,
      action: 'password_changed',
      entityType: 'admin',
      entityId: req.admin!.id,
      ip: getClientIp(req),
    });
    res.json({ ok: true });
  }),
);

adminRouter.get(
  '/stats',
  asyncHandler(async (_req, res) => {
    const rows = db
      .prepare(
        `SELECT status, COUNT(*) as count FROM consultations GROUP BY status`,
      )
      .all() as { status: string; count: number }[];
    const consultationCounts = Object.fromEntries(rows.map((row) => [row.status, row.count]));
    const totalConsultations = rows.reduce((sum, row) => sum + row.count, 0);
    const contentCount = (table: string) =>
      (db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get() as { count: number }).count;
    const successfulPayments = db
      .prepare(
        `SELECT COUNT(*) AS count, COALESCE(SUM(amount_minor), 0) AS amount
         FROM payments WHERE status = 'successful'`,
      )
      .get() as { count: number; amount: number };
    const pendingPayments = (
      db.prepare(`SELECT COUNT(*) AS count FROM payments WHERE status = 'pending'`).get() as {
        count: number;
      }
    ).count;
    const failedPayments = (
      db.prepare(`SELECT COUNT(*) AS count FROM payments WHERE status = 'failed'`).get() as {
        count: number;
      }
    ).count;
    const unreadMessages = (
      db.prepare(`SELECT COUNT(*) AS count FROM contact_messages WHERE status = 'new'`).get() as {
        count: number;
      }
    ).count;
    const recentConsultations = serializeRows(
      db
        .prepare(
          `SELECT c.*, s.title_en AS service_title_en, s.title_fa AS service_title_fa,
                  d.name_en AS destination_name_en, d.name_fa AS destination_name_fa
           FROM consultations c
           LEFT JOIN services s ON s.id = c.service_id
           LEFT JOIN destinations d ON d.id = c.destination_id
           ORDER BY c.created_at DESC LIMIT 8`,
        )
        .all(),
    );
    const recentActivity = serializeRows(
      db
        .prepare(
          `SELECT l.*, a.name AS admin_name FROM activity_logs l
           LEFT JOIN admins a ON a.id = l.admin_id
           ORDER BY l.created_at DESC LIMIT 8`,
        )
        .all(),
    );
    const dayRows = db
      .prepare(
        `SELECT substr(created_at, 1, 10) AS date, COUNT(*) AS count
         FROM consultations
         WHERE created_at >= datetime('now', '-13 days')
         GROUP BY substr(created_at, 1, 10)`,
      )
      .all() as { date: string; count: number }[];
    const dayMap = new Map(dayRows.map((row) => [row.date, row.count]));
    const consultationsByDay = Array.from({ length: 14 }, (_, index) => {
      const date = new Date();
      date.setUTCDate(date.getUTCDate() - (13 - index));
      const key = date.toISOString().slice(0, 10);
      return { date: key, count: dayMap.get(key) || 0 };
    });
    res.json({
      consultations: {
        total: totalConsultations,
        pending: consultationCounts.pending || 0,
        under_review: consultationCounts.under_review || 0,
        contacted: consultationCounts.contacted || 0,
        in_progress: consultationCounts.in_progress || 0,
        approved: consultationCounts.approved || 0,
        rejected: consultationCounts.rejected || 0,
        completed: consultationCounts.completed || 0,
      },
      content: {
        services: contentCount('services'),
        destinations: contentCount('destinations'),
        articlesPublished: (
          db.prepare(`SELECT COUNT(*) AS count FROM articles WHERE status = 'published'`).get() as {
            count: number;
          }
        ).count,
        articlesDraft: (
          db.prepare(`SELECT COUNT(*) AS count FROM articles WHERE status = 'draft'`).get() as {
            count: number;
          }
        ).count,
        packages: contentCount('packages'),
        experts: contentCount('experts'),
        faqs: contentCount('faqs'),
      },
      payments: {
        successfulAmountMinor: successfulPayments.amount,
        successfulCount: successfulPayments.count,
        pendingCount: pendingPayments,
        failedCount: failedPayments,
        currency: config.defaultCurrency,
      },
      unreadMessages,
      recentConsultations,
      recentActivity,
      consultationsByDay,
    });
  }),
);

adminRouter.get(
  '/activity',
  asyncHandler(async (req, res) => {
    const { page, pageSize, offset } = parsePagination(req.query);
    const total = (db.prepare('SELECT COUNT(*) AS count FROM activity_logs').get() as { count: number })
      .count;
    const items = serializeRows(
      db
        .prepare(
          `SELECT l.*, a.name AS admin_name FROM activity_logs l
           LEFT JOIN admins a ON a.id = l.admin_id
           ORDER BY l.created_at DESC LIMIT ? OFFSET ?`,
        )
        .all(pageSize, offset),
    );
    res.json({ items, total, page, pageSize });
  }),
);

function consultationFilters(query: Record<string, unknown>) {
  const where: string[] = [];
  const params: unknown[] = [];
  const status = typeof query.status === 'string' ? query.status : '';
  if (status && status !== 'all') {
    where.push('c.status = ?');
    params.push(status);
  }
  if (query.serviceId) {
    where.push('c.service_id = ?');
    params.push(Number(query.serviceId));
  }
  if (query.destinationId) {
    where.push('c.destination_id = ?');
    params.push(Number(query.destinationId));
  }
  if (typeof query.from === 'string' && query.from) {
    where.push('c.created_at >= ?');
    params.push(`${query.from}T00:00:00.000Z`);
  }
  if (typeof query.to === 'string' && query.to) {
    where.push('c.created_at <= ?');
    params.push(`${query.to}T23:59:59.999Z`);
  }
  if (typeof query.search === 'string' && query.search.trim()) {
    where.push(
      '(c.reference LIKE ? OR c.full_name LIKE ? OR c.email LIKE ? OR c.phone LIKE ?)',
    );
    const like = `%${query.search.trim()}%`;
    params.push(like, like, like, like);
  }
  return { where, params };
}

const consultationSelect = `SELECT c.*, s.title_en AS service_title_en, s.title_fa AS service_title_fa,
  d.name_en AS destination_name_en, d.name_fa AS destination_name_fa,
  (SELECT status FROM payments p WHERE p.consultation_id = c.id
    ORDER BY CASE p.status WHEN 'successful' THEN 0 WHEN 'pending' THEN 1 ELSE 2 END, p.created_at DESC
    LIMIT 1) AS payment_status,
  (SELECT COUNT(*) FROM consultation_notes n WHERE n.consultation_id = c.id) AS notes_count
  FROM consultations c
  LEFT JOIN services s ON s.id = c.service_id
  LEFT JOIN destinations d ON d.id = c.destination_id`;

adminRouter.get(
  '/consultations',
  asyncHandler(async (req, res) => {
    const { page, pageSize, offset } = parsePagination(req.query);
    const { where, params } = consultationFilters(req.query);
    const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const total = (
      db.prepare(`SELECT COUNT(*) AS count FROM consultations c ${clause}`).get(...params) as {
        count: number;
      }
    ).count;
    const items = serializeRows(
      db
        .prepare(`${consultationSelect} ${clause} ORDER BY c.created_at DESC LIMIT ? OFFSET ?`)
        .all(...params, pageSize, offset),
    );
    res.json({ items, total, page, pageSize });
  }),
);

adminRouter.get(
  '/consultations/export',
  asyncHandler(async (req, res) => {
    const { where, params } = consultationFilters(req.query);
    const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const rows = serializeRows(
      db.prepare(`${consultationSelect} ${clause} ORDER BY c.created_at DESC LIMIT 5000`).all(...params),
    ) as Record<string, unknown>[];
    sendCsv(
      res,
      `consultations-${new Date().toISOString().slice(0, 10)}.csv`,
      [
        'Reference',
        'Status',
        'Full name',
        'Email',
        'Phone',
        'Contact method',
        'Service',
        'Destination',
        'Education level',
        'Preferred date',
        'Submitted',
        'Payment status',
        'Message',
      ],
      rows.map((row) => [
        row.reference,
        row.status,
        row.full_name,
        row.email,
        row.phone,
        row.contact_method,
        row.service_title_en,
        row.destination_name_en,
        row.education_level,
        row.preferred_date,
        row.created_at,
        row.payment_status,
        row.message,
      ]),
    );
    logActivity({
      adminId: req.admin?.id,
      action: 'export',
      entityType: 'consultation',
      details: { count: rows.length },
      ip: getClientIp(req),
    });
  }),
);

adminRouter.get(
  '/consultations/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'Invalid id.', 'INVALID_ID');
    const consultation = db.prepare(`${consultationSelect} WHERE c.id = ?`).get(id);
    if (!consultation) throw new HttpError(404, 'Consultation request not found.', 'NOT_FOUND');
    const notes = serializeRows(
      db
        .prepare(
          `SELECT n.*, a.name AS admin_name FROM consultation_notes n
           LEFT JOIN admins a ON a.id = n.admin_id
           WHERE n.consultation_id = ? ORDER BY n.created_at DESC`,
        )
        .all(id),
    );
    const payments = serializeRows(
      db
        .prepare(
          `SELECT p.*, pk.name_en AS package_name_en, pk.name_fa AS package_name_fa
           FROM payments p LEFT JOIN packages pk ON pk.id = p.package_id
           WHERE p.consultation_id = ? ORDER BY p.created_at DESC`,
        )
        .all(id),
    );
    res.json({ consultation: serializeRow(consultation), notes, payments });
  }),
);

adminRouter.patch(
  '/consultations/:id',
  asyncHandler(async (req, res) => {
    const parsed = consultationStatusSchema.safeParse(req.body);
    if (!parsed.success) throw validationError(parsed.error);
    const id = Number(req.params.id);
    const existing = db.prepare('SELECT * FROM consultations WHERE id = ?').get(id) as
      | { status: string; reference: string }
      | undefined;
    if (!existing) throw new HttpError(404, 'Consultation request not found.', 'NOT_FOUND');
    db.prepare('UPDATE consultations SET status = ?, updated_at = ? WHERE id = ?').run(
      parsed.data.status,
      nowIso(),
      id,
    );
    logActivity({
      adminId: req.admin?.id,
      action: 'status_change',
      entityType: 'consultation',
      entityId: id,
      details: { reference: existing.reference, from: existing.status, to: parsed.data.status },
      ip: getClientIp(req),
    });
    res.json({ ok: true, status: parsed.data.status });
  }),
);

adminRouter.post(
  '/consultations/:id/notes',
  asyncHandler(async (req, res) => {
    const parsed = noteSchema.safeParse(req.body);
    if (!parsed.success) throw validationError(parsed.error);
    const id = Number(req.params.id);
    const exists = db.prepare('SELECT id FROM consultations WHERE id = ?').get(id);
    if (!exists) throw new HttpError(404, 'Consultation request not found.', 'NOT_FOUND');
    const result = db
      .prepare(
        `INSERT INTO consultation_notes (consultation_id, admin_id, note, created_at)
         VALUES (?, ?, ?, ?)`,
      )
      .run(id, req.admin!.id, parsed.data.note, nowIso());
    logActivity({
      adminId: req.admin?.id,
      action: 'note_added',
      entityType: 'consultation',
      entityId: id,
      details: { note_id: Number(result.lastInsertRowid) },
      ip: getClientIp(req),
    });
    res.status(201).json({ ok: true, id: Number(result.lastInsertRowid) });
  }),
);

adminRouter.get(
  '/contact-messages',
  asyncHandler(async (req, res) => {
    const { page, pageSize, offset } = parsePagination(req.query);
    const status = typeof req.query.status === 'string' ? req.query.status : '';
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const where: string[] = [];
    const params: unknown[] = [];
    if (status && status !== 'all') {
      where.push('status = ?');
      params.push(status);
    }
    if (search) {
      where.push('(name LIKE ? OR email LIKE ? OR subject LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const total = (
      db.prepare(`SELECT COUNT(*) AS count FROM contact_messages ${clause}`).get(...params) as {
        count: number;
      }
    ).count;
    const items = serializeRows(
      db
        .prepare(`SELECT * FROM contact_messages ${clause} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
        .all(...params, pageSize, offset),
    );
    res.json({ items, total, page, pageSize });
  }),
);

adminRouter.patch(
  '/contact-messages/:id',
  asyncHandler(async (req, res) => {
    const parsed = contactStatusSchema.safeParse(req.body);
    if (!parsed.success) throw validationError(parsed.error);
    const id = Number(req.params.id);
    const exists = db.prepare('SELECT id FROM contact_messages WHERE id = ?').get(id);
    if (!exists) throw new HttpError(404, 'Message not found.', 'NOT_FOUND');
    db.prepare('UPDATE contact_messages SET status = ?, updated_at = ? WHERE id = ?').run(
      parsed.data.status,
      nowIso(),
      id,
    );
    logActivity({
      adminId: req.admin?.id,
      action: 'status_change',
      entityType: 'contact_message',
      entityId: id,
      details: { status: parsed.data.status },
      ip: getClientIp(req),
    });
    res.json({ ok: true });
  }),
);

adminRouter.get(
  '/payments',
  asyncHandler(async (req, res) => {
    const { page, pageSize, offset } = parsePagination(req.query);
    const status = typeof req.query.status === 'string' ? req.query.status : '';
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const where: string[] = [];
    const params: unknown[] = [];
    if (status && status !== 'all') {
      where.push('p.status = ?');
      params.push(status);
    }
    if (search) {
      where.push('(p.reference LIKE ? OR p.provider_checkout_id LIKE ? OR c.reference LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const total = (
      db
        .prepare(
          `SELECT COUNT(*) AS count FROM payments p
           LEFT JOIN consultations c ON c.id = p.consultation_id ${clause}`,
        )
        .get(...params) as { count: number }
    ).count;
    const items = serializeRows(
      db
        .prepare(
          `SELECT p.*, c.reference AS consultation_reference, pk.name_en AS package_name_en,
                  pk.name_fa AS package_name_fa
           FROM payments p
           LEFT JOIN consultations c ON c.id = p.consultation_id
           LEFT JOIN packages pk ON pk.id = p.package_id
           ${clause} ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
        )
        .all(...params, pageSize, offset),
    );
    res.json({ items, total, page, pageSize });
  }),
);

adminRouter.get(
  '/payments/export',
  asyncHandler(async (req, res) => {
    const rows = serializeRows(
      db
        .prepare(
          `SELECT p.*, c.reference AS consultation_reference, pk.name_en AS package_name_en
           FROM payments p
           LEFT JOIN consultations c ON c.id = p.consultation_id
           LEFT JOIN packages pk ON pk.id = p.package_id
           ORDER BY p.created_at DESC LIMIT 5000`,
        )
        .all(),
    ) as Record<string, unknown>[];
    sendCsv(
      res,
      `payments-${new Date().toISOString().slice(0, 10)}.csv`,
      [
        'Payment reference',
        'Status',
        'Amount (minor)',
        'Currency',
        'Package',
        'Consultation reference',
        'Provider',
        'Provider checkout',
        'Created',
        'Paid',
      ],
      rows.map((row) => [
        row.reference,
        row.status,
        row.amount_minor,
        row.currency,
        row.package_name_en,
        row.consultation_reference,
        row.provider,
        row.provider_checkout_id,
        row.created_at,
        row.paid_at,
      ]),
    );
    logActivity({
      adminId: req.admin?.id,
      action: 'export',
      entityType: 'payment',
      details: { count: rows.length },
      ip: getClientIp(req),
    });
  }),
);

adminRouter.get(
  '/settings',
  asyncHandler(async (_req, res) => {
    const rows = db.prepare('SELECT key, value, updated_at FROM site_settings').all() as {
      key: string;
      value: string;
      updated_at: string;
    }[];
    const settings: Record<string, unknown> = {};
    for (const row of rows) settings[row.key] = parseJson(row.value, null);
    const legal = db.prepare('SELECT * FROM legal_pages ORDER BY slug').all();
    res.json({ settings, legal });
  }),
);

const ALLOWED_SETTING_KEYS = new Set([
  'brand',
  'hero',
  'stats',
  'seo',
  'footer',
  'cta',
  'general',
  'legalNotice',
  'legalNotice_fa',
  'contentVerification',
]);

adminRouter.put(
  '/settings',
  requireRole('owner'),
  asyncHandler(async (req, res) => {
    const parsed = settingsUpdateSchema.safeParse(req.body);
    if (!parsed.success) throw validationError(parsed.error);
    const entries = Object.entries(parsed.data).filter(([key]) => ALLOWED_SETTING_KEYS.has(key));
    if (entries.length === 0) throw new HttpError(400, 'No supported settings were provided.', 'NO_CHANGES');
    for (const [key, value] of entries) {
      if (typeof value !== 'object' || value === null) {
        if (typeof value !== 'string') throw new HttpError(400, `Invalid setting: ${key}`, 'VALIDATION_ERROR');
      }
      const serialized = JSON.stringify(value);
      if (serialized.length > 100000) {
        throw new HttpError(413, `Setting ${key} is too large.`, 'PAYLOAD_TOO_LARGE');
      }
      db.prepare(
        `INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
      ).run(key, serialized, nowIso());
    }
    logActivity({
      adminId: req.admin?.id,
      action: 'settings_update',
      entityType: 'settings',
      details: { keys: entries.map(([key]) => key) },
      ip: getClientIp(req),
    });
    res.json({ ok: true });
  }),
);

const legalSchema = z.object({
  title_en: z.string().trim().min(2).max(200),
  title_fa: z.string().trim().min(2).max(200),
  body_en: z.string().trim().min(10).max(100000),
  body_fa: z.string().trim().min(10).max(100000),
});

adminRouter.put(
  '/legal/:slug',
  requireRole('owner', 'editor'),
  asyncHandler(async (req, res) => {
    const slug = String(req.params.slug);
    if (!['privacy-policy', 'terms-and-conditions'].includes(slug)) {
      throw new HttpError(404, 'Page not found.', 'NOT_FOUND');
    }
    const parsed = legalSchema.safeParse(req.body);
    if (!parsed.success) throw validationError(parsed.error);
    db.prepare(
      `INSERT INTO legal_pages (slug, title_en, title_fa, body_en, body_fa, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(slug) DO UPDATE SET title_en = excluded.title_en, title_fa = excluded.title_fa,
         body_en = excluded.body_en, body_fa = excluded.body_fa, updated_at = excluded.updated_at`,
    ).run(
      slug,
      parsed.data.title_en,
      parsed.data.title_fa,
      parsed.data.body_en,
      parsed.data.body_fa,
      nowIso(),
    );
    logActivity({
      adminId: req.admin?.id,
      action: 'update',
      entityType: 'legal_page',
      entityId: slug,
      ip: getClientIp(req),
    });
    res.json({ ok: true });
  }),
);

registerCrud(adminRouter, {
  path: '/services',
  table: 'services',
  entityLabel: 'Service',
  schema: serviceSchema,
  orderBy: 'sort_order ASC, id ASC',
  searchColumns: ['title_en', 'title_fa', 'slug', 'category_en'],
});

registerCrud(adminRouter, {
  path: '/destinations',
  table: 'destinations',
  entityLabel: 'Destination',
  schema: destinationSchema,
  orderBy: 'sort_order ASC, id ASC',
  searchColumns: ['name_en', 'name_fa', 'slug', 'country_code'],
});

registerCrud(adminRouter, {
  path: '/packages',
  table: 'packages',
  entityLabel: 'Package',
  schema: packageSchema,
  orderBy: 'sort_order ASC, id ASC',
  searchColumns: ['name_en', 'name_fa', 'slug'],
});

registerCrud(adminRouter, {
  path: '/experts',
  table: 'experts',
  entityLabel: 'Expert',
  schema: expertSchema,
  orderBy: 'sort_order ASC, id ASC',
  searchColumns: ['name', 'role_en', 'role_fa', 'slug'],
});

registerCrud(adminRouter, {
  path: '/categories',
  table: 'article_categories',
  entityLabel: 'Article category',
  schema: categorySchema,
  orderBy: 'sort_order ASC, id ASC',
  searchColumns: ['name_en', 'name_fa', 'slug'],
});

registerCrud(adminRouter, {
  path: '/articles',
  table: 'articles',
  entityLabel: 'Article',
  schema: articleSchema,
  orderBy: 'created_at DESC',
  listSql: `SELECT a.*, c.slug AS category_slug, c.name_en AS category_name_en,
                   c.name_fa AS category_name_fa
            FROM articles a LEFT JOIN article_categories c ON c.id = a.category_id`,
  searchColumns: ['a.title_en', 'a.title_fa', 'a.slug'],
  transformCreate: (data) => {
    if (data.status === 'published' && !data.published_at) data.published_at = nowIso();
    return data;
  },
  transformUpdate: (data) => {
    if (data.status === 'published' && !data.published_at) data.published_at = nowIso();
    return data;
  },
});

registerCrud(adminRouter, {
  path: '/faqs',
  table: 'faqs',
  entityLabel: 'FAQ',
  schema: faqSchema,
  orderBy: 'category ASC, sort_order ASC, id ASC',
  searchColumns: ['question_en', 'question_fa', 'answer_en', 'answer_fa'],
});

registerCrud(adminRouter, {
  path: '/testimonials',
  table: 'testimonials',
  entityLabel: 'Testimonial',
  schema: testimonialSchema,
  orderBy: 'sort_order ASC, id ASC',
  searchColumns: ['name', 'country', 'quote_en'],
});

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => {
      fs.mkdirSync(config.uploadsDir, { recursive: true });
      callback(null, config.uploadsDir);
    },
    filename: (_req, file, callback) => {
      const ext =
        file.mimetype === 'image/png'
          ? '.png'
          : file.mimetype === 'image/webp'
            ? '.webp'
            : file.mimetype === 'image/gif'
              ? '.gif'
              : '.jpg';
      callback(null, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`);
    },
  }),
  limits: { fileSize: config.maxUploadBytes, files: 1 },
  fileFilter: (_req, file, callback) => {
    const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
    if (!allowed.has(file.mimetype)) {
      callback(new HttpError(415, 'Only JPG, PNG, WebP or GIF images are allowed.', 'INVALID_FILE_TYPE'));
      return;
    }
    callback(null, true);
  },
});

function validImageMagic(filePath: string) {
  const fd = fs.openSync(filePath, 'r');
  const buffer = Buffer.alloc(12);
  fs.readSync(fd, buffer, 0, 12, 0);
  fs.closeSync(fd);
  const hex = buffer.toString('hex');
  return (
    hex.startsWith('ffd8ff') ||
    hex.startsWith('89504e470d0a1a0a') ||
    (hex.startsWith('52494646') && buffer.subarray(8, 12).toString() === 'WEBP') ||
    hex.startsWith('47494638')
  );
}

adminRouter.post(
  '/uploads',
  requireRole('owner', 'editor'),
  upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new HttpError(400, 'No image was uploaded.', 'NO_FILE');
    if (!validImageMagic(req.file.path)) {
      fs.rmSync(req.file.path, { force: true });
      throw new HttpError(415, 'The file content does not match a supported image format.', 'INVALID_FILE_TYPE');
    }
    logActivity({
      adminId: req.admin?.id,
      action: 'upload',
      entityType: 'file',
      entityId: req.file.filename,
      details: { bytes: req.file.size },
      ip: getClientIp(req),
    });
    res.status(201).json({ url: `/uploads/${req.file.filename}` });
  }),
);
