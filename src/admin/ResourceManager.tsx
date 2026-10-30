import { useAdminTranslation } from './i18n';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDialogFocus } from '@/lib/useDialogFocus';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ChevronDown,
  Eye,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type { ArticleCategory } from '@shared/types';
import { adminApi, ApiError } from '@/lib/api';
import { errorMessage } from '@/lib/errors';
import { usePageMeta } from '@/lib/seo';
import { useLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { AdminPageHeader } from './AdminLayout';
import { AdminError, AdminSpinner, ConfirmDialog, StatusBadge, TableEmpty } from './components';
import { useToast } from './Toast';
import type { AdminField, ResourceConfig } from './resourceConfigs';

type FormData = Record<string, unknown>;

function toFormValue(field: AdminField, value: unknown) {
  if (field.type === 'lines') return Array.isArray(value) ? value.join('\n') : '';
  if (field.type === 'money') return value === null || value === undefined ? '' : Number(value) / 100;
  if (field.type === 'datetime') {
    if (!value) return '';
    const date = new Date(String(value));
    if (Number.isNaN(date.getTime())) return '';
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60 * 1000).toISOString().slice(0, 16);
  }
  if (field.type === 'faqs') return Array.isArray(value) ? value : [];
  if (value === null || value === undefined) return field.type === 'checkbox' ? false : '';
  return value;
}

function toPayloadValue(field: AdminField, value: unknown) {
  if (field.type === 'lines') {
    return String(value || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }
  if (field.type === 'faqs') {
    return Array.isArray(value)
      ? (value as { q: string; a: string }[]).filter((item) => item.q.trim() || item.a.trim())
      : [];
  }
  if (field.type === 'number') return Number(value || 0);
  if (field.type === 'money') return Math.round(Number(value || 0) * 100);
  if (field.type === 'checkbox') return Boolean(value);
  if (field.type === 'datetime') {
    if (!value) return null;
    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }
  if (field.name === 'category_id') {
    return value ? Number(value) : null;
  }
  if (field.nullable && (value === '' || value === undefined)) return null;
  if (['currency', 'country_code'].includes(field.name)) return String(value || '').toUpperCase();
  return value;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 90);
}

function ImageField({
  field,
  value,
  onChange,
}: {
  field: AdminField;
  value: unknown;
  onChange: (value: string) => void;
}) {
  const a = useAdminTranslation();
  const { locale } = useLocale();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const url = typeof value === 'string' ? value : '';

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const result = await adminApi.upload(file);
      onChange(result.url);
    } catch (caught) {
      setError(errorMessage(caught, locale));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <div className="flex gap-3">
        <div className="grid h-20 w-28 shrink-0 place-items-center overflow-hidden rounded-lg border border-dashed border-[#cdd9e6] bg-[#f8fbfe]">
          {url ? (
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus size={22} className="text-[#9eb0c2]" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-outline btn-sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
              {uploading ? a("Uploading…") : a("Upload image")}
            </button>
            {url && (
              <button type="button" className="btn btn-outline btn-sm text-red-600" onClick={() => onChange('')}>{a(" Remove ")}</button>
            )}
          </div>
          <input
            className="admin-input mt-2 w-full"
            value={url}
            onChange={(event) => onChange(event.target.value)}
            placeholder={a("/images/example.jpg or https://…")}
            aria-label={`${a(field.label)} URL`}
          />
          <p className="mt-1 text-[0.6rem] text-[#98a7b7]">{a("JPG, PNG, WebP or GIF · maximum 750 KB, stored in this browser.")}</p>
          {error && <p className="field-error mt-1">{error}</p>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(event) => void upload(event.target.files?.[0])}
      />
    </div>
  );
}

function FaqsEditor({ value, onChange }: { value: unknown; onChange: (value: unknown) => void }) {
  const a = useAdminTranslation();
  const items = Array.isArray(value) ? (value as { q: string; a: string }[]) : [];
  const update = (index: number, key: 'q' | 'a', next: string) => {
    const copy = items.map((item) => ({ ...item }));
    copy[index] = { ...copy[index], [key]: next };
    onChange(copy);
  };
  return (
    <div className="grid gap-2">
      {items.map((item, index) => (
        <div className="rounded-lg border border-[#e5edf5] bg-[#fbfcfe] p-3" key={index}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-[#93a2b4]">{a("FAQ ")}{index + 1}</span>
            <button type="button" className="text-[#9aa9b9] hover:text-red-600" onClick={() => onChange(items.filter((_, i) => i !== index))} aria-label={a("Remove FAQ")}>
              <Trash2 size={13} />
            </button>
          </div>
          <input className="admin-input w-full" value={item.q} onChange={(event) => update(index, 'q', event.target.value)} placeholder={a("Question")} />
          <textarea className="admin-input mt-2 w-full" rows={2} value={item.a} onChange={(event) => update(index, 'a', event.target.value)} placeholder={a("Answer")} />
        </div>
      ))}
      <button type="button" className="btn btn-outline btn-sm self-start" onClick={() => onChange([...items, { q: '', a: '' }])}>
        <Plus size={13} />{a(" Add FAQ ")}</button>
    </div>
  );
}

export function ResourceManager({ config }: { config: ResourceConfig }) {
  const a = useAdminTranslation();
  const { locale } = useLocale();
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const [search, setSearch] = useState('');
  const [visibility, setVisibility] = useState('all');
  const [viewing, setViewing] = useState<Record<string, unknown> | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useDialogFocus<HTMLDivElement>(drawerOpen);
  const viewRef = useDialogFocus<HTMLElement>(Boolean(viewing));
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<FormData>(config.defaultValues);
  const [activeSection, setActiveSection] = useState('basics');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Record<string, unknown> | null>(null);

  usePageMeta({ title: `${config.title} — Admin`, description: config.description, noindex: true });

  const query = useQuery({
    queryKey: ['admin-resource', config.resource],
    queryFn: () => adminApi.list<Record<string, unknown>>(config.resource),
    retry: false,
  });

  const hasCategoryFields = config.fields.some((field) => field.optionsFrom === 'categories');
  const categoriesQuery = useQuery({
    queryKey: ['admin-resource', 'categories', 'options'],
    queryFn: () => adminApi.list<ArticleCategory>('categories'),
    enabled: hasCategoryFields,
  });

  const sectionList = useMemo(() => {
    const seen: { key: string; label: string }[] = [];
    const labels: Record<string, string> = {
      basics: 'Basics',
      en: 'English',
      fa: 'Persian',
      details: 'Details',
      seo: 'SEO',
    };
    for (const field of config.fields) {
      if (!seen.some((item) => item.key === field.section)) {
        seen.push({ key: field.section, label: labels[field.section] || field.section });
      }
    }
    return seen;
  }, [config.fields]);

  const visibilityField = config.resource === 'articles' ? 'status' : config.resource === 'packages' ? 'visible' :
    config.fields.some((field) => field.name === 'published') ? 'published' : null;
  const hasFeatured = config.fields.some((field) => field.name === 'featured');
  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return (query.data?.items || []).filter((item) => {
      const matchesSearch = !needle || config.searchFields.some((key) => String(item[key] || '').toLowerCase().includes(needle));
      const isPublished = visibilityField === 'status' ? item.status === 'published' : visibilityField ? Boolean(item[visibilityField]) : true;
      const matchesVisibility = visibility === 'all' || (visibility === 'published' && isPublished) ||
        (visibility === 'hidden' && !isPublished) || (visibility === 'featured' && Boolean(item.featured));
      return matchesSearch && matchesVisibility;
    });
  }, [query.data, search, visibility, visibilityField, config.searchFields]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setDrawerOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!viewing) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setViewing(null); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [viewing]);

  useEffect(() => { setSearch(''); setVisibility('all'); setViewing(null); setDrawerOpen(false); }, [config.resource]);

  const openNew = () => {
    setEditing(null);
    setForm({ ...config.defaultValues });
    setErrors({});
    setFormError('');
    setActiveSection(sectionList[0]?.key || 'basics');
    setDrawerOpen(true);
  };

  const openEdit = (item: Record<string, unknown>) => {
    const next: FormData = {};
    for (const field of config.fields) next[field.name] = toFormValue(field, item[field.name]);
    setEditing(item);
    setForm(next);
    setErrors({});
    setFormError('');
    setActiveSection(sectionList[0]?.key || 'basics');
    setDrawerOpen(true);
  };

  const setField = (field: AdminField, value: unknown) => {
    setForm((current) => {
      const next = { ...current, [field.name]: value };
      if (field.name === 'slug' || field.name === config.slugFrom) {
        // handled below
      }
      return next;
    });
    setErrors((current) => ({ ...current, [field.name]: '' }));
  };

  const generateSlug = () => {
    const title = String(form[config.titleField] || '');
    setField({ name: 'slug', label: 'slug', type: 'text', section: 'basics' }, slugify(title));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    for (const field of config.fields) {
      if (!field.required) continue;
      const value = form[field.name];
      if (value === null || value === undefined || String(value).trim() === '') {
        next[field.name] = 'This field is required.';
      }
    }
    const slug = String(form.slug || '').trim();
    if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) next.slug = 'Use lowercase letters, numbers and single hyphens.';
    const countryCode = String(form.country_code || '').trim();
    if (countryCode && !/^[a-zA-Z]{2}$/.test(countryCode)) next.country_code = 'Enter a two-letter country code.';
    const currency = String(form.currency || '').trim();
    if (currency && !/^[a-zA-Z]{3}$/.test(currency)) next.currency = 'Enter a three-letter currency code.';
    if (config.resource === 'testimonials' && (Number(form.rating) < 1 || Number(form.rating) > 5)) next.rating = 'Rating must be between 1 and 5.';
    setErrors(next);
    if (Object.keys(next).length) {
      const first = config.fields.find((field) => next[field.name]);
      if (first) setActiveSection(first.section);
      setFormError('Please review the highlighted fields.');
      return false;
    }
    return true;
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload: FormData = {};
      for (const field of config.fields) payload[field.name] = toPayloadValue(field, form[field.name]);
      if (!payload.published_at && payload.status !== 'published') {
        // Drafts may have no publication date.
      }
      if (editing) return adminApi.update<Record<string, unknown>>(config.resource, Number(editing.id), payload);
      return adminApi.create<Record<string, unknown>>(config.resource, payload);
    },
    onSuccess: () => {
      notify(locale === 'fa' ? `${a(config.singular)} ذخیره شد.` : `${config.singular} saved.`);
      setDrawerOpen(false);
      void queryClient.invalidateQueries();
    },
    onError: (error) => {
      if (error instanceof ApiError && error.details?.length) {
        const next: Record<string, string> = {};
        for (const issue of error.details) next[issue.path] = issue.message;
        setErrors(next);
        const first = config.fields.find((field) => next[field.name]);
        if (first) setActiveSection(first.section);
      }
      setFormError(errorMessage(error, locale));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.remove(config.resource, id),
    onSuccess: () => {
      notify(locale === 'fa' ? `${a(config.singular)} حذف شد.` : `${config.singular} deleted.`);
      setDeleteTarget(null);
      void queryClient.invalidateQueries();
    },
    onError: (error) => notify(errorMessage(error, locale), 'error'),
  });

  const categoryOptions = (categoriesQuery.data?.items || []).map((item) => ({
    value: String(item.id),
    label: locale === 'fa' ? item.name_fa : item.name_en,
  }));

  const drawerTitle = locale === 'fa' ? `${editing ? 'ویرایش' : 'افزودن'} ${a(config.singular)}` : editing ? `Edit ${config.singular.toLowerCase()}` : `New ${config.singular.toLowerCase()}`;

  return (
    <>
      <AdminPageHeader
        title={a(config.title)}
        description={a(config.description)}
        action={
          <button type="button" className="btn btn-primary btn-sm" onClick={openNew}>
            <Plus size={14} />{locale === 'fa' ? ` ${a(config.singular)} جدید` : ` New ${config.singular.toLowerCase()}`}
          </button>
        }
      />

      <div className="admin-card overflow-hidden">
        <div className="admin-filter-bar">
          <label className="relative min-w-[220px] flex-1">
            <span className="sr-only">{a("Search ")}{a(config.title)}</span>
            <Search size={14} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[#93a4b6]" />
            <input
              className="admin-input w-full !ps-8"
              placeholder={locale === 'fa' ? `جست‌وجوی ${a(config.title)}…` : `Search ${config.title.toLowerCase()}…`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          {visibilityField && <select className="admin-select" value={visibility} onChange={(event) => setVisibility(event.target.value)} aria-label={locale === 'fa' ? 'فیلتر وضعیت انتشار' : 'Filter publication status'}>
            <option value="all">{a('All statuses')}</option>
            <option value="published">{a('Published')}</option>
            <option value="hidden">{locale === 'fa' ? 'پنهان / پیش‌نویس' : 'Hidden / draft'}</option>
            {hasFeatured && <option value="featured">{a('Featured')}</option>}
          </select>}
          <span className="text-[0.65rem] text-[#8b9bad]">
            {filtered.length} {filtered.length === 1 ? a("record") : a("records")}
          </span>
        </div>

        {query.isLoading ? (
          <AdminSpinner />
        ) : query.isError ? (
          <AdminError message={`${config.title} could not be loaded.`} retry={() => void query.refetch()} />
        ) : filtered.length === 0 ? (
          <TableEmpty label={search || visibility !== 'all' ? a('No records match your search.') : locale === 'fa' ? `هنوز ${a(config.title)} ثبت نشده است.` : `No ${config.title.toLowerCase()} yet.`} />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {config.columns.map((column) => (
                    <th key={column.key}>{a(column.label)}</th>
                  ))}
                  <th className="text-end">{a("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={String(item.id)}>
                    {config.columns.map((column) => {
                      const rawValue = item[column.key];
                      const secondaryKey = column.secondaryKey || (column.key.endsWith('_en') ? column.key.replace(/_en$/, '_fa') : undefined);
                      const secondary = secondaryKey ? item[secondaryKey] : null;
                      const value = locale === 'fa' && secondary ? secondary : rawValue;
                      const secondaryValue = locale === 'fa' && secondary ? rawValue : secondary;
                      if (column.type === 'status') {
                        return (
                          <td key={column.key} data-label={a(column.label)}>
                            <StatusBadge status={String(value || 'draft')} />
                          </td>
                        );
                      }
                      if (column.type === 'boolean') {
                        return (
                          <td key={column.key} data-label={a(column.label)}>
                            {value ? <span className="tag tag-green">{a("Yes")}</span> : <span className="tag tag-gray">{a("No")}</span>}
                          </td>
                        );
                      }
                      if (column.type === 'money') {
                        return (
                          <td key={column.key} data-label={a(column.label)} className="whitespace-nowrap">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: String(item.currency || 'USD'),
                              maximumFractionDigits: 0,
                            }).format(Number(value || 0) / 100)}
                          </td>
                        );
                      }
                      if (column.type === 'date') {
                        return (
                          <td key={column.key} data-label={a(column.label)} className="whitespace-nowrap">
                            {value
                              ? new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-GB', { dateStyle: 'medium' }).format(new Date(String(value)))
                              : '—'}
                          </td>
                        );
                      }
                      return (
                        <td key={column.key} data-label={a(column.label)}>
                          <div className="max-w-[260px]">
                            <div className="truncate font-medium text-[#304a63]">{a(['category', 'cta_type'].includes(column.key) ? String(value || '—').replaceAll('-', ' ').replaceAll('_', ' ') : String(value || '—'))}</div>
                            {secondaryValue ? <div className="mt-0.5 truncate text-[0.6rem] text-[#96a5b5]">{String(secondaryValue)}</div> : null}
                          </div>
                        </td>
                      );
                    })}
                    <td data-label={a("Actions")} className="text-end">
                      <div className="flex justify-end gap-1">
                        <button type="button" className="grid h-7 w-7 place-items-center rounded-md border border-[#e4ebf3] text-[#71839a] hover:text-navy" onClick={() => setViewing(item)} aria-label={locale === 'fa' ? `مشاهده ${a(config.singular)}` : `View ${config.singular}`}><Eye size={13} /></button>
                        <button
                          type="button"
                          className="grid h-7 w-7 place-items-center rounded-md border border-[#e4ebf3] text-[#71839a] hover:border-[#c4d5e5] hover:text-navy"
                          onClick={() => openEdit(item)}
                          aria-label={locale === 'fa' ? `ویرایش ${a(config.singular)}` : `Edit ${config.singular}`}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          className="grid h-7 w-7 place-items-center rounded-md border border-[#e4ebf3] text-[#a67878] hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          onClick={() => setDeleteTarget(item)}
                          aria-label={locale === 'fa' ? `حذف ${a(config.singular)}` : `Delete ${config.singular}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {drawerOpen && (
        <div className="admin-drawer-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setDrawerOpen(false)}>
          <div ref={drawerRef} tabIndex={-1} className="admin-drawer" role="dialog" aria-modal="true" aria-labelledby="resource-drawer-title">
            <div className="admin-drawer-header">
              <div>
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-[#93a2b4]">{a(config.title)}</p>
                <h2 id="resource-drawer-title" className="mt-0.5 text-[1rem] font-semibold text-navy">{drawerTitle}</h2>
              </div>
              <button type="button" className="icon-btn !h-8 !w-8" onClick={() => setDrawerOpen(false)} aria-label={a("Close")}>
                <X size={15} />
              </button>
            </div>

            <div className="border-b border-[#e4ebf3] bg-white px-5">
              <div className="flex gap-5 overflow-x-auto" role="tablist" aria-label={locale === 'fa' ? 'بخش‌های محتوا' : 'Content sections'}>
                {sectionList.map((section) => (
                  <button
                    key={section.key}
                    type="button"
                    role="tab"
                    aria-selected={activeSection === section.key}
                    className="admin-tab whitespace-nowrap"
                    onClick={() => setActiveSection(section.key)}
                  >
                    {a(section.label)}
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-drawer-body">
              {formError && <div className="notice mb-4 border-red-200 bg-red-50 text-[0.72rem] text-red-800">{a(formError)}</div>}
              <div className="grid gap-4 sm:grid-cols-2">
                {config.fields
                  .filter((field) => field.section === activeSection)
                  .map((field) => {
                    const isFa = field.name.endsWith('_fa') || field.name === 'name_fa' || field.name === 'category_fa' || field.name === 'role_fa';
                    const span = field.span === 2 || ['textarea', 'markdown', 'lines', 'faqs', 'image'].includes(field.type) ? 'sm:col-span-2' : '';
                    const value = form[field.name];
                    return (
                      <div className={cn('field', span)} key={field.name}>
                        {field.type !== 'checkbox' && (
                          <label className="label" htmlFor={`field-${field.name}`}>
                            {a(field.label)} {field.required && <span className="required">*</span>}
                          </label>
                        )}

                        {field.type === 'checkbox' ? (
                          <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-[#e5edf5] bg-white px-3 py-2.5 text-[0.74rem] font-medium text-[#40566c]">
                            <input
                              id={`field-${field.name}`}
                              type="checkbox"
                              className="check"
                              checked={Boolean(value)}
                              onChange={(event) => setField(field, event.target.checked)}
                            />
                            <span>{a(field.label)}</span>
                          </label>
                        ) : field.type === 'image' ? (
                          <ImageField field={field} value={value} onChange={(next) => setField(field, next)} />
                        ) : field.type === 'faqs' ? (
                          <FaqsEditor value={value} onChange={(next) => setField(field, next)} />
                        ) : field.type === 'select' ? (
                          <select
                            id={`field-${field.name}`}
                            className="admin-select"
                            value={String(value ?? '')}
                            onChange={(event) => setField(field, event.target.value)}
                          >
                            <option value="">{a("Select…")}</option>
                            {(field.optionsFrom === 'categories' ? categoryOptions : field.options || []).map((option) => (
                              <option key={option.value} value={option.value}>{a(option.label)}</option>
                            ))}
                          </select>
                        ) : field.type === 'lines' ? (
                          <textarea
                            id={`field-${field.name}`}
                            className="admin-input min-h-[112px]"
                            dir={isFa ? 'rtl' : 'ltr'}
                            rows={field.rows || 5}
                            value={String(value ?? '')}
                            onChange={(event) => setField(field, event.target.value)}
                            placeholder={field.placeholder || a("One item per line")}
                          />
                        ) : field.type === 'textarea' || field.type === 'markdown' ? (
                          <textarea
                            id={`field-${field.name}`}
                            className={cn('admin-input', field.type === 'markdown' && 'font-mono !text-[0.7rem] leading-6')}
                            dir={isFa ? 'rtl' : 'ltr'}
                            rows={field.rows || 4}
                            value={String(value ?? '')}
                            onChange={(event) => setField(field, event.target.value)}
                            placeholder={field.placeholder ? a(field.placeholder) : undefined}
                          />
                        ) : field.type === 'datetime' ? (
                          <input
                            id={`field-${field.name}`}
                            type="datetime-local"
                            className="admin-input"
                            value={String(value ?? '')}
                            onChange={(event) => setField(field, event.target.value)}
                          />
                        ) : field.type === 'number' || field.type === 'money' ? (
                          <input
                            id={`field-${field.name}`}
                            type="number"
                            min="0"
                            step={field.type === 'money' ? '0.01' : '1'}
                            className="admin-input"
                            value={String(value ?? '')}
                            onChange={(event) => setField(field, event.target.value)}
                          />
                        ) : (
                          <div className="flex gap-2">
                            <input
                              id={`field-${field.name}`}
                              className="admin-input"
                              dir={isFa ? 'rtl' : field.name === 'slug' || field.name === 'country_code' || field.name.includes('url') ? 'ltr' : undefined}
                              value={String(value ?? '')}
                              onChange={(event) => setField(field, event.target.value)}
                              placeholder={field.placeholder ? a(field.placeholder) : undefined}
                            />
                            {field.name === 'slug' && (
                              <button type="button" className="btn btn-outline btn-sm shrink-0" onClick={generateSlug}>{a(" Generate ")}</button>
                            )}
                          </div>
                        )}

                        {field.help && <p className="field-hint">{a(field.help)}</p>}
                        {errors[field.name] && <p className="field-error">{a(errors[field.name])}</p>}
                      </div>
                    );
                  })}
              </div>
              <p className="mt-6 flex items-center gap-1.5 text-[0.61rem] text-[#9aa9b9]">
                <ChevronDown size={12} />{a(" Changes are saved only in this browser for the demonstration. ")}</p>
            </div>

            <div className="admin-drawer-footer">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setDrawerOpen(false)} disabled={saveMutation.isPending}>{a(" Cancel ")}</button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                disabled={saveMutation.isPending}
                onClick={() => {
                  if (validate()) saveMutation.mutate();
                }}
              >
                {saveMutation.isPending && <Loader2 size={13} className="animate-spin" />}
                {saveMutation.isPending ? a("Saving…") : a("Save changes")}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewing && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-navy/45 p-4" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setViewing(null)}>
          <section ref={viewRef} tabIndex={-1} className="w-full max-w-2xl rounded-xl bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="resource-view-title">
            <div className="flex items-center justify-between border-b border-line p-5">
              <div><p className="text-xs text-muted">{a(config.title)}</p><h2 id="resource-view-title" className="mt-1 text-lg">{String(viewing[locale === 'fa' && config.titleField.endsWith('_en') ? config.titleField.replace(/_en$/, '_fa') : config.titleField] || viewing[config.titleField] || a(config.singular))}</h2></div>
              <button type="button" className="icon-btn" onClick={() => setViewing(null)} aria-label={a('Close')}><X size={16} /></button>
            </div>
            <div className="grid max-h-[65vh] gap-4 overflow-y-auto p-5 sm:grid-cols-2">
              {config.fields.filter((field) => viewing[field.name] !== null && viewing[field.name] !== undefined && viewing[field.name] !== '').map((field) => {
                const value = viewing[field.name];
                if (field.type === 'image' && typeof value === 'string') {
                  return <div key={field.name} className="sm:col-span-2"><p className="text-xs font-semibold text-muted">{a(field.label)}</p><img className="mt-2 max-h-48 max-w-full rounded-lg object-contain" src={value} alt={a(field.label)} /></div>;
                }
                const display = field.type === 'money' ? (Number(value) / 100).toFixed(2) : Array.isArray(value) ? value.map((entry) => typeof entry === 'object' && entry ? Object.values(entry).join(' — ') : String(entry)).join('\n') : typeof value === 'boolean' ? a(value ? 'Yes' : 'No') : a(String(value));
                return <div key={field.name} className={field.span === 2 || display.length > 120 ? 'sm:col-span-2' : ''}><p className="text-xs font-semibold text-muted">{a(field.label)}</p><p className="mt-1 whitespace-pre-wrap break-words text-sm text-navy">{display || '—'}</p></div>;
              })}
            </div>
            <div className="flex justify-end gap-2 border-t border-line p-4"><button type="button" className="btn btn-outline btn-sm" onClick={() => setViewing(null)}>{a('Close')}</button><button type="button" className="btn btn-dark btn-sm" onClick={() => { const item = viewing; setViewing(null); openEdit(item); }}>{a('Edit')}</button></div>
          </section>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={locale === 'fa' ? `حذف ${a(config.singular)}؟` : `Delete ${config.singular.toLowerCase()}?`}
        body={locale === 'fa' ? 'این مورد از داده محلی مرورگر حذف می‌شود و قابل بازگشت نیست.' : 'This removes the record from this browser’s demo data. This action cannot be undone.'}
        busy={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(Number(deleteTarget.id));
        }}
      />
    </>
  );
}
