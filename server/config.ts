import 'dotenv/config';
import path from 'node:path';
import fs from 'node:fs';
import type { CookieOptions } from 'express';

const rootDir = path.resolve(process.cwd());
const isProduction = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT || 4000);
const sessionSecret = process.env.SESSION_SECRET || '';

if (!sessionSecret || (isProduction && sessionSecret.length < 32)) {
  throw new Error('SESSION_SECRET must be set to at least 32 characters.');
}

export const config = {
  rootDir,
  isProduction,
  port,
  appOrigin: process.env.APP_ORIGIN || 'http://127.0.0.1:5173',
  publicSiteUrl: process.env.PUBLIC_SITE_URL || 'http://127.0.0.1:5173',
  sessionSecret,
  sessionTtlHours: Number(process.env.SESSION_TTL_HOURS || 12),
  databasePath: path.resolve(rootDir, process.env.DATABASE_PATH || 'data/faratech.db'),
  uploadsDir: path.resolve(rootDir, process.env.UPLOAD_DIR || 'public/uploads'),
  maxUploadBytes: Number(process.env.MAX_UPLOAD_MB || 5) * 1024 * 1024,
  defaultCurrency: (process.env.DEFAULT_CURRENCY || 'USD').toUpperCase(),
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    successUrl:
      process.env.STRIPE_SUCCESS_URL ||
      'http://127.0.0.1:5173/payment/success?session_id={CHECKOUT_SESSION_ID}',
    cancelUrl: process.env.STRIPE_CANCEL_URL || 'http://127.0.0.1:5173/payment/cancelled',
    enabled: Boolean(process.env.STRIPE_SECRET_KEY),
  },
  contentVerified: process.env.PUBLIC_CONTENT_VERIFIED === 'true',
  seedAdmin: {
    name: process.env.SEED_ADMIN_NAME || 'Site Administrator',
    email: (process.env.SEED_ADMIN_EMAIL || 'admin@faratech.example').toLowerCase(),
    password: process.env.SEED_ADMIN_PASSWORD || '',
  },
};

export const ADMIN_COOKIE = 'faratech_admin_session';
export const CSRF_HEADER = 'x-csrf-token';

export const sessionCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: isProduction,
  path: '/',
  maxAge: config.sessionTtlHours * 60 * 60 * 1000,
};

export function ensureRuntimeDirectories() {
  fs.mkdirSync(path.dirname(config.databasePath), { recursive: true });
  fs.mkdirSync(config.uploadsDir, { recursive: true });
}
