import { useAdminTranslation } from './i18n';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, Loader2, Save, ShieldAlert } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { errorMessage } from '@/lib/errors';
import { usePageMeta } from '@/lib/seo';
import { useLocale } from '@/lib/i18n';
import { AdminPageHeader } from './AdminLayout';
import { AdminError, AdminSpinner } from './components';
import { useToast } from './Toast';

interface LegalRecord {
  slug: string;
  title_en: string;
  title_fa: string;
  body_en: string;
  body_fa: string;
  updated_at: string;
}

export function LegalAdminPage() {
  const a = useAdminTranslation();
  const { locale } = useLocale();
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const [slug, setSlug] = useState('privacy-policy');
  const [form, setForm] = useState<LegalRecord | null>(null);
  const [error, setError] = useState('');
  const initialized = useRef(false);

  usePageMeta({ title: 'Legal pages', description: 'Edit privacy and terms content.', noindex: true });

  const query = useQuery({ queryKey: ['admin-legal'], queryFn: adminApi.settings, retry: false });

  useEffect(() => {
    if (!query.data || initialized.current) return;
    initialized.current = true;
    const first = (query.data.legal as LegalRecord[]).find((item) => item.slug === slug);
    if (first) setForm(first);
  }, [query.data, slug]);

  const mutation = useMutation({
    mutationFn: (record: LegalRecord) =>
      adminApi.updateLegal(record.slug, {
        title_en: record.title_en,
        title_fa: record.title_fa,
        body_en: record.body_en,
        body_fa: record.body_fa,
      }),
    onSuccess: () => {
      notify('Legal page saved.');
      setError('');
      void queryClient.invalidateQueries();
    },
    onError: (caught) => setError(errorMessage(caught, locale)),
  });

  if (query.isLoading) return <AdminSpinner label={a("Loading legal pages…")} />;
  if (query.isError || !form) return <AdminError message="Legal pages could not be loaded." retry={() => void query.refetch()} />;

  const selected = (query.data?.legal as LegalRecord[]).find((item) => item.slug === slug);

  const switchPage = (nextSlug: string) => {
    const next = (query.data?.legal as LegalRecord[]).find((item) => item.slug === nextSlug);
    setSlug(nextSlug);
    if (next) setForm(next);
  };

  return (
    <>
      <AdminPageHeader
        title={a("Legal pages")}
        description={a("Edit the privacy policy and terms shown on the public website.")}
        action={
          <button type="button" className="btn btn-primary btn-sm" disabled={mutation.isPending} onClick={() => mutation.mutate(form)}>
            {mutation.isPending ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {mutation.isPending ? a("Saving…") : a("Save page")}
          </button>
        }
      />

      <div className="notice mb-4 flex items-start gap-2.5">
        <ShieldAlert size={15} className="mt-0.5 shrink-0" />
        <span className="text-[0.7rem] leading-6">{a(" These are editable templates, not reviewed legal advice. Have a qualified professional review the final text before launch. Do not publish claims that the policy has been legally approved. ")}</span>
      </div>
      {error && <div className="notice mb-4 border-red-200 bg-red-50 text-[0.72rem] text-red-800">{error}</div>}

      <div className="grid gap-4 lg:grid-cols-[200px_minmax(0,1fr)]">
        <div className="admin-card h-fit p-2">
          {[
            { slug: 'privacy-policy', label: 'Privacy Policy' },
            { slug: 'terms-and-conditions', label: 'Terms & Conditions' },
          ].map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => switchPage(item.slug)}
              className={`block w-full rounded-lg px-3 py-2.5 text-start text-[0.72rem] font-medium ${
                slug === item.slug ? 'bg-navy text-white' : 'text-[#63778d] hover:bg-[#f4f8fc]'
              }`}
            >
              {a(item.label)}
            </button>
          ))}
          <a
            href={`${locale === 'fa' ? '/fa' : ''}/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex items-center gap-1.5 border-t border-[#eef2f7] px-3 py-3 text-[0.65rem] font-medium text-blue hover:text-orange-600"
          >{a(" View public page ")}<ExternalLink size={11} />
          </a>
          {selected && (
            <p className="px-3 pb-2 text-[0.58rem] leading-5 text-[#9aa9b9]">{a(" Updated ")}{new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-GB', { dateStyle: 'medium' }).format(new Date(selected.updated_at))}
            </p>
          )}
        </div>

        <div className="grid gap-4">
          <div className="admin-card p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="field">
                <span className="label">{a("Title (English)")}</span>
                <input className="admin-input" value={form.title_en} onChange={(event) => setForm({ ...form, title_en: event.target.value })} />
              </label>
              <label className="field">
                <span className="label">{a("Title (Persian)")}</span>
                <input className="admin-input" dir="rtl" value={form.title_fa} onChange={(event) => setForm({ ...form, title_fa: event.target.value })} />
              </label>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="admin-card p-5">
              <h3 className="text-[0.8rem] font-semibold text-navy">{a("English content")}</h3>
              <p className="mt-1 text-[0.62rem] text-[#93a2b4]">{a("Markdown is supported.")}</p>
              <textarea
                className="admin-input mt-3 min-h-[560px] font-mono !text-[0.7rem] leading-6"
                aria-label={a('English content')}
                value={form.body_en}
                onChange={(event) => setForm({ ...form, body_en: event.target.value })}
              />
            </div>
            <div className="admin-card p-5">
              <h3 className="text-[0.8rem] font-semibold text-navy">{a("Persian content")}</h3>
              <p className="mt-1 text-[0.62rem] text-[#93a2b4]">{a("Markdown is supported.")}</p>
              <textarea
                className="admin-input mt-3 min-h-[560px] font-mono !text-[0.7rem] leading-6"
                dir="rtl"
                aria-label={a('Persian content')}
                value={form.body_fa}
                onChange={(event) => setForm({ ...form, body_fa: event.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
