/**
 * Browser-only demonstration adapter for the existing API contract.
 * No network requests, real authentication, payment processing or server
 * storage happen here. The store is deliberately separate from the page UI.
 */
import type {
  ActivityLog, Admin, Article, ArticleCategory, Consultation, ConsultationNote,
  ConsultationStatus, ContactMessage, DashboardStats, Destination, Expert, Faq,
  Package, Paginated, Payment, PublicSitePayload, Service, SiteSettings, Testimonial,
} from '@shared/types';
import { CONSULTATION_STATUSES } from '@shared/types';
import { ApiError } from '@/lib/apiError';
import { DEFAULT_BRAND_LEGAL_NAME, DEFAULT_BRAND_LOGO } from '@/lib/brand';
import * as seed from './mock-content';

type LegalPage = { slug: string; title_en: string; title_fa: string; body_en: string; body_fa: string; updated_at: string };
type Resource = 'services' | 'destinations' | 'packages' | 'experts' | 'articles' | 'categories' | 'faqs' | 'testimonials';
type DemoStore = {
  services: Service[];
  destinations: Destination[];
  packages: Package[];
  experts: Expert[];
  articles: Article[];
  categories: ArticleCategory[];
  faqs: Faq[];
  testimonials: Testimonial[];
  settings: SiteSettings;
  legal: LegalPage[];
  consultations: Consultation[];
  notes: ConsultationNote[];
  payments: Payment[];
  messages: ContactMessage[];
  activity: ActivityLog[];
};

const STORAGE_KEY = 'faratech_frontend_demo_v1';
const SESSION_KEY = 'faratech_demo_session';
const demoAdmin: Admin = {
  id: 1, email: 'demo@applynow.example', name: 'Demo Administrator', role: 'owner',
  is_active: true, last_login_at: null, created_at: '2026-01-01T00:00:00.000Z',
};
let memoryStore: DemoStore | null = null;
let memorySession = false;

const isoDaysAgo = (days: number) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

const legalTemplates: LegalPage[] = [
  {
    slug: 'privacy-policy', title_en: 'Privacy Policy', title_fa: 'سیاست حریم خصوصی', updated_at: '2026-01-01T00:00:00.000Z',
    body_en: `## Preview notice\n\nThis is placeholder legal content for a frontend demonstration, not a final privacy policy. Forms in this preview do not contact Apply Now or send email. Demo entries and management changes are stored locally in this browser; do not enter real personal or sensitive information.\n\n## Information and purpose\n\nBefore launch, describe which information the business collects, why it is needed and the lawful basis for processing it.\n\n## Storage, sharing and retention\n\nIdentify actual service providers, security measures, retention periods and international transfers once the production system is designed. Browser demo data is not a secure production record.\n\n## Your rights and contact\n\nDescribe applicable access, correction and deletion rights and provide verified contact information. A qualified professional must review this policy before publication.`,
    body_fa: `## اطلاعیه پیش‌نمایش\n\nاین متن حقوقی صرفاً نمونه برای نمایش رابط کاربری است و سیاست نهایی حریم خصوصی نیست. فرم‌های این پیش‌نمایش با Apply Now تماس نمی‌گیرند و ایمیلی ارسال نمی‌کنند. اطلاعات نمایشی و تغییرات مدیریت فقط در همین مرورگر ذخیره می‌شوند؛ اطلاعات واقعی یا حساس وارد نکنید.\n\n## اطلاعات و هدف\n\nپیش از انتشار، نوع اطلاعات جمع‌آوری‌شده، دلیل نیاز و مبنای قانونی پردازش را مشخص کنید.\n\n## نگهداری و اشتراک‌گذاری\n\nپس از طراحی سامانه عملیاتی، ارائه‌دهندگان واقعی، اقدامات امنیتی، دوره نگهداری و انتقال بین‌المللی را مشخص کنید. اطلاعات نمایشی مرورگر، سابقه امن عملیاتی نیست.\n\n## حقوق و تماس\n\nحقوق دسترسی، اصلاح و حذف و اطلاعات تماس تأییدشده را درج کنید. این متن باید پیش از انتشار توسط متخصص حقوقی بررسی شود.`,
  },
  {
    slug: 'terms-and-conditions', title_en: 'Terms & Conditions', title_fa: 'شرایط و قوانین', updated_at: '2026-01-01T00:00:00.000Z',
    body_en: `## Preview terms\n\nThis page is a structured placeholder for the frontend demonstration. No consultation is booked, no payment is taken and no contract is created through this preview.\n\n## Scope and responsibilities\n\nThe final agreement should describe the services offered, client responsibilities, eligibility and any professional limitations. Immigration and admission decisions belong to the relevant authorities.\n\n## Fees, cancellation and refunds\n\nAll prices displayed in this preview are examples only. The business must confirm its fees, payment methods, cancellation and refund policy before launch.\n\n## General information\n\nThe material on this site is general information, not legal advice or a guarantee. Verify requirements with official sources.\n\n## Review and contact\n\nAdd the governing law, dispute process and verified contact information. A qualified professional should review the final terms before publication.`,
    body_fa: `## شرایط پیش‌نمایش\n\nاین صفحه یک متن ساختاریافته نمونه برای نمایش رابط کاربری است. در این پیش‌نمایش مشاوره‌ای رزرو، پرداختی دریافت یا قراردادی ایجاد نمی‌شود.\n\n## دامنه و مسئولیت‌ها\n\nتوافق نهایی باید خدمات، مسئولیت‌های متقاضی، شرایط و محدودیت‌های حرفه‌ای را توضیح دهد. تصمیم مهاجرت و پذیرش بر عهده مراجع مربوطه است.\n\n## هزینه، لغو و بازپرداخت\n\nهمه قیمت‌های این پیش‌نمایش نمونه هستند. کسب‌وکار باید هزینه‌ها، روش پرداخت، شرایط لغو و بازپرداخت را پیش از انتشار تأیید کند.\n\n## اطلاعات عمومی\n\nمحتوای سایت اطلاعات عمومی است، نه مشاوره حقوقی یا تضمین نتیجه. الزامات را با منابع رسمی بررسی کنید.\n\n## بازبینی و تماس\n\nقانون حاکم، روند رسیدگی به اختلاف و اطلاعات تماس تأییدشده را اضافه کنید. متن نهایی باید پیش از انتشار توسط متخصص حقوقی بررسی شود.`,
  },
];

// Replace only untouched sample answers so existing admin edits are preserved.
const previewFaqAnswers: Record<string, { en: string; fa: string }> = {
  'How much does a consultation cost?': {
    en: 'The prices on the Pricing page are illustrative examples, not confirmed fees. No consultation is booked or charged in this preview.',
    fa: 'قیمت‌های صفحه قیمت‌ها صرفاً نمونه‌اند و هزینه تأییدشده نیستند. در این پیش‌نمایش مشاوره‌ای رزرو یا مبلغی دریافت نمی‌شود.',
  },
  'Are package prices fixed?': {
    en: 'Package prices and inclusions shown here are examples that must be verified before launch. No payment is taken in this preview.',
    fa: 'قیمت‌ها و خدمات بسته‌ها در اینجا نمونه‌اند و باید پیش از انتشار تأیید شوند. در این پیش‌نمایش پرداختی انجام نمی‌شود.',
  },
  'Which payment methods do you accept?': {
    en: 'Payments are not available in this frontend preview. Payment methods must be confirmed when a real provider is integrated.',
    fa: 'پرداخت در این پیش‌نمایش رابط کاربری فعال نیست. روش‌های پرداخت پس از اتصال ارائه‌دهنده واقعی تأیید خواهند شد.',
  },
  'Do you store my card details?': {
    en: 'This preview does not collect card details or process payments.',
    fa: 'این پیش‌نمایش اطلاعات کارت را جمع‌آوری نمی‌کند و پرداختی انجام نمی‌دهد.',
  },
};
function updateUntouchedSampleFaqs(faqs: Faq[]) {
  for (const faq of faqs) {
    const replacement = previewFaqAnswers[faq.question_en];
    const original = seed.faqs.find((item) => item.question_en === faq.question_en);
    if (!replacement || !original) continue;
    if (faq.answer_en === original.answer_en) faq.answer_en = replacement.en;
    if (faq.answer_fa === original.answer_fa) faq.answer_fa = replacement.fa;
  }
}

function makeStore(): DemoStore {
  const stamp = '2026-01-01T00:00:00.000Z';
  const services = seed.services.map((item, i) => ({ ...item, id: i + 1, featured: Boolean(item.featured), published: true, created_at: stamp, updated_at: stamp })) as unknown as Service[];
  const destinations = seed.destinations.map((item, i) => ({ ...item, id: i + 1, featured: Boolean(item.featured), published: true, created_at: stamp, updated_at: stamp })) as unknown as Destination[];
  const packages = seed.packages.map((item, i) => ({ ...item, id: i + 1, featured: Boolean(item.featured), visible: true, created_at: stamp, updated_at: stamp })) as unknown as Package[];
  const experts = seed.experts.map((item, i) => ({ ...item, id: i + 1, name_fa: ['مشاور ارشد نمونه', 'مشاور تحصیلی نمونه', 'متخصص ویزای نمونه', 'مسئول تجربه متقاضیان نمونه'][i], is_demo: true, published: true, linkedin_url: null, created_at: stamp, updated_at: stamp })) as unknown as Expert[];
  const categories = seed.articleCategories.map((item, i) => ({ ...item, id: i + 1 })) as ArticleCategory[];
  const articles = seed.articles.map((item, i) => {
    const category = categories.find((category) => category.slug === item.category);
    return { ...item, id: i + 1, category_id: category?.id ?? null, featured: Boolean(item.featured), created_at: stamp, updated_at: stamp };
  }) as unknown as Article[];
  const faqs = seed.faqs.map((item, i) => ({ ...item, id: i + 1, published: true, created_at: stamp, updated_at: stamp })) as unknown as Faq[];
  updateUntouchedSampleFaqs(faqs);
  const testimonials = seed.testimonials.map((item, i) => ({ ...item, id: i + 1, name_fa: ['متقاضی نمونه الف', 'متقاضی نمونه ب', 'متقاضی نمونه پ'][i], country_fa: ['کانادا', 'آلمان', 'استرالیا'][i], is_demo: true, published: true })) as unknown as Testimonial[];
  const names = ['Ava Sample', 'Noah Example', 'Mina Demo', 'Liam Sample', 'Sara Example', 'Amir Demo', 'Sophie Sample', 'Omid Example', 'Emma Demo', 'Arman Sample', 'Leila Example', 'Daniel Demo', 'Nora Sample', 'Dara Example', 'Maya Demo', 'Ryan Sample', 'Sam Example', 'Zara Demo'];
  const statuses: ConsultationStatus[] = ['pending', 'under_review', 'approved', 'contacted', 'in_progress', 'rejected', 'completed'];
  const consultations: Consultation[] = names.map((name, i) => ({
    id: i + 1, reference: `DEMO-${String(i + 1).padStart(4, '0')}`, full_name: name,
    email: `applicant${i + 1}@example.com`, phone: `+1 555 010 ${String(i + 100).slice(-3)}`,
    contact_method: i % 3 === 0 ? 'phone' : 'email', service_id: (i % services.length) + 1,
    destination_id: (i % destinations.length) + 1, education_level: 'bachelor',
    message: 'Example request for demonstrating the management interface. This is not a real applicant.',
    preferred_date: null, privacy_consent: true, status: statuses[i % statuses.length], source: 'demo',
    created_at: isoDaysAgo(i % 14), updated_at: isoDaysAgo(i % 14),
  }));
  const payments: Payment[] = [0, 1, 2].map((i) => ({
    id: i + 1, reference: `DEMO-TXN-${1001 + i}`, consultation_id: i + 1, package_id: (i % 3) + 2,
    provider: 'demo', provider_checkout_id: null, provider_payment_id: null,
    amount_minor: packages[(i % 3) + 1].price_minor, currency: 'USD',
    status: (['pending', 'successful', 'failed'] as const)[i], description: 'Illustrative record only; no transaction occurred.',
    customer_email: consultations[i].email, receipt_url: null, paid_at: null,
    created_at: isoDaysAgo(i + 1), updated_at: isoDaysAgo(i + 1),
  }));
  const settings = structuredClone(seed.settings) as unknown as SiteSettings;
  settings.brand.tagline_fa = 'تحصیل · کار · زندگی · خارج از کشور';
  return {
    services, destinations, packages, experts, categories, articles, faqs, testimonials, settings,
    legal: structuredClone(legalTemplates), consultations, notes: [], payments, messages: [],
    activity: [{ id: 1, admin_id: 1, admin_name: 'Demo Administrator', action: 'demo_started', entity_type: 'preview', entity_id: null, details: { message: 'Sample workspace created locally.' }, created_at: isoDaysAgo(0) }],
  };
}

// Update only values that still match the old demonstration seed. Custom content,
// uploaded logos and local records are intentionally left untouched.
function legacyBrand(value: string) {
  return value.replaceAll('Apply Now', 'FaraTech').replaceAll('applynow.example', 'faratech.example');
}

function migrateUntouchedSample(value: unknown, sample: unknown): unknown {
  if (typeof value === 'string' && typeof sample === 'string') {
    const previous = legacyBrand(sample);
    return previous !== sample && value === previous ? sample : value;
  }
  if (Array.isArray(value) && Array.isArray(sample)) {
    return value.map((item, index) => index < sample.length ? migrateUntouchedSample(item, sample[index]) : item);
  }
  if (value && sample && typeof value === 'object' && typeof sample === 'object') {
    const current = value as Record<string, unknown>;
    for (const [key, sampleValue] of Object.entries(sample as Record<string, unknown>)) {
      if (key in current) current[key] = migrateUntouchedSample(current[key], sampleValue);
    }
  }
  return value;
}

function updateLegacyBrand(store: DemoStore) {
  const hadLegacyName = store.settings.brand.name === 'FaraTech';
  migrateUntouchedSample(store.settings, seed.settings);
  if (store.settings.brand.legalName === 'FaraTech Global Mobility') store.settings.brand.legalName = DEFAULT_BRAND_LEGAL_NAME;
  if (hadLegacyName && !store.settings.brand.logoUrl) store.settings.brand.logoUrl = DEFAULT_BRAND_LOGO;

  store.services?.forEach((item) => {
    const sample = seed.services.find((entry) => entry.slug === item.slug);
    if (sample) migrateUntouchedSample(item, sample);
  });
  store.articles?.forEach((item) => {
    const sample = seed.articles.find((entry) => entry.slug === item.slug);
    if (sample) migrateUntouchedSample(item, sample);
  });
  store.faqs?.forEach((item) => {
    const sample = seed.faqs.find((entry) => item.question_en === entry.question_en || item.question_en === legacyBrand(entry.question_en));
    if (sample) migrateUntouchedSample(item, sample);
  });
  store.testimonials?.forEach((item) => {
    const sample = seed.testimonials.find((entry) => entry.name === item.name);
    if (item.is_demo && sample) migrateUntouchedSample(item, sample);
  });
  store.legal?.forEach((item) => {
    const sample = legalTemplates.find((entry) => entry.slug === item.slug);
    if (sample) migrateUntouchedSample(item, sample);
  });
}

function readStore(): DemoStore {
  if (memoryStore) return memoryStore;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as DemoStore;
      if (parsed.services && parsed.settings && parsed.consultations && parsed.legal) {
        // Update untouched sample branding/answers and fill bilingual fields without overwriting local edits.
        updateLegacyBrand(parsed);
        if (parsed.faqs) updateUntouchedSampleFaqs(parsed.faqs);
        parsed.settings.brand.tagline_fa ??= 'تحصیل · کار · زندگی · خارج از کشور';
        const expertNames: Record<string, string> = { 'sample-senior-advisor': 'مشاور ارشد نمونه', 'sample-education-advisor': 'مشاور تحصیلی نمونه', 'sample-visa-specialist': 'متخصص ویزای نمونه', 'sample-client-care-lead': 'مسئول تجربه متقاضیان نمونه' };
        parsed.experts?.forEach((expert) => { if (expert.is_demo && expert.name_fa === undefined && expertNames[expert.slug]) expert.name_fa = expertNames[expert.slug]; });
        const testimonialNames: Record<string, string> = { 'Sample client A.': 'متقاضی نمونه الف', 'Sample client B.': 'متقاضی نمونه ب', 'Sample client C.': 'متقاضی نمونه پ' };
        const countries: Record<string, string> = { Canada: 'کانادا', Germany: 'آلمان', Australia: 'استرالیا' };
        parsed.testimonials?.forEach((item) => { if (item.is_demo) { item.name_fa ??= testimonialNames[item.name]; item.country_fa ??= countries[item.country]; } });
        return (memoryStore = parsed);
      }
    }
  } catch { /* storage unavailable or invalid; start with the sample data */ }
  memoryStore = makeStore();
  return memoryStore;
}

/** Refresh the in-memory snapshot when another tab changes the demo store. */
export function subscribeDemoStorage(onChange: () => void) {
  const listener = (event: StorageEvent) => {
    if ((event.key === STORAGE_KEY || event.key === null) && event.storageArea === window.localStorage) {
      memoryStore = null;
      onChange();
    }
  };
  window.addEventListener('storage', listener);
  return () => window.removeEventListener('storage', listener);
}

function saveStore(store: DemoStore) {
  memoryStore = store;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); }
  catch { throw new ApiError('Browser storage is full or unavailable. Changes may not persist after a reload.', 507, 'STORAGE_UNAVAILABLE'); }
}

function addActivity(store: DemoStore, action: string, type: string, id: string | number | null) {
  store.activity.unshift({ id: Date.now(), admin_id: 1, admin_name: demoAdmin.name, action, entity_type: type, entity_id: id === null ? null : String(id), details: {}, created_at: new Date().toISOString() });
  store.activity = store.activity.slice(0, 40);
}

function sessionExists() {
  try { return sessionStorage.getItem(SESSION_KEY) === 'true' || memorySession; } catch { return memorySession; }
}
function setSession(active: boolean) {
  memorySession = active;
  try { active ? sessionStorage.setItem(SESSION_KEY, 'true') : sessionStorage.removeItem(SESSION_KEY); } catch { /* memory-only session */ }
}

const clone = <T,>(value: T): T => structuredClone(value);
const nextId = (items: { id: number }[]) => Math.max(0, ...items.map((item) => item.id)) + 1;
const sorted = <T extends { sort_order?: number; id: number }>(items: T[]) => [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id - b.id);
const contains = (value: unknown, search: string) => String(value ?? '').toLocaleLowerCase().includes(search.toLocaleLowerCase());
function paginate<T>(items: T[], params: URLSearchParams): Paginated<T> {
  const page = Math.max(1, Number(params.get('page')) || 1);
  const pageSize = Math.max(1, Math.min(1000, Number(params.get('pageSize')) || 20));
  return { items: items.slice((page - 1) * pageSize, page * pageSize), total: items.length, page, pageSize };
}

function enrichedArticles(store: DemoStore) {
  return store.articles.map((article) => {
    const category = store.categories.find((item) => item.id === article.category_id);
    return { ...article, category_slug: category?.slug ?? null, category_name_en: category?.name_en ?? null, category_name_fa: category?.name_fa ?? null };
  });
}
function enrichedConsultations(store: DemoStore) {
  return store.consultations.map((item) => {
    const service = store.services.find((entry) => entry.id === item.service_id);
    const destination = store.destinations.find((entry) => entry.id === item.destination_id);
    const payment = store.payments.find((entry) => entry.consultation_id === item.id);
    return { ...item, service_title_en: service?.title_en ?? null, service_title_fa: service?.title_fa ?? null,
      destination_name_en: destination?.name_en ?? null, destination_name_fa: destination?.name_fa ?? null,
      notes_count: store.notes.filter((note) => note.consultation_id === item.id).length, payment_status: payment?.status ?? null };
  });
}
function enrichedPayments(store: DemoStore) {
  return store.payments.map((payment) => {
    const pkg = store.packages.find((item) => item.id === payment.package_id);
    const request = store.consultations.find((item) => item.id === payment.consultation_id);
    return { ...payment, package_name_en: pkg?.name_en ?? null, package_name_fa: pkg?.name_fa ?? null,
      consultation_reference: request?.reference ?? null, applicant_name: request?.full_name ?? null };
  });
}
function publishedSite(store: DemoStore): PublicSitePayload {
  return {
    settings: store.settings,
    services: sorted(store.services.filter((item) => item.published)),
    destinations: sorted(store.destinations.filter((item) => item.published)),
    packages: sorted(store.packages.filter((item) => item.visible)),
    experts: sorted(store.experts.filter((item) => item.published)),
    faqs: sorted(store.faqs.filter((item) => item.published)),
    testimonials: sorted(store.testimonials.filter((item) => item.published)),
    articles: enrichedArticles(store).filter((item) => item.status === 'published').sort((a, b) => Number(b.featured) - Number(a.featured)),
    categories: sorted(store.categories), contentVerified: false,
    payment: { enabled: false, provider: 'demo', currency: 'USD' },
  };
}
function stats(store: DemoStore): DashboardStats {
  const consultations = enrichedConsultations(store);
  const counts = Object.fromEntries(CONSULTATION_STATUSES.map((status) => [status, consultations.filter((item) => item.status === status).length])) as Record<ConsultationStatus, number>;
  return {
    consultations: { total: consultations.length, ...counts },
    content: { services: store.services.length, destinations: store.destinations.length, articlesPublished: store.articles.filter((item) => item.status === 'published').length,
      articlesDraft: store.articles.filter((item) => item.status === 'draft').length, packages: store.packages.length, experts: store.experts.length, faqs: store.faqs.length },
    payments: { successfulAmountMinor: store.payments.filter((item) => item.status === 'successful').reduce((sum, item) => sum + item.amount_minor, 0),
      successfulCount: store.payments.filter((item) => item.status === 'successful').length, pendingCount: store.payments.filter((item) => item.status === 'pending').length,
      failedCount: store.payments.filter((item) => item.status === 'failed').length, currency: 'USD' },
    unreadMessages: store.messages.filter((item) => item.status === 'new').length,
    recentConsultations: consultations.slice().sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5),
    recentActivity: store.activity.slice(0, 6),
    consultationsByDay: Array.from({ length: 14 }, (_, i) => {
      const date = isoDaysAgo(13 - i).slice(0, 10);
      return { date, count: consultations.filter((item) => item.created_at.slice(0, 10) === date).length };
    }),
  };
}
const notFound = () => { throw new ApiError('The requested demo record could not be found.', 404, 'NOT_FOUND'); };
const delay = () => new Promise((resolve) => window.setTimeout(resolve, 350));

/** Handles only in-browser operations; path names mirror the future API boundary. */
export async function demoRequest<T>(rawPath: string, options: RequestInit = {}): Promise<T> {
  const url = new URL(rawPath, 'https://demo.invalid');
  const path = decodeURIComponent(url.pathname);
  const params = url.searchParams;
  const method = (options.method || 'GET').toUpperCase();
  const body = typeof options.body === 'string' ? JSON.parse(options.body) as Record<string, any> : {};
  // Simulate loading before reading the current snapshot so a different tab's
  // recent changes are not lost during the demonstration delay.
  if (method === 'POST' && ['/public/consultations', '/public/contact', '/admin/login', '/admin/account/password'].includes(path)) await delay();
  const store = readStore();
  const site = () => publishedSite(store);
  let result: unknown;

  if (path === '/public/site') result = site();
  else if (path === '/public/services') result = { items: site().services };
  else if (path.startsWith('/public/services/')) {
    const service = site().services.find((item) => item.slug === path.split('/').pop()) || notFound();
    result = { service, related: site().services.filter((item) => item.id !== service.id).slice(0, 3) };
  } else if (path === '/public/destinations') {
    const search = params.get('search') || '';
    const pathway = params.get('pathway');
    const field = pathway ? `${pathway}_pathways_en` as keyof Destination : null;
    result = { items: site().destinations.filter((item) => (!search || contains(item.name_en, search) || contains(item.name_fa, search)) && (!field || (Array.isArray(item[field]) && (item[field] as string[]).length))) };
  } else if (path.startsWith('/public/destinations/')) {
    const destination = site().destinations.find((item) => item.slug === path.split('/').pop()) || notFound();
    result = { destination, relatedServices: site().services.slice(0, 4), relatedArticles: site().articles.slice(0, 3) };
  } else if (path === '/public/packages') result = { items: site().packages, paymentEnabled: false };
  else if (path === '/public/experts') result = { items: site().experts };
  else if (path.startsWith('/public/experts/')) result = { expert: site().experts.find((item) => item.slug === path.split('/').pop()) || notFound() };
  else if (path === '/public/articles') {
    const search = params.get('search') || '';
    const category = params.get('category');
    const featured = params.get('featured');
    result = paginate(site().articles.filter((item) => (!search || [item.title_en, item.title_fa, item.excerpt_en, item.excerpt_fa].some((text) => contains(text, search))) && (!category || item.category_slug === category) && (featured !== 'true' || item.featured)), params);
  } else if (path.startsWith('/public/articles/')) {
    const article = site().articles.find((item) => item.slug === path.split('/').pop()) || notFound();
    result = { article, related: site().articles.filter((item) => item.id !== article.id).slice(0, 3) };
  } else if (path === '/public/faqs') result = { items: site().faqs };
  else if (path === '/public/testimonials') result = { items: site().testimonials };
  else if (path.startsWith('/public/legal/')) result = { page: store.legal.find((item) => item.slug === path.split('/').pop()) || notFound() };
  else if (path === '/public/consultations' && method === 'POST') {
    const id = nextId(store.consultations);
    const reference = `DEMO-${String(id).padStart(4, '0')}`;
    if (!body.website) {
      store.consultations.unshift({ id, reference, full_name: body.fullName, email: body.email, phone: body.phone,
        contact_method: body.contactMethod, service_id: body.serviceId, destination_id: body.destinationId,
        education_level: body.educationLevel, message: body.message, preferred_date: body.preferredDate,
        privacy_consent: true, status: 'pending', source: 'demo form', created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
      addActivity(store, 'demo_request_added', 'consultation', id);
      saveStore(store);
    }
    result = { reference, status: 'pending', message: 'Demo only: saved in this browser, not sent.' };
  } else if (path === '/public/contact' && method === 'POST') {
    if (!body.website) {
      const id = nextId(store.messages);
      store.messages.unshift({ id, name: body.name, email: body.email, phone: body.phone, subject: body.subject, message: body.message,
        status: 'new', created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
      addActivity(store, 'demo_message_added', 'message', id);
      saveStore(store);
    }
    result = { message: 'Demo only: saved in this browser, not sent.' };
  } else if (path.startsWith('/public/payments/')) throw new ApiError('Payments are not available in this frontend preview.', 503, 'PAYMENT_DISABLED');
  else if (path === '/admin/login' && method === 'POST') {
    setSession(true);
    result = { admin: demoAdmin, csrfToken: 'demo-only', expiresAt: '' };
  } else if (path === '/admin/session') result = { admin: sessionExists() ? demoAdmin : null, csrfToken: sessionExists() ? 'demo-only' : null, expiresAt: null };
  else if (path === '/admin/me') result = sessionExists() ? { admin: demoAdmin, csrfToken: 'demo-only', expiresAt: '' } : notFound();
  else if (path === '/admin/logout') { setSession(false); result = undefined; }
  else if (path === '/admin/account/password') { result = { ok: true }; }
  else if (path === '/admin/stats') result = stats(store);
  else if (path === '/admin/consultations' && method === 'GET') {
    let items = enrichedConsultations(store).sort((a, b) => b.created_at.localeCompare(a.created_at));
    const search = params.get('search') || '';
    const status = params.get('status');
    items = items.filter((item) => (!search || [item.reference, item.full_name, item.email, item.phone].some((text) => contains(text, search))) &&
      (!status || status === 'all' || item.status === status) && (!params.get('serviceId') || String(item.service_id) === params.get('serviceId')) &&
      (!params.get('destinationId') || String(item.destination_id) === params.get('destinationId')) &&
      (!params.get('from') || item.created_at.slice(0, 10) >= params.get('from')!) && (!params.get('to') || item.created_at.slice(0, 10) <= params.get('to')!));
    result = paginate(items, params);
  } else if (/^\/admin\/consultations\/\d+\/notes$/.test(path) && method === 'POST') {
    const id = Number(path.split('/')[3]);
    if (!store.consultations.some((item) => item.id === id)) notFound();
    const noteId = nextId(store.notes);
    store.notes.unshift({ id: noteId, consultation_id: id, admin_id: 1, admin_name: demoAdmin.name, note: body.note, created_at: new Date().toISOString() });
    addActivity(store, 'note_added', 'consultation', id); saveStore(store); result = { ok: true, id: noteId };
  } else if (/^\/admin\/consultations\/\d+$/.test(path)) {
    const id = Number(path.split('/')[3]);
    const item = store.consultations.find((entry) => entry.id === id) || notFound();
    if (method === 'PATCH') {
      if (!CONSULTATION_STATUSES.includes(body.status)) throw new ApiError('Invalid status.', 400, 'VALIDATION_ERROR');
      item.status = body.status; item.updated_at = new Date().toISOString();
      addActivity(store, 'status_changed', 'consultation', id); saveStore(store); result = { ok: true, status: item.status };
    } else result = { consultation: enrichedConsultations(store).find((entry) => entry.id === id), notes: store.notes.filter((note) => note.consultation_id === id), payments: enrichedPayments(store).filter((payment) => payment.consultation_id === id) };
  } else if (path === '/admin/contact-messages') {
    const search = params.get('search') || ''; const status = params.get('status');
    result = paginate(store.messages.filter((item) => (!status || status === 'all' || item.status === status) && (!search || [item.name, item.email, item.subject].some((text) => contains(text, search)))), params);
  } else if (/^\/admin\/contact-messages\/\d+$/.test(path) && method === 'PATCH') {
    const item = store.messages.find((entry) => entry.id === Number(path.split('/')[3])) || notFound();
    item.status = body.status; item.updated_at = new Date().toISOString(); saveStore(store); result = { ok: true };
  } else if (path === '/admin/payments') {
    const search = params.get('search') || ''; const status = params.get('status');
    result = paginate(enrichedPayments(store).filter((item) => (!status || status === 'all' || item.status === status) && (!search || [item.reference, item.consultation_reference, item.customer_email, item.applicant_name].some((text) => contains(text, search)))), params);
  } else if (path === '/admin/settings' && method === 'GET') result = { settings: store.settings, legal: store.legal };
  else if (path === '/admin/settings' && method === 'PUT') { store.settings = body as SiteSettings; addActivity(store, 'settings_updated', 'settings', null); saveStore(store); result = { ok: true }; }
  else if (path.startsWith('/admin/legal/') && method === 'PUT') {
    const page = store.legal.find((item) => item.slug === path.split('/').pop()) || notFound();
    Object.assign(page, body, { updated_at: new Date().toISOString() }); saveStore(store); result = { ok: true };
  } else if (path === '/admin/uploads' && method === 'POST') {
    const file = options.body instanceof FormData ? options.body.get('image') : null;
    if (!(file instanceof File) || !file.type.startsWith('image/') || file.size > 750_000) throw new ApiError('Choose an image under 750 KB for this browser-only demo.', 400, 'VALIDATION_ERROR');
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new ApiError('Could not read the image.')); reader.readAsDataURL(file);
    });
    result = { url: dataUrl };
  } else {
    const parts = path.split('/');
    const resources: Resource[] = ['services', 'destinations', 'packages', 'experts', 'articles', 'categories', 'faqs', 'testimonials'];
    const resource = parts[2] as Resource;
    if (parts[1] !== 'admin' || !resources.includes(resource)) return notFound();
    const items = store[resource] as unknown as Record<string, any>[];
    const id = parts[3] ? Number(parts[3]) : null;
    const item = id ? items.find((entry) => entry.id === id) : null;
    if (method === 'GET') {
      if (id) result = { item: item || notFound() };
      else result = { items: resource === 'articles' ? enrichedArticles(store) : items };
    } else if (method === 'POST' || method === 'PATCH') {
      if (id && !item) notFound();
      if (body.slug && items.some((entry) => entry.slug === body.slug && entry.id !== id)) throw new ApiError('This URL slug is already in use.', 400, 'VALIDATION_ERROR', [{ path: 'slug', message: 'This URL slug is already in use.' }]);
      const updated = { ...(item || {}), ...body, id: id || nextId(items as { id: number }[]), created_at: item?.created_at || new Date().toISOString(), updated_at: new Date().toISOString() };
      if (item) Object.assign(item, updated); else items.push(updated);
      addActivity(store, id ? 'content_updated' : 'content_created', resource, updated.id); saveStore(store);
      result = { item: updated };
    } else if (method === 'DELETE') {
      const index = items.findIndex((entry) => entry.id === id);
      if (index === -1) notFound();
      items.splice(index, 1); addActivity(store, 'content_deleted', resource, id); saveStore(store); result = { ok: true };
    } else return notFound();
  }
  return clone(result) as T;
}
