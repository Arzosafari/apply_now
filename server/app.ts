import path from 'node:path';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { config } from './config';
import { db, nowIso } from './db';
import { optionalAdmin } from './lib/auth';
import {
  HttpError,
  assertTrustedOrigin,
  errorHandler,
  notFoundHandler,
} from './lib/http';
import { adminRouter } from './routes/admin';
import { paymentRouter, stripeWebhookHandler } from './routes/payments';
import { publicRouter } from './routes/public';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
          fontSrc: ["'self'", 'data:'],
          connectSrc: ["'self'"],
          frameSrc: ["'self'", 'https://www.openstreetmap.org', 'https://www.google.com'],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: config.isProduction ? [] : null,
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'same-origin' },
    }),
  );
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });

  // Stripe signature verification requires the untouched raw request body.
  app.post(
    '/api/webhooks/stripe',
    express.raw({ type: 'application/json', limit: '1mb' }),
    stripeWebhookHandler,
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false, limit: '1mb' }));
  app.use(cookieParser(config.sessionSecret));
  app.use(optionalAdmin);

  app.use('/api', (req, _res, next) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      try {
        assertTrustedOrigin(req);
      } catch (error) {
        next(error);
        return;
      }
    }
    next();
  });

  app.use(
    '/uploads',
    express.static(config.uploadsDir, {
      dotfiles: 'deny',
      index: false,
      fallthrough: false,
      maxAge: '30d',
      immutable: true,
      setHeaders: (res) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Content-Disposition', 'inline');
      },
    }),
  );

  app.use('/api/public/payments', paymentRouter);
  app.use('/api/public', publicRouter);
  app.use('/api/admin', adminRouter);

  app.get('/api/health', (_req, res) => {
    const check = db.prepare('SELECT 1 AS ok').get() as { ok: number };
    res.json({
      ok: check.ok === 1,
      service: 'FaraTech',
      time: nowIso(),
      paymentConfigured: config.stripe.enabled,
    });
  });

  app.get('/sitemap.xml', (_req, res) => {
    const base = config.publicSiteUrl.replace(/\/$/, '');
    const staticPages = [
      '',
      '/services',
      '/destinations',
      '/pricing',
      '/experts',
      '/blog',
      '/about',
      '/contact',
      '/faq',
      '/consultation',
      '/privacy-policy',
      '/terms-and-conditions',
    ];
    const services = db.prepare('SELECT slug, updated_at FROM services WHERE published = 1').all() as {
      slug: string;
      updated_at: string;
    }[];
    const destinations = db
      .prepare('SELECT slug, updated_at FROM destinations WHERE published = 1')
      .all() as { slug: string; updated_at: string }[];
    const articles = db
      .prepare("SELECT slug, updated_at FROM articles WHERE status = 'published'")
      .all() as { slug: string; updated_at: string }[];
    const urls: string[] = [];
    for (const prefix of ['', '/fa']) {
      for (const page of staticPages) {
        const loc = `${base}${prefix}${page || '/'}`.replace(/\/$/, '/');
        urls.push(
          `  <url><loc>${loc}</loc><changefreq>${page === '' ? 'weekly' : 'monthly'}</changefreq><priority>${
            page === '' ? '1.0' : '0.7'
          }</priority></url>`,
        );
      }
      for (const service of services) {
        urls.push(
          `  <url><loc>${base}${prefix}/services/${service.slug}</loc><lastmod>${service.updated_at.slice(0, 10)}</lastmod></url>`,
        );
      }
      for (const destination of destinations) {
        urls.push(
          `  <url><loc>${base}${prefix}/destinations/${destination.slug}</loc><lastmod>${destination.updated_at.slice(0, 10)}</lastmod></url>`,
        );
      }
      for (const article of articles) {
        urls.push(
          `  <url><loc>${base}${prefix}/blog/${article.slug}</loc><lastmod>${article.updated_at.slice(0, 10)}</lastmod></url>`,
        );
      }
    }
    res
      .type('application/xml')
      .setHeader('Cache-Control', 'public, max-age=3600')
      .send(
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join(
          '\n',
        )}\n</urlset>`,
      );
  });

  app.get('/robots.txt', (_req, res) => {
    const base = config.publicSiteUrl.replace(/\/$/, '');
    res
      .type('text/plain')
      .setHeader('Cache-Control', 'public, max-age=3600')
      .send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\n\nSitemap: ${base}/sitemap.xml\n`);
  });

  if (config.isProduction) {
    const distDir = path.resolve(config.rootDir, 'dist');
    app.use(
      '/assets',
      express.static(path.join(distDir, 'assets'), {
        maxAge: '1y',
        immutable: true,
        fallthrough: false,
      }),
    );
    app.use(
      express.static(distDir, {
        index: false,
        maxAge: '1h',
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('index.html')) res.setHeader('Cache-Control', 'no-store');
        },
      }),
    );
    app.use((req, res, next) => {
      if (req.method !== 'GET' || req.path.startsWith('/api/')) {
        next();
        return;
      }
      res.setHeader('Cache-Control', 'no-store');
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.use((req, _res, next) => {
    if (req.path.startsWith('/api/')) {
      next(new HttpError(404, 'API endpoint not found.', 'NOT_FOUND'));
      return;
    }
    next();
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
