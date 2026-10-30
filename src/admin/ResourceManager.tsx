import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ChevronDown,
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
      setError(errorMessage(caught, 'en'));
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
              {uploading ? 'Uploading…' : 'Upload image'}
            </button>
            {url && (
              <button type="button" className="btn btn-outline btn-sm text-red-600" onClick={() => onChange('')}>
                Remove
              </button>
            )}
          </div>
          <input
            className="admin-input mt-2 w-full"
            value={url}
            onChange={(event) => onChange(event.target.value)}
            placeholder="/images/example.jpg or https://…"
            aria-label={`${field.label} URL`}
          />
          <p className="mt-1 text-[0.6rem] text-[#98a7b7]">JPG, PNG, WebP or GIF · maximum 5 MB.</p>
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
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-[#93a2b4]">FAQ {index + 1}</span>
            <button type="button" className="text-[#9aa9b9] hover:text-red-600" onClick={() => onChange(items.filter((_, i) => i !== index))} aria-label="Remove FAQ">
              <Trash2 size={13} />
            </button>
          </div>
          <input className="admin-input w-full" value={item.q} onChange={(event) => update(index, 'q', event.target.value)} placeholder="Question" />
          <textarea className="admin-input mt-2 w-full" rows={2} value={item.a} onChange={(event) => update(index, 'a', event.target.value)} placeholder="Answer" />
        </div>
      ))}
      <button type="button" className="btn btn-outline btn-sm self-start" onClick={() => onChange([...items, { q: '', a: '' }])}>
        <Plus size={13} /> Add FAQ
      </button>
    </div>
  );
}

export function ResourceManager({ config }: { config: ResourceConfig }) {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  const filtered = useMemo(() => {
    const items = query.data?.items || [];
    if (!search.trim()) return items;
    const needle = search.toLowerCase();
    return items.filter((item) =>
      config.searchFields.some((key) => String(item[key] || '').toLowerCase().includes(needle)),
    );
  }, [query.data, search, config.searchFields]);

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
    setErrors(next);
    if (Object.keys(next).length) {
      const first = config.fields.find((field) => next[field.name]);
      if (first) setActiveSection(first.section);
      setFormError('Please complete the required fields before saving.');
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
      notify(`${config.singular} saved.`);
      setDrawerOpen(false);
      void queryClient.invalidateQueries({ queryKey: ['admin-resource', config.resource] });
      void queryClient.invalidateQueries({ queryKey: ['site'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (error) => {
      if (error instanceof ApiError && error.details?.length) {
        const next: Record<string, string> = {};
        for (const issue of error.details) next[issue.path] = issue.message;
        setErrors(next);
      }
      setFormError(errorMessage(error, 'en'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.remove(config.resource, id),
    onSuccess: () => {
      notify(`${config.singular} deleted.`);
      setDeleteTarget(null);
      void queryClient.invalidateQueries({ queryKey: ['admin-resource', config.resource] });
      void queryClient.invalidateQueries({ queryKey: ['site'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (error) => notify(errorMessage(error, 'en'), 'error'),
  });

  const categoryOptions = (categoriesQuery.data?.items || []).map((item) => ({
    value: String(item.id),
    label: item.name_en,
  }));

  const drawerTitle = editing ? `Edit ${config.singular.toLowerCase()}` : `New ${config.singular.toLowerCase()}`;

  return (
    <>
      <AdminPageHeader
        title={config.title}
        description={config.description}
        action={
          <button type="button" className="btn btn-primary btn-sm" onClick={openNew}>
            <Plus size={14} /> New {config.singular.toLowerCase()}
          </button>
        }
      />

      <div className="admin-card overflow-hidden">
        <div className="admin-filter-bar">
          <label className="relative min-w-[220px] flex-1">
            <span className="sr-only">Search {config.title}</span>
            <Search size={14} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[#93a4b6]" />
            <input
              className="admin-input w-full !ps-8"
              placeholder={`Search ${config.title.toLowerCase()}…`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <span className="text-[0.65rem] text-[#8b9bad]">
            {filtered.length} {filtered.length === 1 ? 'record' : 'records'}
          </span>
        </div>

        {query.isLoading ? (
          <AdminSpinner />
        ) : query.isError ? (
          <AdminError message={`${config.title} could not be loaded.`} retry={() => void query.refetch()} />
        ) : filtered.length === 0 ? (
          <TableEmpty label={search ? 'No records match your search.' : `No ${config.title.toLowerCase()} yet.`} />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {config.columns.map((column) => (
                    <th key={column.key}>{column.label}</th>
                  ))}
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={String(item.id)}>
                    {config.columns.map((column) => {
                      const value = item[column.key];
                      const secondary = column.secondaryKey ? item[column.secondaryKey] : null;
                      if (column.type === 'status') {
                        return (
                          <td key={column.key} data-label={column.label}>
                            <StatusBadge status={String(value || 'draft')} />
                          </td>
                        );
                      }
                      if (column.type === 'boolean') {
                        return (
                          <td key={column.key} data-label={column.label}>
                            {value ? <span className="tag tag-green">Yes</span> : <span className="tag tag-gray">No</span>}
                          </td>
                        );
                      }
                      if (column.type === 'money') {
                        return (
                          <td key={column.key} data-label={column.label} className="whitespace-nowrap">
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
                          <td key={column.key} data-label={column.label} className="whitespace-nowrap">
                            {value
                              ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(String(value)))
                              : '—'}
                          </td>
                        );
                      }
                      return (
                        <td key={column.key} data-label={column.label}>
                          <div className="max-w-[260px]">
                            <div className="truncate font-medium text-[#304a63]">{String(value || '—')}</div>
                            {secondary ? <div className="mt-0.5 truncate text-[0.6rem] text-[#96a5b5]" dir="rtl">{String(secondary)}</div> : null}
                          </div>
                        </td>
                      );
                    })}
                    <td data-label="Actions" className="text-end">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          className="grid h-7 w-7 place-items-center rounded-md border border-[#e4ebf3] text-[#71839a] hover:border-[#c4d5e5] hover:text-navy"
                          onClick={() => openEdit(item)}
                          aria-label={`Edit ${config.singular}`}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          className="grid h-7 w-7 place-items-center rounded-md border border-[#e4ebf3] text-[#a67878] hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          onClick={() => setDeleteTarget(item)}
                          aria-label={`Delete ${config.singular}`}
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
          <div className="admin-drawer" role="dialog" aria-modal="true" aria-labelledby="resource-drawer-title">
            <div className="admin-drawer-header">
              <div>
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-[#93a2b4]">{config.title}</p>
                <h2 id="resource-drawer-title" className="mt-0.5 text-[1rem] font-semibold text-navy">{drawerTitle}</h2>
              </div>
              <button type="button" className="icon-btn !h-8 !w-8" onClick={() => setDrawerOpen(false)} aria-label="Close">
                <X size={15} />
              </button>
            </div>

            <div className="border-b border-[#e4ebf3] bg-white px-5">
              <div className="flex gap-5 overflow-x-auto">
                {sectionList.map((section) => (
                  <button
                    key={section.key}
                    type="button"
                    role="tab"
                    aria-selected={activeSection === section.key}
                    className="admin-tab whitespace-nowrap"
                    onClick={() => setActiveSection(section.key)}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-drawer-body">
              {formError && <div className="notice mb-4 border-red-200 bg-red-50 text-[0.72rem] text-red-800">{formError}</div>}
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
                            {field.label} {field.required && <span className="required">*</span>}
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
                            <span>{field.label}</span>
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
                            <option value="">Select…</option>
                            {(field.optionsFrom === 'categories' ? categoryOptions : field.options || []).map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
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
                            placeholder={field.placeholder || 'One item per line'}
                          />
                        ) : field.type === 'textarea' || field.type === 'markdown' ? (
                          <textarea
                            id={`field-${field.name}`}
                            className={cn('admin-input', field.type === 'markdown' && 'font-mono !text-[0.7rem] leading-6')}
                            dir={isFa ? 'rtl' : 'ltr'}
                            rows={field.rows || 4}
                            value={String(value ?? '')}
                            onChange={(event) => setField(field, event.target.value)}
                            placeholder={field.placeholder}
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
                              placeholder={field.placeholder}
                            />
                            {field.name === 'slug' && (
                              <button type="button" className="btn btn-outline btn-sm shrink-0" onClick={generateSlug}>
                                Generate
                              </button>
                            )}
                          </div>
                        )}

                        {field.help && <p className="field-hint">{field.help}</p>}
                        {errors[field.name] && <p className="field-error">{errors[field.name]}</p>}
                      </div>
                    );
                  })}
              </div>
              <p className="mt-6 flex items-center gap-1.5 text-[0.61rem] text-[#9aa9b9]">
                <ChevronDown size={12} /> Changes are saved to the live database and recorded in the activity log.
              </p>
            </div>

            <div className="admin-drawer-footer">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setDrawerOpen(false)} disabled={saveMutation.isPending}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                disabled={saveMutation.isPending}
                onClick={() => {
                  if (validate()) saveMutation.mutate();
                }}
              >
                {saveMutation.isPending && <Loader2 size={13} className="animate-spin" />}
                {saveMutation.isPending ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Delete ${config.singular.toLowerCase()}?`}
        body="This removes the record from the database. Related public pages may stop linking to it. This action cannot be undone."
        busy={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(Number(deleteTarget.id));
        }}
      />
    </>
  );
}
