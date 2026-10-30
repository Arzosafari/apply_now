import { DEFAULT_BRAND_LEGAL_NAME, DEFAULT_BRAND_LOGO, DEFAULT_BRAND_NAME } from '@/lib/brand';
import { useAdminTranslation } from './i18n';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle2,
  ImagePlus,
  Loader2,
  Save,
  ShieldAlert,
  Upload,
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import { errorMessage } from '@/lib/errors';
import { usePageMeta } from '@/lib/seo';
import { useLocale } from '@/lib/i18n';
import { useAdminAuth } from './AuthContext';
import { AdminPageHeader } from './AdminLayout';
import { AdminError, AdminSpinner } from './components';
import { useToast } from './Toast';

type Values = Record<string, any>;

const tabs = [
  { key: 'brand', label: 'Brand & contact' },
  { key: 'homepage', label: 'Homepage' },
  { key: 'footer', label: 'Footer & CTA' },
  { key: 'seo', label: 'SEO defaults' },
  { key: 'general', label: 'Language & verification' },
];

const socialNetworks = ['instagram', 'linkedin', 'facebook', 'youtube', 'telegram', 'x'];

function defaultsFrom(raw: Values): Values {
  const brand = (raw.brand || {}) as Values;
  const hero = (raw.hero || {}) as Values;
  const seo = (raw.seo || {}) as Values;
  const footer = (raw.footer || {}) as Values;
  const cta = (raw.cta || {}) as Values;
  const general = (raw.general || {}) as Values;
  const verification = (raw.contentVerification || {}) as Values;
  return {
    brand: {
      name: DEFAULT_BRAND_NAME,
      legalName: DEFAULT_BRAND_LEGAL_NAME,
      tagline: 'Study · Work · Live · Abroad',
      tagline_fa: 'تحصیل · کار · زندگی · خارج از کشور',
      logoUrl: DEFAULT_BRAND_LOGO,
      description: '',
      description_fa: '',
      email: 'contact@applynow.example',
      phone: '+00 000 000 0000',
      whatsapp: '',
      address: 'Office address to be confirmed',
      address_fa: 'نشانی دفتر در انتظار تأیید',
      city: 'Tehran',
      country: 'Iran',
      hours: 'Sunday–Thursday, 9:00–18:00',
      hours_fa: 'یکشنبه تا پنجشنبه، ۹:۰۰ تا ۱۸:۰۰',
      mapUrl: '',
      mapEmbedUrl: '',
      ...brand,
      social: { instagram: '', linkedin: '', facebook: '', youtube: '', telegram: '', x: '', ...(brand.social || {}) },
    },
    hero: {
      eyebrow: 'Study · Work · Live · Abroad',
      title: 'Your Global Journey',
      highlight: 'Starts Here',
      supporting: 'Turn your dreams into reality.',
      description: '',
      description_fa: '',
      eyebrow_fa: 'تحصیل · کار · زندگی · خارج از کشور',
      title_fa: 'سفر جهانی شما',
      highlight_fa: 'از اینجا آغاز می‌شود',
      supporting_fa: 'رؤیاهای خود را به واقعیت تبدیل کنید.',
      primaryCta: 'Get Free Consultation',
      primaryCta_fa: 'دریافت مشاوره رایگان',
      secondaryCta: 'Explore Our Services',
      secondaryCta_fa: 'مشاهده خدمات',
      image: '/images/hero-city.jpg',
      ...hero,
    },
    stats: Array.isArray(raw.stats) && raw.stats.length
      ? raw.stats
      : [
          { value: '10', label_en: 'Specialist services', label_fa: 'خدمت تخصصی' },
          { value: '6', label_en: 'Destination countries', label_fa: 'کشور مقصد' },
          { value: '4', label_en: 'Guided steps', label_fa: 'گام راهنما' },
          { value: '1:1', label_en: 'Advisor support', label_fa: 'پشتیبانی مشاور' },
        ],
    seo: {
      title: 'Apply Now — Immigration & Study Abroad Consultancy',
      title_fa: 'Apply Now — مشاوره مهاجرت و تحصیل در خارج',
      description: '',
      description_fa: '',
      ogImage: '/images/hero-city.jpg',
      ...seo,
    },
    footer: {
      statement: '',
      statement_fa: '',
      ...footer,
    },
    cta: {
      title: 'Ready to start your immigration journey?',
      title_fa: 'آماده شروع سفر مهاجرتی خود هستید؟',
      body: '',
      body_fa: '',
      button: 'Get Free Consultation',
      button_fa: 'دریافت مشاوره رایگان',
      ...cta,
    },
    general: { defaultLanguage: 'en', ...general },
    contentVerification: {
      verified: false,
      note: 'Preview content: profiles, testimonials, statistics and contact details are samples until verified by the Apply Now team.',
      ...verification,
    },
    legalNotice: raw.legalNotice || '',
    legalNotice_fa: raw.legalNotice_fa || '',
  };
}

function ImageSetting({ value, onChange, label }: { value: string; onChange: (value: string) => void; label: string }) {
  const a = useAdminTranslation();
  const { locale } = useLocale();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  const upload = async (file?: File) => {
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
      if (ref.current) ref.current.value = '';
    }
  };
  return (
    <div>
      <div className="flex gap-3">
        <div className="grid h-16 w-24 shrink-0 place-items-center overflow-hidden rounded-lg border border-dashed border-[#ccd9e6] bg-[#f8fbfe]">
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <ImagePlus size={20} className="text-[#9fb0c1]" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-outline btn-sm" onClick={() => ref.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}{a(" Upload ")}</button>
            {value && <button type="button" className="btn btn-outline btn-sm text-red-600" onClick={() => onChange('')}>{a("Clear")}</button>}
          </div>
          <input className="admin-input mt-2 w-full" value={value} onChange={(event) => onChange(event.target.value)} placeholder={a("/images/…")} aria-label={a(label)} />
          <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(event) => void upload(event.target.files?.[0])} />
          {error && <p className="field-error mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export function SettingsPage() {
  const a = useAdminTranslation();
  const { locale } = useLocale();
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const { admin } = useAdminAuth();
  const [tab, setTab] = useState('brand');
  const [values, setValues] = useState<Values | null>(null);
  const [saveError, setSaveError] = useState('');
  const initialized = useRef(false);
  const canEdit = admin?.role === 'owner';

  usePageMeta({ title: 'Website settings', description: 'Brand, contact and homepage settings.', noindex: true });

  const query = useQuery({ queryKey: ['admin-settings'], queryFn: adminApi.settings, retry: false });

  useEffect(() => {
    if (!query.data || initialized.current) return;
    initialized.current = true;
    setValues(defaultsFrom(query.data.settings as Values));
  }, [query.data]);

  const mutation = useMutation({
    mutationFn: (payload: Values) => adminApi.updateSettings(payload),
    onSuccess: () => {
      notify('Website settings saved.');
      setSaveError('');
      void queryClient.invalidateQueries({ queryKey: ['site'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    },
    onError: (error) => setSaveError(errorMessage(error, locale)),
  });

  if (query.isError) return <AdminError message="Settings could not be loaded." retry={() => void query.refetch()} />;
  if (query.isLoading || !values) return <AdminSpinner label={a("Loading website settings…")} />;

  const setSection = (section: string, key: string, value: unknown) => {
    setValues((current) => (current ? { ...current, [section]: { ...(current[section] || {}), [key]: value } } : current));
  };
  const setRoot = (key: string, value: unknown) => setValues((current) => (current ? { ...current, [key]: value } : current));
  const setStat = (index: number, key: string, value: string) => {
    setValues((current) => {
      if (!current) return current;
      const stats = [...(current.stats || [])];
      stats[index] = { ...stats[index], [key]: value };
      return { ...current, stats };
    });
  };

  const input = (section: string, key: string, label: string, props: { dir?: 'ltr' | 'rtl'; hint?: string; type?: string } = {}) => (
    <label className="field">
      <span className="label">{a(label)}</span>
      <input
        className="admin-input"
        type={props.type || 'text'}
        dir={props.dir}
        value={String(values[section]?.[key] ?? '')}
        onChange={(event) => setSection(section, key, event.target.value)}
      />
      {props.hint && <span className="field-hint">{a(props.hint)}</span>}
    </label>
  );

  const textarea = (section: string, key: string, label: string, dir?: 'rtl') => (
    <label className="field sm:col-span-2">
      <span className="label">{a(label)}</span>
      <textarea
        className="admin-input min-h-[100px]"
        dir={dir}
        value={String(values[section]?.[key] ?? '')}
        onChange={(event) => setSection(section, key, event.target.value)}
      />
    </label>
  );

  return (
    <>
      <AdminPageHeader
        title={a("Website settings")}
        description={a("Control the brand, contact details, homepage copy, legal notices and language default.")}
        action={
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={!canEdit || mutation.isPending}
            onClick={() => mutation.mutate(values)}
          >
            {mutation.isPending ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {mutation.isPending ? a("Saving…") : a("Save settings")}
          </button>
        }
      />

      {!canEdit && (
        <div className="notice mb-4 flex items-center gap-2 border-[#e8d1b8] bg-[#fffaf3] text-[0.72rem] text-[#7b5a39]">
          <ShieldAlert size={15} />{a(" Only the owner role can edit website settings. You can review the current values. ")}</div>
      )}
      {saveError && <div className="notice mb-4 border-red-200 bg-red-50 text-[0.72rem] text-red-800">{saveError}</div>}

      <div className="grid gap-4 lg:grid-cols-[200px_minmax(0,1fr)]">
        <div className="admin-card h-fit p-2">
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`block w-full rounded-lg px-3 py-2.5 text-start text-[0.72rem] font-medium transition ${
                tab === item.key ? 'bg-navy text-white' : 'text-[#63778d] hover:bg-[#f4f8fc]'
              }`}
            >
              {a(item.label)}
            </button>
          ))}
        </div>

        <div className="admin-card p-5 sm:p-6">
          {tab === 'brand' && (
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <h3 className="text-[0.88rem] font-semibold text-navy">{a("Brand identity")}</h3>
                <p className="mt-1 text-[0.67rem] text-[#8a9aab]">{a("The logo is used in the public header and footer.")}</p>
              </div>
              {input('brand', 'name', 'Company name')}
              {input('brand', 'legalName', 'Legal / registered name')}
              {input('brand', 'tagline', 'Tagline (English)')}
              {input('brand', 'tagline_fa', 'Tagline (Persian)', { dir: 'rtl' })}
              <div className="field">
                <span className="label">{a("Logo image")}</span>
                <ImageSetting label={a("Logo")} value={String(values.brand.logoUrl || '')} onChange={(value) => setSection('brand', 'logoUrl', value)} />
              </div>
              {textarea('brand', 'description', 'Short company description (English)')}
              {textarea('brand', 'description_fa', 'Short company description (Persian)', 'rtl')}

              <div className="mt-3 border-t border-line pt-5 sm:col-span-2">
                <h3 className="text-[0.88rem] font-semibold text-navy">{a("Contact details")}</h3>
                <p className="mt-1 text-[0.67rem] text-[#8a9aab]">{a("Only publish details that have been verified by the business.")}</p>
              </div>
              {input('brand', 'email', 'Email address', { dir: 'ltr' })}
              {input('brand', 'phone', 'Phone number', { dir: 'ltr' })}
              {input('brand', 'whatsapp', 'WhatsApp number (digits with country code)', { dir: 'ltr' })}
              {input('brand', 'city', 'City')}
              {input('brand', 'country', 'Country')}
              {input('brand', 'hours', 'Office hours (English)')}
              {input('brand', 'hours_fa', 'Office hours (Persian)', { dir: 'rtl' })}
              {input('brand', 'address', 'Office address (English)', { hint: 'Do not invent an address. Use a confirmed location before launch.' })}
              {input('brand', 'address_fa', 'Office address (Persian)', { dir: 'rtl' })}
              {input('brand', 'mapUrl', 'External map link', { dir: 'ltr' })}
              {input('brand', 'mapEmbedUrl', 'Map embed URL', { dir: 'ltr', hint: 'Supports OpenStreetMap and Google Maps embed URLs.' })}

              <div className="mt-3 border-t border-line pt-5 sm:col-span-2">
                <h3 className="text-[0.88rem] font-semibold text-navy">{a("Social profiles")}</h3>
                <p className="mt-1 text-[0.67rem] text-[#8a9aab]">{a("Leave blank to hide an icon. Icons link only to configured profiles.")}</p>
              </div>
              {socialNetworks.map((network) => (
                <label className="field" key={network}>
                  <span className="label capitalize">{network}</span>
                  <input
                    className="admin-input"
                    dir="ltr"
                    value={String(values.brand.social?.[network] || '')}
                    onChange={(event) =>
                      setSection('brand', 'social', { ...(values.brand.social || {}), [network]: event.target.value })
                    }
                    placeholder={a("https://…")}
                  />
                </label>
              ))}
            </div>
          )}

          {tab === 'homepage' && (
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <h3 className="text-[0.88rem] font-semibold text-navy">{a("Hero section")}</h3>
                <p className="mt-1 text-[0.67rem] text-[#8a9aab]">{a("This copy appears on the homepage and in previews.")}</p>
              </div>
              {input('hero', 'eyebrow', 'Eyebrow (English)')}
              {input('hero', 'eyebrow_fa', 'Eyebrow (Persian)', { dir: 'rtl' })}
              {input('hero', 'title', 'Main headline (English)')}
              {input('hero', 'title_fa', 'Main headline (Persian)', { dir: 'rtl' })}
              {input('hero', 'highlight', 'Highlighted headline (English)')}
              {input('hero', 'highlight_fa', 'Highlighted headline (Persian)', { dir: 'rtl' })}
              {input('hero', 'supporting', 'Supporting line (English)')}
              {input('hero', 'supporting_fa', 'Supporting line (Persian)', { dir: 'rtl' })}
              {textarea('hero', 'description', 'Description (English)')}
              {textarea('hero', 'description_fa', 'Description (Persian)', 'rtl')}
              {input('hero', 'primaryCta', 'Primary button label (English)')}
              {input('hero', 'primaryCta_fa', 'Primary button label (Persian)', { dir: 'rtl' })}
              {input('hero', 'secondaryCta', 'Secondary button label (English)')}
              {input('hero', 'secondaryCta_fa', 'Secondary button label (Persian)', { dir: 'rtl' })}
              <div className="field sm:col-span-2">
                <span className="label">{a("Hero image")}</span>
                <ImageSetting label={a("Hero")} value={String(values.hero.image || '')} onChange={(value) => setSection('hero', 'image', value)} />
              </div>

              <div className="mt-3 border-t border-line pt-5 sm:col-span-2">
                <h3 className="text-[0.88rem] font-semibold text-navy">{a("Homepage statistics")}</h3>
                <p className="mt-1 text-[0.67rem] text-[#8a9aab]">{a("Use only metrics that can be verified. Structural counts are safer than performance claims.")}</p>
              </div>
              {(values.stats || []).map((stat: Values, index: number) => (
                <div className="grid gap-2 rounded-lg border border-[#e8eef5] p-3 sm:col-span-2 sm:grid-cols-[90px_1fr_1fr]" key={index}>
                  <input className="admin-input" value={stat.value} onChange={(event) => setStat(index, 'value', event.target.value)} aria-label={locale === 'fa' ? `مقدار آمار ${index + 1}` : `Statistic ${index + 1} value`} />
                  <input className="admin-input" value={stat.label_en} onChange={(event) => setStat(index, 'label_en', event.target.value)} aria-label={locale === 'fa' ? `برچسب انگلیسی آمار ${index + 1}` : `Statistic ${index + 1} English label`} />
                  <input className="admin-input" dir="rtl" value={stat.label_fa} onChange={(event) => setStat(index, 'label_fa', event.target.value)} aria-label={locale === 'fa' ? `برچسب فارسی آمار ${index + 1}` : `Statistic ${index + 1} Persian label`} />
                </div>
              ))}
            </div>
          )}

          {tab === 'footer' && (
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <h3 className="text-[0.88rem] font-semibold text-navy">{a("Footer statement")}</h3>
              </div>
              {textarea('footer', 'statement', 'Footer statement (English)')}
              {textarea('footer', 'statement_fa', 'Footer statement (Persian)', 'rtl')}

              <div className="mt-3 border-t border-line pt-5 sm:col-span-2">
                <h3 className="text-[0.88rem] font-semibold text-navy">{a("Final call to action")}</h3>
                <p className="mt-1 text-[0.67rem] text-[#8a9aab]">{a("Used on the dark CTA band across public pages.")}</p>
              </div>
              {input('cta', 'title', 'CTA title (English)')}
              {input('cta', 'title_fa', 'CTA title (Persian)', { dir: 'rtl' })}
              {textarea('cta', 'body', 'CTA body (English)')}
              {textarea('cta', 'body_fa', 'CTA body (Persian)', 'rtl')}
              {input('cta', 'button', 'Button label (English)')}
              {input('cta', 'button_fa', 'Button label (Persian)', { dir: 'rtl' })}
            </div>
          )}

          {tab === 'seo' && (
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <h3 className="text-[0.88rem] font-semibold text-navy">{a("Search engine defaults")}</h3>
                <p className="mt-1 text-[0.67rem] text-[#8a9aab]">{a("Individual services, destinations and articles can override these values.")}</p>
              </div>
              {input('seo', 'title', 'Default title (English)')}
              {input('seo', 'title_fa', 'Default title (Persian)', { dir: 'rtl' })}
              {textarea('seo', 'description', 'Default meta description (English)')}
              {textarea('seo', 'description_fa', 'Default meta description (Persian)', 'rtl')}
              <div className="field sm:col-span-2">
                <span className="label">{a("Open Graph image")}</span>
                <ImageSetting label={a("OG image")} value={String(values.seo.ogImage || '')} onChange={(value) => setSection('seo', 'ogImage', value)} />
              </div>
            </div>
          )}

          {tab === 'general' && (
            <div className="grid gap-5">
              <div>
                <h3 className="text-[0.88rem] font-semibold text-navy">{a("Language default")}</h3>
                <p className="mt-1 text-[0.67rem] text-[#8a9aab]">{a("Applied to new visitors only; the language switcher always overrides it.")}</p>
                <select
                  className="admin-select mt-3 max-w-xs"
                  aria-label={a('Language default')}
                  value={String(values.general?.defaultLanguage || 'en')}
                  onChange={(event) => setSection('general', 'defaultLanguage', event.target.value)}
                >
                  <option value="en">{a("English (LTR)")}</option>
                  <option value="fa">{a("Persian (RTL)")}</option>
                </select>
              </div>

              <div className="rounded-xl border border-[#f0d6b7] bg-[#fffaf3] p-4">
                <h3 className="flex items-center gap-2 text-[0.84rem] font-semibold text-[#714f2e]">
                  <ShieldAlert size={15} />{a(" Content verification ")}</h3>
                <p className="mt-2 text-[0.7rem] leading-6 text-[#80664d]">{a(" This is a local preview. Replace and verify all sample content before launch. The preview banner remains visible in demo mode. ")}</p>
                <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-[0.74rem] font-medium text-[#5f452f]">
                  <input
                    type="checkbox"
                    className="check"
                    checked={Boolean(values.contentVerification?.verified)}
                    onChange={(event) =>
                      setSection('contentVerification', 'verified', event.target.checked)
                    }
                  />
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={14} />{a(" I confirm the public content has been replaced and reviewed.")}</span>
                </label>
                <label className="field mt-4">
                  <span className="label">{a("Internal verification note")}</span>
                  <textarea
                    className="admin-input"
                    rows={3}
                    value={String(values.contentVerification?.note || '')}
                    onChange={(event) => setSection('contentVerification', 'note', event.target.value)}
                  />
                </label>
              </div>

              <div>
                <h3 className="text-[0.88rem] font-semibold text-navy">{a("Legal notice")}</h3>
                <p className="mt-1 text-[0.67rem] text-[#8a9aab]">{a("Shown in footers and on destination pages.")}</p>
              </div>
              <label className="field">
                <span className="label">{a("Notice (English)")}</span>
                <textarea className="admin-input" rows={4} value={String(values.legalNotice || '')} onChange={(event) => setRoot('legalNotice', event.target.value)} />
              </label>
              <label className="field">
                <span className="label">{a("Notice (Persian)")}</span>
                <textarea className="admin-input" dir="rtl" rows={4} value={String(values.legalNotice_fa || '')} onChange={(event) => setRoot('legalNotice_fa', event.target.value)} />
              </label>
            </div>
          )}

          <div className="mt-7 flex items-center justify-between border-t border-line pt-4">
            <p className="text-[0.62rem] text-[#95a4b5]">{a("Changes apply only to this browser after saving.")}</p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={!canEdit || mutation.isPending}
              onClick={() => mutation.mutate(values)}
            >
              <Save size={13} /> {mutation.isPending ? a("Saving…") : a("Save settings")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
