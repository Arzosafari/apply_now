import crypto from 'node:crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { config } from '../config';
import { db, nowIso, parseJson } from '../db';
import { HttpError, asyncHandler, parsePagination, validationError } from '../lib/http';
import { serializeRows, serializeRow } from '../lib/serialize';
import type { Article, Destination, Service, SiteSettings } from '../../src/shared/types';

export const publicRouter = Router();

const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 12,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: 'Too many submissions from this connection. Please wait and try again, or contact us directly.',
    code: 'RATE_LIMITED',
  },
});

function loadSettings(): { settings: SiteSettings; raw: Record<string, string> } {
  const rows = db.prepare('SELECT key, value FROM site_settings').all() as {
    key: string;
    value: string;
  }[];
  const raw: Record<string, string> = {};
  const merged: Record<string, unknown> = {};
  for (const row of rows) {
    raw[row.key] = row.value;
    merged[row.key] = parseJson(row.value, null);
  }
  return { settings: merged as unknown as SiteSettings, raw };
}

function getPublishedServices() {
  return serializeRows<Service>(
    db
      .prepare('SELECT * FROM services WHERE published = 1 ORDER BY sort_order ASC, id ASC')
      .all(),
  );
}

function getPublishedDestinations() {
  return serializeRows<Destination>(
    db
      .prepare('SELECT * FROM destinations WHERE published = 1 ORDER BY sort_order ASC, id ASC')
      .all(),
  );
}

function getPublishedArticles(limit = 100, offset = 0) {
  return serializeRows<Article>(
    db
      .prepare(
        `SELECT a.*, c.slug AS category_slug, c.name_en AS category_name_en, c.name_fa AS category_name_fa
         FROM articles a
         LEFT JOIN article_categories c ON c.id = a.category_id
         WHERE a.status = 'published' AND (a.published_at IS NULL OR a.published_at <= ?)
         ORDER BY a.featured DESC, a.published_at DESC, a.id DESC
         LIMIT ? OFFSET ?`,
      )
      .all(nowIso(), limit, offset),
  );
}

publicRouter.get(
  '/site',
  asyncHandler(async (_req, res) => {
    const { settings } = loadSettings();
    const services = getPublishedServices();
    const destinations = getPublishedDestinations();
    const packages = serializeRows(
      db.prepare('SELECT * FROM packages WHERE visible = 1 ORDER BY sort_order ASC, id ASC').all(),
    );
    const experts = serializeRows(
      db.prepare('SELECT * FROM experts WHERE published = 1 ORDER BY sort_order ASC, id ASC').all(),
    );
    const faqs = serializeRows(
      db.prepare('SELECT * FROM faqs WHERE published = 1 ORDER BY sort_order ASC, id ASC').all(),
    );
    const testimonials = serializeRows(
      db
        .prepare('SELECT * FROM testimonials WHERE published = 1 ORDER BY sort_order ASC, id ASC')
        .all(),
    );
    const categories = db
      .prepare('SELECT * FROM article_categories ORDER BY sort_order ASC, id ASC')
      .all();
    res.json({
      settings,
      services,
      destinations,
      packages,
      experts,
      faqs,
      testimonials,
      categories,
      articles: getPublishedArticles(6),
      contentVerified: config.contentVerified && Boolean(settings.contentVerification?.verified),
      payment: {
        enabled: config.stripe.enabled,
        provider: 'stripe',
        currency: config.defaultCurrency,
      },
    });
  }),
);

publicRouter.get(
  '/services',
  asyncHandler(async (req, res) => {
    const category = typeof req.query.category === 'string' ? req.query.category : '';
    const featured = req.query.featured === 'true';
    let items = getPublishedServices();
    if (category) {
      items = items.filter(
        (item) => item.category_en.toLowerCase() === category.toLowerCase() || item.category_fa === category,
      );
    }
    if (featured) items = items.filter((item) => item.featured);
    res.json({ items });
  }),
);

publicRouter.get(
  '/services/:slug',
  asyncHandler(async (req, res) => {
    const service = db
      .prepare('SELECT * FROM services WHERE slug = ? AND published = 1')
      .get(req.params.slug);
    if (!service) throw new HttpError(404, 'Service not found.', 'NOT_FOUND');
    const related = serializeRows<Service>(
      db
        .prepare(
          `SELECT * FROM services
           WHERE published = 1 AND id != ? AND (category_en = ? OR featured = 1)
           ORDER BY featured DESC, sort_order ASC LIMIT 3`,
        )
        .all((service as { id: number }).id, (service as { category_en: string }).category_en),
    );
    res.json({ service: serializeRow<Service>(service), related });
  }),
);

publicRouter.get(
  '/destinations',
  asyncHandler(async (req, res) => {
    const search = typeof req.query.search === 'string' ? req.query.search.toLowerCase().trim() : '';
    const pathway = typeof req.query.pathway === 'string' ? req.query.pathway : '';
    let items = getPublishedDestinations();
    if (search) {
      items = items.filter(
        (item) =>
          item.name_en.toLowerCase().includes(search) ||
          item.name_fa.includes(search) ||
          item.tagline_en.toLowerCase().includes(search) ||
          item.tagline_fa.includes(search),
      );
    }
    if (pathway) {
      const keys: Record<string, keyof Destination> = {
        study: 'study_pathways_en',
        work: 'work_pathways_en',
        pr: 'pr_pathways_en',
        family: 'family_pathways_en',
        investment: 'investment_pathways_en',
      };
      const key = keys[pathway];
      if (key) items = items.filter((item) => (item[key] as string[]).length > 0);
    }
    res.json({ items });
  }),
);

publicRouter.get(
  '/destinations/:slug',
  asyncHandler(async (req, res) => {
    const row = db
      .prepare('SELECT * FROM destinations WHERE slug = ? AND published = 1')
      .get(req.params.slug);
    if (!row) throw new HttpError(404, 'Destination not found.', 'NOT_FOUND');
    const destination = serializeRow<Destination>(row);
    const relatedServices = serializeRows<Service>(
      db
        .prepare(
          `SELECT * FROM services WHERE published = 1
           ORDER BY featured DESC, sort_order ASC LIMIT 4`,
        )
        .all(),
    );
    const relatedArticles = getPublishedArticles(3);
    res.json({ destination, relatedServices, relatedArticles });
  }),
);

publicRouter.get(
  '/packages',
  asyncHandler(async (_req, res) => {
    const items = serializeRows(
      db.prepare('SELECT * FROM packages WHERE visible = 1 ORDER BY sort_order ASC, id ASC').all(),
    );
    res.json({ items, paymentEnabled: config.stripe.enabled });
  }),
);

publicRouter.get(
  '/experts',
  asyncHandler(async (_req, res) => {
    const items = serializeRows(
      db.prepare('SELECT * FROM experts WHERE published = 1 ORDER BY sort_order ASC, id ASC').all(),
    );
    res.json({ items });
  }),
);

publicRouter.get(
  '/experts/:slug',
  asyncHandler(async (req, res) => {
    const expert = db
      .prepare('SELECT * FROM experts WHERE slug = ? AND published = 1')
      .get(req.params.slug);
    if (!expert) throw new HttpError(404, 'Expert profile not found.', 'NOT_FOUND');
    res.json({ expert: serializeRow(expert) });
  }),
);

publicRouter.get(
  '/articles',
  asyncHandler(async (req, res) => {
    const { page, pageSize, offset } = parsePagination(req.query);
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
    const featured = req.query.featured === 'true';
    const where: string[] = ["a.status = 'published'", '(a.published_at IS NULL OR a.published_at <= ?)'];
    const params: unknown[] = [nowIso()];
    if (search) {
      where.push('(a.title_en LIKE ? OR a.title_fa LIKE ? OR a.excerpt_en LIKE ? OR a.excerpt_fa LIKE ?)');
      const like = `%${search}%`;
      params.push(like, like, like, like);
    }
    if (category) {
      where.push('c.slug = ?');
      params.push(category);
    }
    if (featured) where.push('a.featured = 1');
    const whereSql = where.join(' AND ');
    const total = (
      db
        .prepare(
          `SELECT COUNT(*) AS count FROM articles a
           LEFT JOIN article_categories c ON c.id = a.category_id WHERE ${whereSql}`,
        )
        .get(...params) as { count: number }
    ).count;
    const items = serializeRows<Article>(
      db
        .prepare(
          `SELECT a.*, c.slug AS category_slug, c.name_en AS category_name_en, c.name_fa AS category_name_fa
           FROM articles a LEFT JOIN article_categories c ON c.id = a.category_id
           WHERE ${whereSql}
           ORDER BY a.featured DESC, a.published_at DESC, a.id DESC LIMIT ? OFFSET ?`,
        )
        .all(...params, pageSize, offset),
    );
    res.json({ items, total, page, pageSize });
  }),
);

publicRouter.get(
  '/articles/:slug',
  asyncHandler(async (req, res) => {
    const article = db
      .prepare(
        `SELECT a.*, c.slug AS category_slug, c.name_en AS category_name_en, c.name_fa AS category_name_fa
         FROM articles a LEFT JOIN article_categories c ON c.id = a.category_id
         WHERE a.slug = ? AND a.status = 'published' AND (a.published_at IS NULL OR a.published_at <= ?)`,
      )
      .get(req.params.slug, nowIso());
    if (!article) throw new HttpError(404, 'Article not found.', 'NOT_FOUND');
    const related = serializeRows<Article>(
      db
        .prepare(
          `SELECT a.*, c.slug AS category_slug, c.name_en AS category_name_en, c.name_fa AS category_name_fa
           FROM articles a LEFT JOIN article_categories c ON c.id = a.category_id
           WHERE a.status = 'published' AND a.id != ?
             AND (a.published_at IS NULL OR a.published_at <= ?)
           ORDER BY CASE WHEN a.category_id = ? THEN 0 ELSE 1 END, a.published_at DESC
           LIMIT 3`,
        )
        .all(
          (article as { id: number }).id,
          nowIso(),
          (article as { category_id: number | null }).category_id,
        ),
    );
    res.json({ article: serializeRow<Article>(article), related });
  }),
);

publicRouter.get(
  '/faqs',
  asyncHandler(async (_req, res) => {
    const items = serializeRows(
      db.prepare('SELECT * FROM faqs WHERE published = 1 ORDER BY sort_order ASC, id ASC').all(),
    );
    res.json({ items });
  }),
);

publicRouter.get(
  '/testimonials',
  asyncHandler(async (_req, res) => {
    const items = serializeRows(
      db
        .prepare('SELECT * FROM testimonials WHERE published = 1 ORDER BY sort_order ASC, id ASC')
        .all(),
    );
    res.json({ items });
  }),
);

publicRouter.get(
  '/legal/:slug',
  asyncHandler(async (req, res) => {
    const slug = String(req.params.slug);
    if (!['privacy-policy', 'terms-and-conditions'].includes(slug)) {
      throw new HttpError(404, 'Page not found.', 'NOT_FOUND');
    }
    const page = db.prepare('SELECT * FROM legal_pages WHERE slug = ?').get(slug);
    if (!page) throw new HttpError(404, 'Page not found.', 'NOT_FOUND');
    res.json({ page });
  }),
);

const consultationSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name.').max(120),
  email: z.string().trim().email('Please enter a valid email address.').max(254),
  phone: z.string().trim().min(5, 'Please enter a contact number.').max(40),
  contactMethod: z.enum(['email', 'phone', 'whatsapp']),
  serviceId: z.number().int().positive().nullable().optional(),
  destinationId: z.number().int().positive().nullable().optional(),
  educationLevel: z.string().trim().max(120).optional().nullable(),
  message: z.string().trim().max(4000).optional().nullable(),
  preferredDate: z.string().trim().max(40).optional().nullable(),
  privacyConsent: z.literal(true, { message: 'Please accept the privacy policy to continue.' }),
  website: z.string().max(200).optional(),
});

publicRouter.post(
  '/consultations',
  formLimiter,
  asyncHandler(async (req, res) => {
    const parsed = consultationSchema.safeParse(req.body);
    if (!parsed.success) throw validationError(parsed.error);
    const input = parsed.data;

    // Honeypot: silently accept bot submissions without storing them.
    if (input.website) {
      res.status(201).json({
        reference: 'FT-RECEIVED',
        status: 'pending',
        message: 'Your request has been received.',
      });
      return;
    }

    if (input.preferredDate) {
      const chosen = new Date(input.preferredDate);
      if (Number.isNaN(chosen.getTime())) {
        throw new HttpError(400, 'Please choose a valid preferred date.', 'VALIDATION_ERROR');
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (chosen < today) {
        throw new HttpError(400, 'The preferred date cannot be in the past.', 'VALIDATION_ERROR');
      }
    }

    if (input.serviceId) {
      const exists = db.prepare('SELECT id FROM services WHERE id = ? AND published = 1').get(input.serviceId);
      if (!exists) throw new HttpError(400, 'Selected service is unavailable.', 'VALIDATION_ERROR');
    }
    if (input.destinationId) {
      const exists = db
        .prepare('SELECT id FROM destinations WHERE id = ? AND published = 1')
        .get(input.destinationId);
      if (!exists) throw new HttpError(400, 'Selected destination is unavailable.', 'VALIDATION_ERROR');
    }

    const year = new Date().getFullYear();
    let reference = '';
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const suffix = crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 6);
      reference = `FT-${year}-${suffix}`;
      if (!db.prepare('SELECT id FROM consultations WHERE reference = ?').get(reference)) break;
    }
    const now = nowIso();
    db.prepare(
      `INSERT INTO consultations
       (reference, full_name, email, phone, contact_method, service_id, destination_id, education_level,
        message, preferred_date, privacy_consent, status, source, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'pending', 'website', ?, ?)`,
    ).run(
      reference,
      input.fullName,
      input.email.toLowerCase(),
      input.phone,
      input.contactMethod,
      input.serviceId ?? null,
      input.destinationId ?? null,
      input.educationLevel || null,
      input.message || null,
      input.preferredDate || null,
      now,
      now,
    );

    console.info(`[consultation] ${reference} saved (${input.email})`);
    res.status(201).json({
      reference,
      status: 'pending',
      message:
        'Your consultation request has been received. Keep your reference number for future contact.',
    });
  }),
);

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(120),
  email: z.string().trim().email('Please enter a valid email address.').max(254),
  phone: z.string().trim().max(40).optional().nullable(),
  subject: z.string().trim().min(2, 'Please add a subject.').max(180),
  message: z.string().trim().min(10, 'Please tell us a little more.').max(4000),
  website: z.string().max(200).optional(),
});

publicRouter.post(
  '/contact',
  formLimiter,
  asyncHandler(async (req, res) => {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) throw validationError(parsed.error);
    if (parsed.data.website) {
      res.status(201).json({ message: 'Your message has been received.' });
      return;
    }
    const now = nowIso();
    db.prepare(
      `INSERT INTO contact_messages (name, email, phone, subject, message, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'new', ?, ?)`,
    ).run(
      parsed.data.name,
      parsed.data.email.toLowerCase(),
      parsed.data.phone || null,
      parsed.data.subject,
      parsed.data.message,
      now,
      now,
    );
    res.status(201).json({ message: 'Your message has been received. We will reply as soon as possible.' });
  }),
);
