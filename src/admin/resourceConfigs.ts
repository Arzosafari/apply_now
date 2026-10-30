import type { ResourceName } from '@/lib/api';

export type AdminFieldType =
  | 'text'
  | 'textarea'
  | 'markdown'
  | 'number'
  | 'money'
  | 'checkbox'
  | 'select'
  | 'image'
  | 'lines'
  | 'faqs'
  | 'datetime';

export interface AdminField {
  name: string;
  label: string;
  type: AdminFieldType;
  section: string;
  placeholder?: string;
  help?: string;
  required?: boolean;
  rows?: number;
  span?: 1 | 2;
  options?: { value: string; label: string }[];
  optionsFrom?: 'categories';
  nullable?: boolean;
}

export interface ResourceColumn {
  key: string;
  label: string;
  type?: 'text' | 'status' | 'boolean' | 'date' | 'money' | 'image' | 'number';
  secondaryKey?: string;
}

export interface ResourceConfig {
  resource: ResourceName;
  title: string;
  singular: string;
  description: string;
  fields: AdminField[];
  columns: ResourceColumn[];
  searchFields: string[];
  defaultValues: Record<string, unknown>;
  titleField: string;
  slugFrom?: string;
}

const sections = [
  { key: 'basics', label: 'Basics' },
  { key: 'en', label: 'English' },
  { key: 'fa', label: 'Persian' },
  { key: 'details', label: 'Details' },
  { key: 'seo', label: 'SEO' },
];

const publishFields: AdminField[] = [
  { name: 'published', label: 'Published', type: 'checkbox', section: 'basics' },
  { name: 'featured', label: 'Featured', type: 'checkbox', section: 'basics' },
  { name: 'sort_order', label: 'Display order', type: 'number', section: 'basics' },
  { name: 'slug', label: 'URL slug', type: 'text', section: 'basics', required: true, help: 'Lowercase letters, numbers and hyphens.' },
];

const seoFields = (prefix = ''): AdminField[] => [
  { name: `${prefix}seo_title_en`, label: 'SEO title (English)', type: 'text', section: 'seo', span: 2 },
  { name: `${prefix}seo_title_fa`, label: 'SEO title (Persian)', type: 'text', section: 'seo', span: 2 },
  { name: `${prefix}seo_description_en`, label: 'Meta description (English)', type: 'textarea', section: 'seo', rows: 3, span: 2 },
  { name: `${prefix}seo_description_fa`, label: 'Meta description (Persian)', type: 'textarea', section: 'seo', rows: 3, span: 2 },
];

const iconOptions = [
  { value: 'graduation-cap', label: 'Graduation cap' },
  { value: 'badge-check', label: 'Badge check' },
  { value: 'briefcase', label: 'Briefcase' },
  { value: 'home', label: 'Home' },
  { value: 'users', label: 'Family / users' },
  { value: 'plane', label: 'Plane' },
  { value: 'building', label: 'Building' },
  { value: 'trending-up', label: 'Trending up' },
  { value: 'landmark', label: 'Landmark' },
  { value: 'file-check', label: 'File check' },
  { value: 'globe', label: 'Globe' },
];

const serviceConfig: ResourceConfig = {
  resource: 'services',
  title: 'Services',
  singular: 'Service',
  description: 'Manage the services shown across the website, their requirements and bilingual content.',
  titleField: 'title_en',
  slugFrom: 'title_en',
  searchFields: ['title_en', 'title_fa', 'slug', 'category_en'],
  columns: [
    { key: 'title_en', label: 'Service', type: 'text', secondaryKey: 'title_fa' },
    { key: 'category_en', label: 'Category' },
    { key: 'published', label: 'Published', type: 'boolean' },
    { key: 'featured', label: 'Featured', type: 'boolean' },
    { key: 'sort_order', label: 'Order', type: 'number' },
  ],
  defaultValues: {
    slug: '',
    category_en: 'Immigration',
    category_fa: 'مهاجرت',
    icon: 'globe',
    image: null,
    title_en: '',
    title_fa: '',
    short_en: '',
    short_fa: '',
    description_en: '',
    description_fa: '',
    eligibility_en: [],
    eligibility_fa: [],
    documents_en: [],
    documents_fa: [],
    process_en: [],
    process_fa: [],
    benefits_en: [],
    benefits_fa: [],
    faqs_en: [],
    faqs_fa: [],
    timeline_en: '',
    timeline_fa: '',
    seo_title_en: '',
    seo_title_fa: '',
    seo_description_en: '',
    seo_description_fa: '',
    featured: false,
    published: true,
    sort_order: 0,
  },
  fields: [
    ...publishFields,
    { name: 'image', label: 'Service image', type: 'image', section: 'basics', span: 2, nullable: true },
    { name: 'category_en', label: 'Category (English)', type: 'text', section: 'basics', required: true },
    { name: 'category_fa', label: 'Category (Persian)', type: 'text', section: 'basics', required: true },
    { name: 'icon', label: 'Icon', type: 'select', section: 'basics', options: iconOptions },
    { name: 'title_en', label: 'Title (English)', type: 'text', section: 'en', required: true, span: 2 },
    { name: 'title_fa', label: 'Title (Persian)', type: 'text', section: 'fa', required: true, span: 2 },
    { name: 'short_en', label: 'Short description (English)', type: 'textarea', section: 'en', rows: 3, span: 2, required: true },
    { name: 'short_fa', label: 'Short description (Persian)', type: 'textarea', section: 'fa', rows: 3, span: 2, required: true },
    { name: 'description_en', label: 'Full description (English)', type: 'markdown', section: 'en', rows: 8, span: 2 },
    { name: 'description_fa', label: 'Full description (Persian)', type: 'markdown', section: 'fa', rows: 8, span: 2 },
    { name: 'eligibility_en', label: 'Eligibility (English) — one per line', type: 'lines', section: 'en', span: 2 },
    { name: 'eligibility_fa', label: 'Eligibility (Persian) — one per line', type: 'lines', section: 'fa', span: 2 },
    { name: 'documents_en', label: 'Documents (English) — one per line', type: 'lines', section: 'en', span: 2 },
    { name: 'documents_fa', label: 'Documents (Persian) — one per line', type: 'lines', section: 'fa', span: 2 },
    { name: 'process_en', label: 'Process steps (English) — one per line', type: 'lines', section: 'en', span: 2 },
    { name: 'process_fa', label: 'Process steps (Persian) — one per line', type: 'lines', section: 'fa', span: 2 },
    { name: 'benefits_en', label: 'Benefits (English) — one per line', type: 'lines', section: 'en', span: 2 },
    { name: 'benefits_fa', label: 'Benefits (Persian) — one per line', type: 'lines', section: 'fa', span: 2 },
    { name: 'timeline_en', label: 'Planning window (English)', type: 'text', section: 'details', span: 2 },
    { name: 'timeline_fa', label: 'Planning window (Persian)', type: 'text', section: 'details', span: 2 },
    { name: 'faqs_en', label: 'Service FAQs (English)', type: 'faqs', section: 'en', span: 2 },
    { name: 'faqs_fa', label: 'Service FAQs (Persian)', type: 'faqs', section: 'fa', span: 2 },
    ...seoFields(),
  ],
};

const destinationConfig: ResourceConfig = {
  resource: 'destinations',
  title: 'Destinations',
  singular: 'Destination',
  description: 'Manage country guides, pathways, documents and disclaimers.',
  titleField: 'name_en',
  slugFrom: 'name_en',
  searchFields: ['name_en', 'name_fa', 'slug', 'country_code'],
  columns: [
    { key: 'name_en', label: 'Country', type: 'text', secondaryKey: 'name_fa' },
    { key: 'country_code', label: 'Code' },
    { key: 'published', label: 'Published', type: 'boolean' },
    { key: 'featured', label: 'Featured', type: 'boolean' },
    { key: 'sort_order', label: 'Order', type: 'number' },
  ],
  defaultValues: {
    slug: '',
    country_code: '',
    flag: null,
    image: null,
    name_en: '',
    name_fa: '',
    tagline_en: '',
    tagline_fa: '',
    overview_en: '',
    overview_fa: '',
    education_en: '',
    education_fa: '',
    universities_en: [],
    universities_fa: [],
    study_pathways_en: [],
    study_pathways_fa: [],
    work_pathways_en: [],
    work_pathways_fa: [],
    pr_pathways_en: [],
    pr_pathways_fa: [],
    family_pathways_en: [],
    family_pathways_fa: [],
    investment_pathways_en: [],
    investment_pathways_fa: [],
    highlights_en: [],
    highlights_fa: [],
    eligibility_en: [],
    eligibility_fa: [],
    documents_en: [],
    documents_fa: [],
    process_en: [],
    process_fa: [],
    seo_title_en: '',
    seo_title_fa: '',
    seo_description_en: '',
    seo_description_fa: '',
    featured: false,
    published: true,
    sort_order: 0,
  },
  fields: [
    ...publishFields.slice(0, 3),
    { name: 'slug', label: 'URL slug', type: 'text', section: 'basics', required: true },
    { name: 'country_code', label: 'Country code (2 letters)', type: 'text', section: 'basics', required: true },
    { name: 'image', label: 'Country image', type: 'image', section: 'basics', span: 2, nullable: true },
    { name: 'flag', label: 'Flag image', type: 'image', section: 'basics', span: 2, nullable: true },
    { name: 'name_en', label: 'Country name (English)', type: 'text', section: 'en', required: true, span: 2 },
    { name: 'name_fa', label: 'Country name (Persian)', type: 'text', section: 'fa', required: true, span: 2 },
    { name: 'tagline_en', label: 'Tagline (English)', type: 'text', section: 'en', span: 2 },
    { name: 'tagline_fa', label: 'Tagline (Persian)', type: 'text', section: 'fa', span: 2 },
    { name: 'overview_en', label: 'Overview (English)', type: 'markdown', section: 'en', rows: 7, span: 2 },
    { name: 'overview_fa', label: 'Overview (Persian)', type: 'markdown', section: 'fa', rows: 7, span: 2 },
    { name: 'education_en', label: 'Education opportunities (English)', type: 'textarea', section: 'en', rows: 5, span: 2 },
    { name: 'education_fa', label: 'Education opportunities (Persian)', type: 'textarea', section: 'fa', rows: 5, span: 2 },
    { name: 'universities_en', label: 'Institutions (English) — one per line', type: 'lines', section: 'en', span: 2 },
    { name: 'universities_fa', label: 'Institutions (Persian) — one per line', type: 'lines', section: 'fa', span: 2 },
    { name: 'study_pathways_en', label: 'Study pathways (English) — one per line', type: 'lines', section: 'en', span: 2 },
    { name: 'study_pathways_fa', label: 'Study pathways (Persian) — one per line', type: 'lines', section: 'fa', span: 2 },
    { name: 'work_pathways_en', label: 'Work pathways (English)', type: 'lines', section: 'en', span: 2 },
    { name: 'work_pathways_fa', label: 'Work pathways (Persian)', type: 'lines', section: 'fa', span: 2 },
    { name: 'pr_pathways_en', label: 'Permanent residency pathways (English)', type: 'lines', section: 'en', span: 2 },
    { name: 'pr_pathways_fa', label: 'Permanent residency pathways (Persian)', type: 'lines', section: 'fa', span: 2 },
    { name: 'family_pathways_en', label: 'Family pathways (English)', type: 'lines', section: 'en', span: 2 },
    { name: 'family_pathways_fa', label: 'Family pathways (Persian)', type: 'lines', section: 'fa', span: 2 },
    { name: 'investment_pathways_en', label: 'Business & investment pathways (English)', type: 'lines', section: 'en', span: 2 },
    { name: 'investment_pathways_fa', label: 'Business & investment pathways (Persian)', type: 'lines', section: 'fa', span: 2 },
    { name: 'highlights_en', label: 'Highlights (English)', type: 'lines', section: 'en', span: 2 },
    { name: 'highlights_fa', label: 'Highlights (Persian)', type: 'lines', section: 'fa', span: 2 },
    { name: 'eligibility_en', label: 'Eligibility snapshot (English)', type: 'lines', section: 'en', span: 2 },
    { name: 'eligibility_fa', label: 'Eligibility snapshot (Persian)', type: 'lines', section: 'fa', span: 2 },
    { name: 'documents_en', label: 'Documents to prepare (English)', type: 'lines', section: 'en', span: 2 },
    { name: 'documents_fa', label: 'Documents to prepare (Persian)', type: 'lines', section: 'fa', span: 2 },
    { name: 'process_en', label: 'Application journey (English)', type: 'lines', section: 'en', span: 2 },
    { name: 'process_fa', label: 'Application journey (Persian)', type: 'lines', section: 'fa', span: 2 },
    ...seoFields(),
  ],
};

const packageConfig: ResourceConfig = {
  resource: 'packages',
  title: 'Service packages',
  singular: 'Package',
  description: 'Manage pricing, inclusions, exclusions and whether a package can be paid online.',
  titleField: 'name_en',
  slugFrom: 'name_en',
  searchFields: ['name_en', 'name_fa', 'slug'],
  columns: [
    { key: 'name_en', label: 'Package', type: 'text', secondaryKey: 'name_fa' },
    { key: 'price_minor', label: 'Price', type: 'money' },
    { key: 'currency', label: 'Currency' },
    { key: 'cta_type', label: 'CTA' },
    { key: 'visible', label: 'Visible', type: 'boolean' },
    { key: 'featured', label: 'Featured', type: 'boolean' },
  ],
  defaultValues: {
    slug: '',
    name_en: '',
    name_fa: '',
    description_en: '',
    description_fa: '',
    price_minor: 0,
    currency: 'USD',
    billing_type: 'one_time',
    duration_en: '',
    duration_fa: '',
    features_en: [],
    features_fa: [],
    exclusions_en: [],
    exclusions_fa: [],
    cta_type: 'consultation',
    featured: false,
    visible: true,
    sort_order: 0,
  },
  fields: [
    { name: 'slug', label: 'URL slug', type: 'text', section: 'basics', required: true },
    { name: 'visible', label: 'Visible on website', type: 'checkbox', section: 'basics' },
    { name: 'featured', label: 'Featured package', type: 'checkbox', section: 'basics' },
    { name: 'sort_order', label: 'Display order', type: 'number', section: 'basics' },
    { name: 'price_minor', label: 'Price', type: 'money', section: 'basics', required: true, help: 'Enter the amount in major units, e.g. 450 for $450.' },
    { name: 'currency', label: 'Currency code', type: 'text', section: 'basics', required: true, help: 'ISO code (USD, EUR, GBP).' },
    {
      name: 'billing_type',
      label: 'Billing type',
      type: 'select',
      section: 'basics',
      options: [
        { value: 'one_time', label: 'One-time' },
        { value: 'deposit', label: 'Deposit' },
        { value: 'custom', label: 'Custom' },
      ],
    },
    {
      name: 'cta_type',
      label: 'Call to action',
      type: 'select',
      section: 'basics',
      options: [
        { value: 'consultation', label: 'Request consultation' },
        { value: 'payment', label: 'Book and pay online' },
      ],
    },
    { name: 'name_en', label: 'Package name (English)', type: 'text', section: 'en', span: 2, required: true },
    { name: 'name_fa', label: 'Package name (Persian)', type: 'text', section: 'fa', span: 2, required: true },
    { name: 'description_en', label: 'Description (English)', type: 'textarea', section: 'en', rows: 3, span: 2 },
    { name: 'description_fa', label: 'Description (Persian)', type: 'textarea', section: 'fa', rows: 3, span: 2 },
    { name: 'duration_en', label: 'Duration / delivery (English)', type: 'text', section: 'details', span: 2 },
    { name: 'duration_fa', label: 'Duration / delivery (Persian)', type: 'text', section: 'details', span: 2 },
    { name: 'features_en', label: 'Included (English) — one per line', type: 'lines', section: 'en', span: 2 },
    { name: 'features_fa', label: 'Included (Persian) — one per line', type: 'lines', section: 'fa', span: 2 },
    { name: 'exclusions_en', label: 'Excluded (English) — one per line', type: 'lines', section: 'en', span: 2 },
    { name: 'exclusions_fa', label: 'Excluded (Persian) — one per line', type: 'lines', section: 'fa', span: 2 },
  ],
};

const expertConfig: ResourceConfig = {
  resource: 'experts',
  title: 'Experts',
  singular: 'Expert',
  description: 'Manage adviser profiles, languages and publication status.',
  titleField: 'name',
  slugFrom: 'name',
  searchFields: ['name', 'role_en', 'role_fa', 'slug'],
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'role_en', label: 'Role', secondaryKey: 'role_fa' },
    { key: 'is_demo', label: 'Sample', type: 'boolean' },
    { key: 'published', label: 'Published', type: 'boolean' },
    { key: 'sort_order', label: 'Order', type: 'number' },
  ],
  defaultValues: {
    slug: '',
    name: '',
    role_en: '',
    role_fa: '',
    expertise_en: '',
    expertise_fa: '',
    bio_en: '',
    bio_fa: '',
    languages_en: [],
    languages_fa: [],
    photo: null,
    linkedin_url: '',
    years_experience: '',
    is_demo: false,
    published: true,
    sort_order: 0,
  },
  fields: [
    { name: 'slug', label: 'URL slug', type: 'text', section: 'basics', required: true },
    { name: 'name', label: 'Full name', type: 'text', section: 'basics', required: true },
    { name: 'photo', label: 'Profile photograph', type: 'image', section: 'basics', span: 2, nullable: true },
    { name: 'linkedin_url', label: 'LinkedIn URL', type: 'text', section: 'basics', span: 2, nullable: true },
    { name: 'years_experience', label: 'Years of experience (only if verified)', type: 'text', section: 'basics' },
    { name: 'is_demo', label: 'Mark as sample profile', type: 'checkbox', section: 'basics' },
    { name: 'published', label: 'Published', type: 'checkbox', section: 'basics' },
    { name: 'sort_order', label: 'Display order', type: 'number', section: 'basics' },
    { name: 'role_en', label: 'Role (English)', type: 'text', section: 'en', span: 2, required: true },
    { name: 'role_fa', label: 'Role (Persian)', type: 'text', section: 'fa', span: 2, required: true },
    { name: 'expertise_en', label: 'Areas of expertise (English)', type: 'text', section: 'en', span: 2 },
    { name: 'expertise_fa', label: 'Areas of expertise (Persian)', type: 'text', section: 'fa', span: 2 },
    { name: 'bio_en', label: 'Biography (English)', type: 'markdown', section: 'en', rows: 7, span: 2 },
    { name: 'bio_fa', label: 'Biography (Persian)', type: 'markdown', section: 'fa', rows: 7, span: 2 },
    { name: 'languages_en', label: 'Languages (English) — one per line', type: 'lines', section: 'en', span: 2 },
    { name: 'languages_fa', label: 'Languages (Persian) — one per line', type: 'lines', section: 'fa', span: 2 },
  ],
};

const articleConfig: ResourceConfig = {
  resource: 'articles',
  title: 'Articles',
  singular: 'Article',
  description: 'Write, review and publish bilingual articles with SEO metadata.',
  titleField: 'title_en',
  slugFrom: 'title_en',
  searchFields: ['title_en', 'title_fa', 'slug'],
  columns: [
    { key: 'title_en', label: 'Article', type: 'text', secondaryKey: 'title_fa' },
    { key: 'category_name_en', label: 'Category' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'featured', label: 'Featured', type: 'boolean' },
    { key: 'published_at', label: 'Published', type: 'date' },
  ],
  defaultValues: {
    slug: '',
    category_id: null,
    author: 'FaraTech Editorial',
    image: null,
    title_en: '',
    title_fa: '',
    excerpt_en: '',
    excerpt_fa: '',
    content_en: '',
    content_fa: '',
    reading_minutes: 5,
    status: 'draft',
    featured: false,
    published_at: '',
    seo_title_en: '',
    seo_title_fa: '',
    seo_description_en: '',
    seo_description_fa: '',
  },
  fields: [
    { name: 'slug', label: 'URL slug', type: 'text', section: 'basics', required: true },
    { name: 'status', label: 'Status', type: 'select', section: 'basics', options: [{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }] },
    { name: 'featured', label: 'Featured article', type: 'checkbox', section: 'basics' },
    { name: 'category_id', label: 'Category', type: 'select', section: 'basics', optionsFrom: 'categories', nullable: true },
    { name: 'author', label: 'Author', type: 'text', section: 'basics' },
    { name: 'reading_minutes', label: 'Reading time (minutes)', type: 'number', section: 'basics' },
    { name: 'published_at', label: 'Publication date', type: 'datetime', section: 'basics' },
    { name: 'image', label: 'Featured image', type: 'image', section: 'basics', span: 2, nullable: true },
    { name: 'title_en', label: 'Title (English)', type: 'text', section: 'en', span: 2, required: true },
    { name: 'title_fa', label: 'Title (Persian)', type: 'text', section: 'fa', span: 2, required: true },
    { name: 'excerpt_en', label: 'Excerpt (English)', type: 'textarea', section: 'en', rows: 3, span: 2 },
    { name: 'excerpt_fa', label: 'Excerpt (Persian)', type: 'textarea', section: 'fa', rows: 3, span: 2 },
    { name: 'content_en', label: 'Article content (English, Markdown)', type: 'markdown', section: 'en', rows: 16, span: 2 },
    { name: 'content_fa', label: 'Article content (Persian, Markdown)', type: 'markdown', section: 'fa', rows: 16, span: 2 },
    ...seoFields(),
  ],
};

const categoryConfig: ResourceConfig = {
  resource: 'categories',
  title: 'Article categories',
  singular: 'Category',
  description: 'Organise articles into public-facing topics.',
  titleField: 'name_en',
  slugFrom: 'name_en',
  searchFields: ['name_en', 'name_fa', 'slug'],
  columns: [
    { key: 'name_en', label: 'Category', secondaryKey: 'name_fa' },
    { key: 'slug', label: 'Slug' },
    { key: 'sort_order', label: 'Order', type: 'number' },
  ],
  defaultValues: { slug: '', name_en: '', name_fa: '', sort_order: 0 },
  fields: [
    { name: 'slug', label: 'URL slug', type: 'text', section: 'basics', required: true },
    { name: 'sort_order', label: 'Display order', type: 'number', section: 'basics' },
    { name: 'name_en', label: 'Name (English)', type: 'text', section: 'en', required: true, span: 2 },
    { name: 'name_fa', label: 'Name (Persian)', type: 'text', section: 'fa', required: true, span: 2 },
  ],
};

const faqConfig: ResourceConfig = {
  resource: 'faqs',
  title: 'FAQs',
  singular: 'FAQ',
  description: 'Manage the public help centre, grouped by category.',
  titleField: 'question_en',
  searchFields: ['question_en', 'question_fa', 'answer_en', 'answer_fa'],
  columns: [
    { key: 'question_en', label: 'Question', secondaryKey: 'question_fa' },
    { key: 'category', label: 'Category' },
    { key: 'published', label: 'Published', type: 'boolean' },
    { key: 'sort_order', label: 'Order', type: 'number' },
  ],
  defaultValues: {
    category: 'general',
    question_en: '',
    question_fa: '',
    answer_en: '',
    answer_fa: '',
    published: true,
    sort_order: 0,
  },
  fields: [
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      section: 'basics',
      options: [
        { value: 'general', label: 'General' },
        { value: 'study', label: 'Study abroad' },
        { value: 'student-visa', label: 'Student visa' },
        { value: 'work-visa', label: 'Work visa' },
        { value: 'immigration', label: 'Immigration process' },
        { value: 'pricing', label: 'Consultation & pricing' },
        { value: 'payments', label: 'Payments' },
      ],
    },
    { name: 'published', label: 'Published', type: 'checkbox', section: 'basics' },
    { name: 'sort_order', label: 'Display order', type: 'number', section: 'basics' },
    { name: 'question_en', label: 'Question (English)', type: 'text', section: 'en', span: 2, required: true },
    { name: 'question_fa', label: 'Question (Persian)', type: 'text', section: 'fa', span: 2, required: true },
    { name: 'answer_en', label: 'Answer (English)', type: 'textarea', section: 'en', rows: 5, span: 2, required: true },
    { name: 'answer_fa', label: 'Answer (Persian)', type: 'textarea', section: 'fa', rows: 5, span: 2, required: true },
  ],
};

const testimonialConfig: ResourceConfig = {
  resource: 'testimonials',
  title: 'Testimonials',
  singular: 'Testimonial',
  description: 'Publish only genuine, consented client stories. Mark sample entries clearly.',
  titleField: 'name',
  searchFields: ['name', 'country', 'quote_en'],
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'country', label: 'Country' },
    { key: 'is_demo', label: 'Sample', type: 'boolean' },
    { key: 'published', label: 'Published', type: 'boolean' },
    { key: 'sort_order', label: 'Order', type: 'number' },
  ],
  defaultValues: {
    name: '',
    country: '',
    service_en: '',
    service_fa: '',
    quote_en: '',
    quote_fa: '',
    photo: null,
    rating: 5,
    is_demo: true,
    published: false,
    sort_order: 0,
  },
  fields: [
    { name: 'name', label: 'Client name', type: 'text', section: 'basics', required: true },
    { name: 'country', label: 'Destination country', type: 'text', section: 'basics' },
    { name: 'rating', label: 'Rating (1–5)', type: 'number', section: 'basics' },
    { name: 'photo', label: 'Photograph (with consent)', type: 'image', section: 'basics', span: 2, nullable: true },
    { name: 'is_demo', label: 'Sample content', type: 'checkbox', section: 'basics' },
    { name: 'published', label: 'Published', type: 'checkbox', section: 'basics' },
    { name: 'sort_order', label: 'Display order', type: 'number', section: 'basics' },
    { name: 'service_en', label: 'Service (English)', type: 'text', section: 'en', span: 2 },
    { name: 'service_fa', label: 'Service (Persian)', type: 'text', section: 'fa', span: 2 },
    { name: 'quote_en', label: 'Testimonial (English)', type: 'textarea', section: 'en', rows: 5, span: 2, required: true },
    { name: 'quote_fa', label: 'Testimonial (Persian)', type: 'textarea', section: 'fa', rows: 5, span: 2, required: true },
  ],
};

export const resourceConfigs: Record<ResourceName, ResourceConfig> = {
  services: serviceConfig,
  destinations: destinationConfig,
  packages: packageConfig,
  experts: expertConfig,
  articles: articleConfig,
  categories: categoryConfig,
  faqs: faqConfig,
  testimonials: testimonialConfig,
};

export const resourceSections = sections;
