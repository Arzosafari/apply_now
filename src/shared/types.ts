export type Locale = 'en' | 'fa';

export type ConsultationStatus =
  | 'pending'
  | 'under_review'
  | 'contacted'
  | 'in_progress'
  | 'approved'
  | 'rejected'
  | 'completed';

export type PaymentStatus = 'pending' | 'successful' | 'failed' | 'cancelled' | 'refunded';

export type ArticleStatus = 'draft' | 'published';

export type ContactStatus = 'new' | 'read' | 'replied' | 'archived';

export interface Service {
  id: number;
  slug: string;
  category_en: string;
  category_fa: string;
  icon: string;
  image: string | null;
  title_en: string;
  title_fa: string;
  short_en: string;
  short_fa: string;
  description_en: string;
  description_fa: string;
  eligibility_en: string[];
  eligibility_fa: string[];
  documents_en: string[];
  documents_fa: string[];
  process_en: string[];
  process_fa: string[];
  benefits_en: string[];
  benefits_fa: string[];
  faqs_en: { q: string; a: string }[];
  faqs_fa: { q: string; a: string }[];
  timeline_en: string | null;
  timeline_fa: string | null;
  seo_title_en: string | null;
  seo_title_fa: string | null;
  seo_description_en: string | null;
  seo_description_fa: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Destination {
  id: number;
  slug: string;
  country_code: string;
  flag: string | null;
  image: string | null;
  name_en: string;
  name_fa: string;
  tagline_en: string;
  tagline_fa: string;
  overview_en: string;
  overview_fa: string;
  education_en: string;
  education_fa: string;
  universities_en: string[];
  universities_fa: string[];
  study_pathways_en: string[];
  study_pathways_fa: string[];
  work_pathways_en: string[];
  work_pathways_fa: string[];
  pr_pathways_en: string[];
  pr_pathways_fa: string[];
  family_pathways_en: string[];
  family_pathways_fa: string[];
  investment_pathways_en: string[];
  investment_pathways_fa: string[];
  highlights_en: string[];
  highlights_fa: string[];
  eligibility_en: string[];
  eligibility_fa: string[];
  documents_en: string[];
  documents_fa: string[];
  process_en: string[];
  process_fa: string[];
  seo_title_en: string | null;
  seo_title_fa: string | null;
  seo_description_en: string | null;
  seo_description_fa: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Package {
  id: number;
  slug: string;
  name_en: string;
  name_fa: string;
  description_en: string;
  description_fa: string;
  price_minor: number;
  currency: string;
  billing_type: 'one_time' | 'deposit' | 'custom';
  duration_en: string | null;
  duration_fa: string | null;
  features_en: string[];
  features_fa: string[];
  exclusions_en: string[];
  exclusions_fa: string[];
  cta_type: 'consultation' | 'payment';
  featured: boolean;
  visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Expert {
  id: number;
  slug: string;
  name: string;
  role_en: string;
  role_fa: string;
  expertise_en: string;
  expertise_fa: string;
  bio_en: string;
  bio_fa: string;
  languages_en: string[];
  languages_fa: string[];
  photo: string | null;
  linkedin_url: string | null;
  years_experience: string | null;
  is_demo: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ArticleCategory {
  id: number;
  slug: string;
  name_en: string;
  name_fa: string;
  sort_order: number;
}

export interface Article {
  id: number;
  slug: string;
  category_id: number | null;
  category_slug?: string | null;
  category_name_en?: string | null;
  category_name_fa?: string | null;
  author: string;
  image: string | null;
  title_en: string;
  title_fa: string;
  excerpt_en: string;
  excerpt_fa: string;
  content_en: string;
  content_fa: string;
  reading_minutes: number;
  status: ArticleStatus;
  featured: boolean;
  published_at: string | null;
  seo_title_en: string | null;
  seo_title_fa: string | null;
  seo_description_en: string | null;
  seo_description_fa: string | null;
  created_at: string;
  updated_at: string;
}

export interface Faq {
  id: number;
  category:
    | 'general'
    | 'study'
    | 'student-visa'
    | 'work-visa'
    | 'immigration'
    | 'pricing'
    | 'payments';
  question_en: string;
  question_fa: string;
  answer_en: string;
  answer_fa: string;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  name: string;
  country: string;
  service_en: string;
  service_fa: string;
  quote_en: string;
  quote_fa: string;
  photo: string | null;
  rating: number;
  is_demo: boolean;
  published: boolean;
  sort_order: number;
}

export interface Consultation {
  id: number;
  reference: string;
  full_name: string;
  email: string;
  phone: string;
  contact_method: 'email' | 'phone' | 'whatsapp';
  service_id: number | null;
  service_title_en?: string | null;
  service_title_fa?: string | null;
  destination_id: number | null;
  destination_name_en?: string | null;
  destination_name_fa?: string | null;
  education_level: string | null;
  message: string | null;
  preferred_date: string | null;
  privacy_consent: boolean;
  status: ConsultationStatus;
  source: string;
  notes_count?: number;
  payment_status?: PaymentStatus | null;
  created_at: string;
  updated_at: string;
}

export interface ConsultationNote {
  id: number;
  consultation_id: number;
  admin_id: number | null;
  admin_name?: string | null;
  note: string;
  created_at: string;
}

export interface Payment {
  id: number;
  reference: string;
  consultation_id: number | null;
  consultation_reference?: string | null;
  package_id: number | null;
  package_name_en?: string | null;
  package_name_fa?: string | null;
  provider: string;
  provider_checkout_id: string | null;
  provider_payment_id: string | null;
  amount_minor: number;
  currency: string;
  status: PaymentStatus;
  description: string;
  customer_email: string | null;
  receipt_url: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: ContactStatus;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: number;
  admin_id: number | null;
  admin_name?: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown> | string;
  created_at: string;
}

export interface Admin {
  id: number;
  email: string;
  name: string;
  role: 'owner' | 'editor' | 'advisor';
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

export interface SiteSettings {
  brand: {
    name: string;
    legalName: string;
    tagline: string;
    logoUrl?: string;
    description: string;
    description_fa: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    address_fa: string;
    city: string;
    country: string;
    hours: string;
    hours_fa: string;
    mapUrl: string;
    mapEmbedUrl: string;
    social: Record<string, string>;
  };
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    supporting: string;
    description: string;
    description_fa: string;
    eyebrow_fa?: string;
    title_fa?: string;
    highlight_fa?: string;
    supporting_fa?: string;
    primaryCta: string;
    primaryCta_fa?: string;
    secondaryCta: string;
    secondaryCta_fa?: string;
    image: string;
  };
  stats: { value: string; label_en: string; label_fa: string }[];
  seo: {
    title: string;
    title_fa: string;
    description: string;
    description_fa: string;
    ogImage: string;
  };
  footer: { statement: string; statement_fa: string };
  cta?: {
    title: string;
    title_fa: string;
    body: string;
    body_fa: string;
    button: string;
    button_fa: string;
  };
  general?: { defaultLanguage: 'en' | 'fa' };
  legalNotice: string;
  legalNotice_fa: string;
  contentVerification: { verified: boolean; note: string };
  [key: string]: unknown;
}

export interface PublicSitePayload {
  settings: SiteSettings;
  services: Service[];
  destinations: Destination[];
  packages: Package[];
  experts: Expert[];
  faqs: Faq[];
  testimonials: Testimonial[];
  articles: Article[];
  categories: ArticleCategory[];
  contentVerified: boolean;
  payment: { enabled: boolean; provider: string; currency: string };
}

export interface DashboardStats {
  consultations: {
    total: number;
    pending: number;
    under_review: number;
    contacted: number;
    in_progress: number;
    approved: number;
    rejected: number;
    completed: number;
  };
  content: {
    services: number;
    destinations: number;
    articlesPublished: number;
    articlesDraft: number;
    packages: number;
    experts: number;
    faqs: number;
  };
  payments: {
    successfulAmountMinor: number;
    successfulCount: number;
    pendingCount: number;
    failedCount: number;
    currency: string;
  };
  unreadMessages: number;
  recentConsultations: Consultation[];
  recentActivity: ActivityLog[];
  consultationsByDay: { date: string; count: number }[];
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const CONSULTATION_STATUSES: ConsultationStatus[] = [
  'pending',
  'under_review',
  'contacted',
  'in_progress',
  'approved',
  'rejected',
  'completed',
];

export const FAQ_CATEGORIES = [
  'general',
  'study',
  'student-visa',
  'work-visa',
  'immigration',
  'pricing',
  'payments',
] as const;
