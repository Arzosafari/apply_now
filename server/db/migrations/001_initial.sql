-- FaraTech relational schema (SQLite)
-- All timestamps are ISO-8601 UTC strings. Monetary values use minor units.

CREATE TABLE admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'editor', 'advisor')),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  last_login_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE admin_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token_hash TEXT NOT NULL UNIQUE,
  admin_id INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  csrf_token TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_admin_sessions_expiry ON admin_sessions(expires_at);
CREATE INDEX idx_admin_sessions_admin ON admin_sessions(admin_id);

CREATE TABLE services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  category_en TEXT NOT NULL DEFAULT 'Immigration',
  category_fa TEXT NOT NULL DEFAULT 'مهاجرت',
  icon TEXT NOT NULL DEFAULT 'globe',
  image TEXT,
  title_en TEXT NOT NULL,
  title_fa TEXT NOT NULL,
  short_en TEXT NOT NULL,
  short_fa TEXT NOT NULL,
  description_en TEXT NOT NULL DEFAULT '',
  description_fa TEXT NOT NULL DEFAULT '',
  eligibility_en TEXT NOT NULL DEFAULT '[]',
  eligibility_fa TEXT NOT NULL DEFAULT '[]',
  documents_en TEXT NOT NULL DEFAULT '[]',
  documents_fa TEXT NOT NULL DEFAULT '[]',
  process_en TEXT NOT NULL DEFAULT '[]',
  process_fa TEXT NOT NULL DEFAULT '[]',
  benefits_en TEXT NOT NULL DEFAULT '[]',
  benefits_fa TEXT NOT NULL DEFAULT '[]',
  faqs_en TEXT NOT NULL DEFAULT '[]',
  faqs_fa TEXT NOT NULL DEFAULT '[]',
  timeline_en TEXT,
  timeline_fa TEXT,
  seo_title_en TEXT,
  seo_title_fa TEXT,
  seo_description_en TEXT,
  seo_description_fa TEXT,
  featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0, 1)),
  published INTEGER NOT NULL DEFAULT 1 CHECK (published IN (0, 1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX idx_services_published ON services(published, sort_order);
CREATE INDEX idx_services_category ON services(category_en);

CREATE TABLE destinations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  country_code TEXT NOT NULL,
  flag TEXT,
  image TEXT,
  name_en TEXT NOT NULL,
  name_fa TEXT NOT NULL,
  tagline_en TEXT NOT NULL DEFAULT '',
  tagline_fa TEXT NOT NULL DEFAULT '',
  overview_en TEXT NOT NULL DEFAULT '',
  overview_fa TEXT NOT NULL DEFAULT '',
  education_en TEXT NOT NULL DEFAULT '',
  education_fa TEXT NOT NULL DEFAULT '',
  universities_en TEXT NOT NULL DEFAULT '[]',
  universities_fa TEXT NOT NULL DEFAULT '[]',
  study_pathways_en TEXT NOT NULL DEFAULT '[]',
  study_pathways_fa TEXT NOT NULL DEFAULT '[]',
  work_pathways_en TEXT NOT NULL DEFAULT '[]',
  work_pathways_fa TEXT NOT NULL DEFAULT '[]',
  pr_pathways_en TEXT NOT NULL DEFAULT '[]',
  pr_pathways_fa TEXT NOT NULL DEFAULT '[]',
  family_pathways_en TEXT NOT NULL DEFAULT '[]',
  family_pathways_fa TEXT NOT NULL DEFAULT '[]',
  investment_pathways_en TEXT NOT NULL DEFAULT '[]',
  investment_pathways_fa TEXT NOT NULL DEFAULT '[]',
  highlights_en TEXT NOT NULL DEFAULT '[]',
  highlights_fa TEXT NOT NULL DEFAULT '[]',
  eligibility_en TEXT NOT NULL DEFAULT '[]',
  eligibility_fa TEXT NOT NULL DEFAULT '[]',
  documents_en TEXT NOT NULL DEFAULT '[]',
  documents_fa TEXT NOT NULL DEFAULT '[]',
  process_en TEXT NOT NULL DEFAULT '[]',
  process_fa TEXT NOT NULL DEFAULT '[]',
  seo_title_en TEXT,
  seo_title_fa TEXT,
  seo_description_en TEXT,
  seo_description_fa TEXT,
  featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0, 1)),
  published INTEGER NOT NULL DEFAULT 1 CHECK (published IN (0, 1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX idx_destinations_published ON destinations(published, sort_order);

CREATE TABLE packages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_fa TEXT NOT NULL,
  description_en TEXT NOT NULL DEFAULT '',
  description_fa TEXT NOT NULL DEFAULT '',
  price_minor INTEGER NOT NULL DEFAULT 0 CHECK (price_minor >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  billing_type TEXT NOT NULL DEFAULT 'one_time' CHECK (billing_type IN ('one_time', 'deposit', 'custom')),
  duration_en TEXT,
  duration_fa TEXT,
  features_en TEXT NOT NULL DEFAULT '[]',
  features_fa TEXT NOT NULL DEFAULT '[]',
  exclusions_en TEXT NOT NULL DEFAULT '[]',
  exclusions_fa TEXT NOT NULL DEFAULT '[]',
  cta_type TEXT NOT NULL DEFAULT 'consultation' CHECK (cta_type IN ('consultation', 'payment')),
  featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0, 1)),
  visible INTEGER NOT NULL DEFAULT 1 CHECK (visible IN (0, 1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX idx_packages_visible ON packages(visible, sort_order);

CREATE TABLE experts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role_en TEXT NOT NULL,
  role_fa TEXT NOT NULL,
  expertise_en TEXT NOT NULL DEFAULT '',
  expertise_fa TEXT NOT NULL DEFAULT '',
  bio_en TEXT NOT NULL DEFAULT '',
  bio_fa TEXT NOT NULL DEFAULT '',
  languages_en TEXT NOT NULL DEFAULT '[]',
  languages_fa TEXT NOT NULL DEFAULT '[]',
  photo TEXT,
  linkedin_url TEXT,
  years_experience TEXT,
  is_demo INTEGER NOT NULL DEFAULT 0 CHECK (is_demo IN (0, 1)),
  published INTEGER NOT NULL DEFAULT 1 CHECK (published IN (0, 1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE article_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_fa TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  category_id INTEGER REFERENCES article_categories(id) ON DELETE SET NULL,
  author TEXT NOT NULL DEFAULT 'FaraTech Editorial',
  image TEXT,
  title_en TEXT NOT NULL,
  title_fa TEXT NOT NULL,
  excerpt_en TEXT NOT NULL DEFAULT '',
  excerpt_fa TEXT NOT NULL DEFAULT '',
  content_en TEXT NOT NULL DEFAULT '',
  content_fa TEXT NOT NULL DEFAULT '',
  reading_minutes INTEGER NOT NULL DEFAULT 5,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0, 1)),
  published_at TEXT,
  seo_title_en TEXT,
  seo_title_fa TEXT,
  seo_description_en TEXT,
  seo_description_fa TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX idx_articles_status ON articles(status, published_at DESC);
CREATE INDEX idx_articles_category ON articles(category_id);

CREATE TABLE faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'study', 'student-visa', 'work-visa', 'immigration', 'pricing', 'payments')),
  question_en TEXT NOT NULL,
  question_fa TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  answer_fa TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 1 CHECK (published IN (0, 1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX idx_faqs_published ON faqs(published, sort_order);

CREATE TABLE testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT '',
  service_en TEXT NOT NULL DEFAULT '',
  service_fa TEXT NOT NULL DEFAULT '',
  quote_en TEXT NOT NULL,
  quote_fa TEXT NOT NULL,
  photo TEXT,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_demo INTEGER NOT NULL DEFAULT 1 CHECK (is_demo IN (0, 1)),
  published INTEGER NOT NULL DEFAULT 1 CHECK (published IN (0, 1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE consultations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  contact_method TEXT NOT NULL DEFAULT 'email' CHECK (contact_method IN ('email', 'phone', 'whatsapp')),
  service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
  destination_id INTEGER REFERENCES destinations(id) ON DELETE SET NULL,
  education_level TEXT,
  message TEXT,
  preferred_date TEXT,
  privacy_consent INTEGER NOT NULL DEFAULT 0 CHECK (privacy_consent IN (0, 1)),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'contacted', 'in_progress', 'approved', 'rejected', 'completed')),
  source TEXT NOT NULL DEFAULT 'website',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX idx_consultations_status ON consultations(status, created_at DESC);
CREATE INDEX idx_consultations_service ON consultations(service_id);
CREATE INDEX idx_consultations_destination ON consultations(destination_id);
CREATE INDEX idx_consultations_email ON consultations(email);
CREATE INDEX idx_consultations_created ON consultations(created_at DESC);

CREATE TABLE consultation_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  consultation_id INTEGER NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
  admin_id INTEGER REFERENCES admins(id) ON DELETE SET NULL,
  note TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_notes_consultation ON consultation_notes(consultation_id, created_at DESC);

CREATE TABLE contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX idx_contact_status ON contact_messages(status, created_at DESC);

CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT NOT NULL UNIQUE,
  consultation_id INTEGER REFERENCES consultations(id) ON DELETE SET NULL,
  package_id INTEGER REFERENCES packages(id) ON DELETE SET NULL,
  provider TEXT NOT NULL DEFAULT 'stripe',
  provider_checkout_id TEXT UNIQUE,
  provider_payment_id TEXT,
  amount_minor INTEGER NOT NULL CHECK (amount_minor >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'successful', 'failed', 'cancelled', 'refunded')),
  description TEXT NOT NULL DEFAULT '',
  customer_email TEXT,
  receipt_url TEXT,
  metadata TEXT NOT NULL DEFAULT '{}',
  paid_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX idx_payments_status ON payments(status, created_at DESC);
CREATE INDEX idx_payments_consultation ON payments(consultation_id);
CREATE INDEX idx_payments_created ON payments(created_at DESC);

CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE legal_pages (
  slug TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_fa TEXT NOT NULL,
  body_en TEXT NOT NULL,
  body_fa TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_id INTEGER REFERENCES admins(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details TEXT NOT NULL DEFAULT '{}',
  ip TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_activity_created ON activity_logs(created_at DESC);
CREATE INDEX idx_activity_entity ON activity_logs(entity_type, entity_id);

CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL
);
