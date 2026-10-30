import { z } from 'zod';

export const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens only.');

const optionalText = z.string().trim().max(20000).nullable().optional();
const arrayOfText = z.array(z.string().trim().max(1000)).max(50).default([]);
const faqArray = z
  .array(
    z.object({
      q: z.string().trim().min(1).max(500),
      a: z.string().trim().min(1).max(3000),
    }),
  )
  .max(30)
  .default([]);

export const serviceSchema = z.object({
  slug: slugSchema,
  category_en: z.string().trim().min(2).max(80),
  category_fa: z.string().trim().min(2).max(80),
  icon: z.string().trim().max(50).default('globe'),
  image: z.string().trim().max(500).nullable().optional(),
  title_en: z.string().trim().min(2).max(160),
  title_fa: z.string().trim().min(2).max(160),
  short_en: z.string().trim().min(2).max(500),
  short_fa: z.string().trim().min(2).max(500),
  description_en: z.string().trim().max(30000).default(''),
  description_fa: z.string().trim().max(30000).default(''),
  eligibility_en: arrayOfText,
  eligibility_fa: arrayOfText,
  documents_en: arrayOfText,
  documents_fa: arrayOfText,
  process_en: arrayOfText,
  process_fa: arrayOfText,
  benefits_en: arrayOfText,
  benefits_fa: arrayOfText,
  faqs_en: faqArray,
  faqs_fa: faqArray,
  timeline_en: optionalText,
  timeline_fa: optionalText,
  seo_title_en: optionalText,
  seo_title_fa: optionalText,
  seo_description_en: optionalText,
  seo_description_fa: optionalText,
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(100000).default(0),
});

export const destinationSchema = z.object({
  slug: slugSchema,
  country_code: z.string().trim().length(2).transform((v) => v.toUpperCase()),
  flag: z.string().trim().max(500).nullable().optional(),
  image: z.string().trim().max(500).nullable().optional(),
  name_en: z.string().trim().min(2).max(120),
  name_fa: z.string().trim().min(2).max(120),
  tagline_en: z.string().trim().max(300).default(''),
  tagline_fa: z.string().trim().max(300).default(''),
  overview_en: z.string().trim().max(30000).default(''),
  overview_fa: z.string().trim().max(30000).default(''),
  education_en: z.string().trim().max(20000).default(''),
  education_fa: z.string().trim().max(20000).default(''),
  universities_en: arrayOfText,
  universities_fa: arrayOfText,
  study_pathways_en: arrayOfText,
  study_pathways_fa: arrayOfText,
  work_pathways_en: arrayOfText,
  work_pathways_fa: arrayOfText,
  pr_pathways_en: arrayOfText,
  pr_pathways_fa: arrayOfText,
  family_pathways_en: arrayOfText,
  family_pathways_fa: arrayOfText,
  investment_pathways_en: arrayOfText,
  investment_pathways_fa: arrayOfText,
  highlights_en: arrayOfText,
  highlights_fa: arrayOfText,
  eligibility_en: arrayOfText,
  eligibility_fa: arrayOfText,
  documents_en: arrayOfText,
  documents_fa: arrayOfText,
  process_en: arrayOfText,
  process_fa: arrayOfText,
  seo_title_en: optionalText,
  seo_title_fa: optionalText,
  seo_description_en: optionalText,
  seo_description_fa: optionalText,
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(100000).default(0),
});

export const packageSchema = z.object({
  slug: slugSchema,
  name_en: z.string().trim().min(2).max(160),
  name_fa: z.string().trim().min(2).max(160),
  description_en: z.string().trim().max(3000).default(''),
  description_fa: z.string().trim().max(3000).default(''),
  price_minor: z.number().int().min(0).max(1000000000),
  currency: z.string().trim().length(3).transform((v) => v.toUpperCase()),
  billing_type: z.enum(['one_time', 'deposit', 'custom']).default('one_time'),
  duration_en: optionalText,
  duration_fa: optionalText,
  features_en: arrayOfText,
  features_fa: arrayOfText,
  exclusions_en: arrayOfText,
  exclusions_fa: arrayOfText,
  cta_type: z.enum(['consultation', 'payment']).default('consultation'),
  featured: z.boolean().default(false),
  visible: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(100000).default(0),
});

export const expertSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(2).max(160),
  role_en: z.string().trim().min(2).max(160),
  role_fa: z.string().trim().min(2).max(160),
  expertise_en: z.string().trim().max(500).default(''),
  expertise_fa: z.string().trim().max(500).default(''),
  bio_en: z.string().trim().max(10000).default(''),
  bio_fa: z.string().trim().max(10000).default(''),
  languages_en: arrayOfText,
  languages_fa: arrayOfText,
  photo: z.string().trim().max(500).nullable().optional(),
  linkedin_url: z.string().trim().url().max(500).nullable().optional().or(z.literal('')),
  years_experience: z.string().trim().max(50).nullable().optional(),
  is_demo: z.boolean().default(false),
  published: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(100000).default(0),
});

export const categorySchema = z.object({
  slug: slugSchema,
  name_en: z.string().trim().min(2).max(120),
  name_fa: z.string().trim().min(2).max(120),
  sort_order: z.number().int().min(0).max(10000).default(0),
});

export const articleSchema = z.object({
  slug: slugSchema,
  category_id: z.number().int().positive().nullable().optional(),
  author: z.string().trim().min(2).max(160).default('FaraTech Editorial'),
  image: z.string().trim().max(500).nullable().optional(),
  title_en: z.string().trim().min(2).max(240),
  title_fa: z.string().trim().min(2).max(240),
  excerpt_en: z.string().trim().max(1000).default(''),
  excerpt_fa: z.string().trim().max(1000).default(''),
  content_en: z.string().trim().max(200000).default(''),
  content_fa: z.string().trim().max(200000).default(''),
  reading_minutes: z.number().int().min(1).max(120).default(5),
  status: z.enum(['draft', 'published']).default('draft'),
  featured: z.boolean().default(false),
  published_at: z.string().trim().max(40).nullable().optional(),
  seo_title_en: optionalText,
  seo_title_fa: optionalText,
  seo_description_en: optionalText,
  seo_description_fa: optionalText,
});

export const faqSchema = z.object({
  category: z.enum(['general', 'study', 'student-visa', 'work-visa', 'immigration', 'pricing', 'payments']),
  question_en: z.string().trim().min(5).max(500),
  question_fa: z.string().trim().min(5).max(500),
  answer_en: z.string().trim().min(5).max(5000),
  answer_fa: z.string().trim().min(5).max(5000),
  published: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(10000).default(0),
});

export const testimonialSchema = z.object({
  name: z.string().trim().min(2).max(160),
  country: z.string().trim().max(120).default(''),
  service_en: z.string().trim().max(160).default(''),
  service_fa: z.string().trim().max(160).default(''),
  quote_en: z.string().trim().min(10).max(3000),
  quote_fa: z.string().trim().min(10).max(3000),
  photo: z.string().trim().max(500).nullable().optional(),
  rating: z.number().int().min(1).max(5).default(5),
  is_demo: z.boolean().default(true),
  published: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(10000).default(0),
});

export const consultationStatusSchema = z.object({
  status: z.enum([
    'pending',
    'under_review',
    'contacted',
    'in_progress',
    'approved',
    'rejected',
    'completed',
  ]),
});

export const noteSchema = z.object({
  note: z.string().trim().min(2).max(5000),
});

export const contactStatusSchema = z.object({
  status: z.enum(['new', 'read', 'replied', 'archived']),
});

export const settingsUpdateSchema = z.record(z.string(), z.unknown());
