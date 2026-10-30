import bcrypt from 'bcryptjs';
import { config } from '../config';
import { db, nowIso } from './index';
import {
  articleCategories,
  articles,
  destinations,
  experts,
  faqs,
  legalPages,
  packages,
  services,
  settings,
  testimonials,
} from './seed-data';

const now = nowIso();

function insertRow(table: string, row: Record<string, unknown>) {
  const columns = Object.keys(row);
  const placeholders = columns.map(() => '?').join(', ');
  const values = columns.map((column) => {
    const value = row[column];
    if (value === undefined) return null;
    if (typeof value === 'boolean') return value ? 1 : 0;
    if (typeof value === 'object' && value !== null) return JSON.stringify(value);
    return value;
  });
  const sql = `INSERT OR IGNORE INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
  return db.prepare(sql).run(...values);
}

const run = db.transaction(() => {
  const existingAdmin = db.prepare('SELECT id FROM admins LIMIT 1').get();
  if (!existingAdmin) {
    if (!config.seedAdmin.password || config.seedAdmin.password.length < 10) {
      throw new Error('SEED_ADMIN_PASSWORD must be at least 10 characters to seed the first administrator.');
    }
    db.prepare(
      `INSERT INTO admins (email, name, password_hash, role, is_active, created_at, updated_at)
       VALUES (?, ?, ?, 'owner', 1, ?, ?)`,
    ).run(
      config.seedAdmin.email,
      config.seedAdmin.name,
      bcrypt.hashSync(config.seedAdmin.password, 12),
      now,
      now,
    );
    console.log(`✓ administrator seeded: ${config.seedAdmin.email}`);
  } else {
    console.log('✓ administrator already exists');
  }

  for (const service of services) {
    const { faqs_en, faqs_fa, ...rest } = service;
    insertRow('services', {
      ...rest,
      faqs_en: JSON.stringify(faqs_en ?? []),
      faqs_fa: JSON.stringify(faqs_fa ?? []),
      published: 1,
      created_at: now,
      updated_at: now,
    });
  }
  console.log(`✓ services: ${services.length}`);

  for (const destination of destinations) {
    insertRow('destinations', {
      ...destination,
      published: 1,
      created_at: now,
      updated_at: now,
    });
  }
  console.log(`✓ destinations: ${destinations.length}`);

  for (const item of packages) {
    insertRow('packages', {
      ...item,
      visible: 1,
      created_at: now,
      updated_at: now,
    });
  }
  console.log(`✓ packages: ${packages.length}`);

  for (const expert of experts) {
    insertRow('experts', {
      ...expert,
      published: 1,
      created_at: now,
      updated_at: now,
    });
  }
  console.log(`✓ experts: ${experts.length}`);

  for (const category of articleCategories) {
    insertRow('article_categories', { ...category, created_at: now, updated_at: now });
  }

  for (const article of articles) {
    const category = db
      .prepare('SELECT id FROM article_categories WHERE slug = ?')
      .get(article.category) as { id: number } | undefined;
    const { category: _category, ...rest } = article;
    insertRow('articles', {
      ...rest,
      category_id: category?.id ?? null,
      created_at: now,
      updated_at: now,
    });
  }
  console.log(`✓ articles: ${articles.length}`);

  for (const faq of faqs) {
    insertRow('faqs', {
      ...faq,
      published: 1,
      created_at: now,
      updated_at: now,
    });
  }
  console.log(`✓ FAQs: ${faqs.length}`);

  for (const testimonial of testimonials) {
    insertRow('testimonials', {
      ...testimonial,
      published: 1,
      created_at: now,
      updated_at: now,
    });
  }

  for (const [key, value] of Object.entries(settings)) {
    db.prepare(
      `INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(key) DO NOTHING`,
    ).run(key, JSON.stringify(value), now);
  }

  for (const page of legalPages) {
    db.prepare(
      `INSERT OR IGNORE INTO legal_pages (slug, title_en, title_fa, body_en, body_fa, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(page.slug, page.title_en, page.title_fa, page.body_en, page.body_fa, now);
  }

  db.prepare(
    `INSERT INTO activity_logs (admin_id, action, entity_type, entity_id, details, ip, created_at)
     VALUES ((SELECT id FROM admins LIMIT 1), 'seed', 'system', 'initial', ?, NULL, ?)`,
  ).run(JSON.stringify({ message: 'Initial demonstration content seeded.' }), now);
});

run();
console.log('Seed complete.');
console.log(`Admin sign-in: ${config.seedAdmin.email}`);
console.log('Change the seeded password immediately in production.');
