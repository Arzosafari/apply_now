import type {
  Admin,
  Article,
  ArticleCategory,
  Consultation,
  ConsultationNote,
  ContactMessage,
  DashboardStats,
  Destination,
  Expert,
  Faq,
  Paginated,
  Payment,
  PublicSitePayload,
  Service,
  SiteSettings,
  Testimonial,
  Package,
} from '@shared/types';

export class ApiError extends Error {
  status: number;
  code: string;
  details?: { path: string; message: string }[];

  constructor(
    message: string,
    status = 500,
    code = 'REQUEST_ERROR',
    details?: { path: string; message: string }[],
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

let csrfToken: string | null = null;

export function setCsrfToken(token: string | null) {
  csrfToken = token;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (csrfToken && options.method && !['GET', 'HEAD'].includes(options.method)) {
    headers.set('X-CSRF-Token', csrfToken);
  }
  const response = await fetch(`/api${path}`, {
    ...options,
    headers,
    credentials: 'same-origin',
  });
  if (response.status === 204) return undefined as T;
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json().catch(() => ({}))
    : await response.text();
  if (!response.ok) {
    const data = payload as {
      error?: string;
      code?: string;
      details?: { path: string; message: string }[];
    };
    throw new ApiError(
      data.error || 'Request failed.',
      response.status,
      data.code || 'REQUEST_ERROR',
      data.details,
    );
  }
  return payload as T;
}

function queryString(params?: Record<string, string | number | boolean | undefined | null>) {
  if (!params) return '';
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  }
  const result = search.toString();
  return result ? `?${result}` : '';
}

export const publicApi = {
  site: () => request<PublicSitePayload>('/public/site'),
  services: () => request<{ items: Service[] }>('/public/services'),
  service: (slug: string) =>
    request<{ service: Service; related: Service[] }>(`/public/services/${encodeURIComponent(slug)}`),
  destinations: (params?: { search?: string; pathway?: string }) =>
    request<{ items: Destination[] }>(`/public/destinations${queryString(params)}`),
  destination: (slug: string) =>
    request<{ destination: Destination; relatedServices: Service[]; relatedArticles: Article[] }>(
      `/public/destinations/${encodeURIComponent(slug)}`,
    ),
  packages: () =>
    request<{ items: Package[]; paymentEnabled: boolean }>('/public/packages'),
  experts: () => request<{ items: Expert[] }>('/public/experts'),
  expert: (slug: string) =>
    request<{ expert: Expert }>(`/public/experts/${encodeURIComponent(slug)}`),
  articles: (params?: {
    search?: string;
    category?: string;
    page?: number;
    pageSize?: number;
    featured?: boolean;
  }) => request<Paginated<Article>>(`/public/articles${queryString(params)}`),
  article: (slug: string) =>
    request<{ article: Article; related: Article[] }>(`/public/articles/${encodeURIComponent(slug)}`),
  faqs: () => request<{ items: Faq[] }>('/public/faqs'),
  testimonials: () => request<{ items: Testimonial[] }>('/public/testimonials'),
  legal: (slug: string) =>
    request<{
      page: { slug: string; title_en: string; title_fa: string; body_en: string; body_fa: string; updated_at: string };
    }>(`/public/legal/${encodeURIComponent(slug)}`),
  submitConsultation: (data: Record<string, unknown>) =>
    request<{ reference: string; status: string; message: string }>('/public/consultations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  submitContact: (data: Record<string, unknown>) =>
    request<{ message: string }>('/public/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  createCheckout: (data: { consultationReference: string; packageId: number }) =>
    request<{ checkoutUrl: string; reference: string; amountMinor: number; currency: string }>(
      '/public/payments/checkout',
      { method: 'POST', body: JSON.stringify(data) },
    ),
  paymentStatus: (sessionId: string) =>
    request<{
      reference: string | null;
      paymentStatus: string;
      sessionStatus: string | null;
      amountMinor: number | null;
      currency: string | null;
      packageName: string | null;
      packageNameFa: string | null;
      recordStatus: string | null;
      description: string | null;
    }>(`/public/payments/status${queryString({ session_id: sessionId })}`),
};

export interface AdminLoginResult {
  admin: Admin;
  csrfToken: string;
  expiresAt: string;
}

export interface AdminDetail<T> {
  item: T;
}

export const adminApi = {
  login: (email: string, password: string) =>
    request<AdminLoginResult>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: () =>
    request<{ admin: Admin; csrfToken: string; expiresAt: string }>('/admin/me'),
  session: () =>
    request<{ admin: Admin | null; csrfToken: string | null; expiresAt: string | null }>(
      '/admin/session',
    ),
  logout: () => request<void>('/admin/logout', { method: 'POST' }),
  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ ok: boolean }>('/admin/account/password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  stats: () => request<DashboardStats>('/admin/stats'),
  consultations: (params?: Record<string, string | number | undefined | null>) =>
    request<Paginated<Consultation>>(`/admin/consultations${queryString(params)}`),
  consultation: (id: number) =>
    request<{
      consultation: Consultation;
      notes: ConsultationNote[];
      payments: Payment[];
    }>(`/admin/consultations/${id}`),
  updateConsultationStatus: (id: number, status: string) =>
    request<{ ok: boolean; status: string }>(`/admin/consultations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  addNote: (id: number, note: string) =>
    request<{ ok: boolean; id: number }>(`/admin/consultations/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    }),
  contactMessages: (params?: Record<string, string | number | undefined | null>) =>
    request<Paginated<ContactMessage>>(`/admin/contact-messages${queryString(params)}`),
  updateMessageStatus: (id: number, status: string) =>
    request<{ ok: boolean }>(`/admin/contact-messages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  payments: (params?: Record<string, string | number | undefined | null>) =>
    request<Paginated<Payment>>(`/admin/payments${queryString(params)}`),
  settings: () =>
    request<{
      settings: Record<string, unknown>;
      legal: {
        slug: string;
        title_en: string;
        title_fa: string;
        body_en: string;
        body_fa: string;
        updated_at: string;
      }[];
    }>('/admin/settings'),
  updateSettings: (settings: Record<string, unknown>) =>
    request<{ ok: boolean }>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
  updateLegal: (
    slug: string,
    data: { title_en: string; title_fa: string; body_en: string; body_fa: string },
  ) =>
    request<{ ok: boolean }>(`/admin/legal/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  list: <T>(resource: string, search?: string) =>
    request<{ items: T[] }>(`/admin/${resource}${queryString({ search })}`),
  get: <T>(resource: string, id: number) =>
    request<AdminDetail<T>>(`/admin/${resource}/${id}`),
  create: <T>(resource: string, data: Record<string, unknown>) =>
    request<AdminDetail<T>>(`/admin/${resource}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: <T>(resource: string, id: number, data: Record<string, unknown>) =>
    request<AdminDetail<T>>(`/admin/${resource}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  remove: (resource: string, id: number) =>
    request<{ ok: boolean }>(`/admin/${resource}/${id}`, { method: 'DELETE' }),
  upload: async (file: File) => {
    const data = new FormData();
    data.append('image', file);
    return request<{ url: string }>('/admin/uploads', { method: 'POST', body: data });
  },
};

export type ResourceName =
  | 'services'
  | 'destinations'
  | 'packages'
  | 'experts'
  | 'articles'
  | 'categories'
  | 'faqs'
  | 'testimonials';

export type ResourceItem =
  | Service
  | Destination
  | Package
  | Expert
  | Article
  | ArticleCategory
  | Faq
  | Testimonial;

export type PublicSettings = SiteSettings;
