import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  CheckCircle2,
  Clock3,
  Facebook,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Youtube,
} from 'lucide-react';
import { publicApi } from '@/lib/api';
import { errorMessage } from '@/lib/errors';
import { useLocale } from '@/lib/i18n';
import { usePageMeta } from '@/lib/seo';
import { usePublicSite } from '@/components/PublicLayout';
import { PageHero } from '@/components/PageHero';
import { LocalLink } from '@/lib/i18n';

const socialIcons: Record<string, typeof Instagram> = {
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: Facebook,
  youtube: Youtube,
  telegram: Send,
  x: Send,
};

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  website: string;
}

const empty: ContactForm = { name: '', email: '', phone: '', subject: '', message: '', website: '' };

export function ContactPage() {
  const queryClient = useQueryClient();
  const site = usePublicSite();
  const { t, locale } = useLocale();
  const brand = site.settings.brand;
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  usePageMeta({
    title: locale === 'fa' ? 'تماس با ما' : `Contact ${brand.name}`,
    description: t('contact.intro'),
    image: '/images/office.jpg',
  });

  const setField = (key: keyof ContactForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: Partial<Record<keyof ContactForm, string>> = {};
    if (form.name.trim().length < 2) next.name = t('form.required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = t('form.invalidEmail');
    if (form.phone.trim() && form.phone.replace(/[^\p{N}]/gu, '').length < 5) next.phone = t('form.invalidPhone');
    if (!form.subject.trim()) next.subject = t('form.required');
    if (form.message.trim().length < 10) next.message = locale === 'fa' ? 'پیام باید حداقل ۱۰ کاراکتر باشد.' : 'Please write at least 10 characters.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSending(true);
    setServerError('');
    try {
      await publicApi.submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        subject: form.subject.trim(),
        message: form.message.trim(),
        website: form.website,
      });
      void queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setSuccess(true);
      setForm(empty);
    } catch (error) {
      setServerError(errorMessage(error, locale));
    } finally {
      setSending(false);
    }
  };

  const social = Object.entries(brand.social || {}).filter(([, url]) => Boolean(url));
  const mapAllowed =
    brand.mapEmbedUrl &&
    /^https:\/\/(www\.openstreetmap\.org|www\.google\.com\/maps|maps\.google\.com)/.test(brand.mapEmbedUrl);

  return (
    <>
      <PageHero
        eyebrow={t('contact.eyebrow')}
        title={t('contact.title')}
        intro={t('contact.intro')}
        image="/images/office.jpg"
        breadcrumbs={[{ label: t('nav.contact') }]}
      />

      <section className="section">
        <div className="shell grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <div className="eyebrow">{t('contact.getInTouch')}</div>
            <h2 className="section-title mt-4">
              {locale === 'fa' ? 'با تیم ما صحبت کنید' : 'Talk to our team'}
            </h2>
            <p className="lede mt-4">
              {locale === 'fa'
                ? 'برای پرسش‌های عمومی از فرم استفاده کنید. برای بررسی پرونده، درخواست مشاوره را انتخاب کنید.'
                : 'Use the form for general questions. For a case-specific review, start a consultation request.'}
            </p>

            <div className="mt-7 grid gap-3">
              <a className="contact-info-card" href={`mailto:${brand.email}`}>
                <span className="contact-info-icon"><Mail size={17} /></span>
                <div>
                  <div className="text-[0.61rem] font-bold uppercase tracking-[0.1em] text-muted">{t('contact.email')}</div>
                  <div className="mt-1 break-all text-[0.82rem] font-medium text-navy">{brand.email}</div>
                </div>
              </a>
              <a className="contact-info-card" href={`tel:${brand.phone}`}>
                <span className="contact-info-icon"><Phone size={17} /></span>
                <div>
                  <div className="text-[0.61rem] font-bold uppercase tracking-[0.1em] text-muted">{t('contact.phone')}</div>
                  <div className="mt-1 text-[0.82rem] font-medium text-navy" dir="ltr">{brand.phone}</div>
                </div>
              </a>
              {brand.whatsapp && (
                <a className="contact-info-card" href={`https://wa.me/${brand.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                  <span className="contact-info-icon"><MessageCircle size={17} /></span>
                  <div>
                    <div className="text-[0.61rem] font-bold uppercase tracking-[0.1em] text-muted">{t('contact.whatsapp')}</div>
                    <div className="mt-1 text-[0.82rem] font-medium text-navy" dir="ltr">{brand.whatsapp}</div>
                  </div>
                </a>
              )}
              {!brand.whatsapp && <div className="contact-info-card"><span className="contact-info-icon"><MessageCircle size={17} /></span><div><div className="text-[0.61rem] font-bold uppercase tracking-[0.1em] text-muted">{t('contact.whatsapp')}</div><div className="mt-1 text-[0.82rem] text-navy">{t('common.notConfigured')}</div></div></div>}
              <div className="contact-info-card">
                <span className="contact-info-icon"><MapPin size={17} /></span>
                <div>
                  <div className="text-[0.61rem] font-bold uppercase tracking-[0.1em] text-muted">{t('contact.address')}</div>
                  <div className="mt-1 text-[0.82rem] font-medium leading-6 text-navy">{locale === 'fa' ? brand.address_fa : brand.address}</div>
                </div>
              </div>
              <div className="contact-info-card">
                <span className="contact-info-icon"><Clock3 size={17} /></span>
                <div>
                  <div className="text-[0.61rem] font-bold uppercase tracking-[0.1em] text-muted">{t('contact.hours')}</div>
                  <div className="mt-1 text-[0.82rem] font-medium text-navy">{locale === 'fa' ? brand.hours_fa : brand.hours}</div>
                </div>
              </div>
            </div>

            {social.length > 0 && (
              <div className="mt-6">
                <div className="text-[0.63rem] font-bold uppercase tracking-[0.1em] text-muted">{t('contact.follow')}</div>
                <div className="mt-3 flex gap-2">
                  {social.map(([network, url]) => {
                    const Icon = socialIcons[network] || Send;
                    return (
                      <a key={network} href={url} target="_blank" rel="noopener noreferrer" className="social-btn social-btn-light" aria-label={network}>
                        <Icon size={15} />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {social.length === 0 && <p className="mt-6 text-[0.72rem] text-muted">{t('contact.follow')}: {t('common.notConfigured')}</p>}

            <LocalLink to="/consultation" className="btn btn-dark mt-7">
              {t('cta.book')}
            </LocalLink>

            <div className="mt-7 rounded-xl border border-line bg-white p-5">
              <h3 className="flex items-center gap-2 text-[0.86rem]">
                <ShieldCheck size={15} className="text-[#2f8a5d]" />
                {locale === 'fa' ? 'کانال مناسب را انتخاب کنید' : 'Choose the right channel'}
              </h3>
              <ul className="mt-3 space-y-2.5 text-[0.72rem] leading-6 text-[#64788c]">
                <li className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-orange" />
                  {locale === 'fa' ? 'پرسش عمومی: فرم تماس' : 'General question: use this contact form'}
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-orange" />
                  {locale === 'fa' ? 'بررسی پرونده: درخواست مشاوره' : 'Case assessment: request a consultation'}
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-orange" />
                  {locale === 'fa' ? 'گذرنامه یا اطلاعات پرداخت را ایمیل نکنید' : 'Never email passport or payment details'}
                </li>
              </ul>
            </div>
          </div>

          <div>
            <div className="form-card">
              <div className="notice mb-6" role="note">{locale === 'fa' ? 'این فرم نمایشی است؛ اطلاعات واقعی وارد نکنید. پیام فقط در این مرورگر ذخیره می‌شود و ارسال نخواهد شد.' : 'Demo form only. Do not enter real information. Your message stays in this browser and is not sent.'}</div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-navy">{t('contact.formTitle')}</h2>
                  <p className="mt-2 max-w-md text-[0.74rem] leading-6 text-muted">{t('contact.formIntro')}</p>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sky-100 text-blue">
                  <MessageCircle size={18} />
                </span>
              </div>

              {success ? (
                <div className="mt-8 rounded-xl border border-[#cfe8da] bg-[#f4fbf7] p-6 text-center">
                  <CheckCircle2 size={38} className="mx-auto text-[#1f8a55]" />
                  <h3 className="mt-4 text-lg">{t('contact.success')}</h3>
                  <button type="button" className="btn btn-outline btn-sm mt-5" onClick={() => setSuccess(false)}>
                    {t('contact.send')}
                  </button>
                </div>
              ) : (
                <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={(event) => void submit(event)} noValidate>
                  <div className="field">
                    <label className="label" htmlFor="contact-name">{t('contact.name')} <span className="required">*</span></label>
                    <input
                      id="contact-name"
                      className="input"
                      autoComplete="name"
                      value={form.name}
                      onChange={(event) => setField('name', event.target.value)}
                      aria-invalid={Boolean(errors.name)}
                    />
                    {errors.name && <p className="field-error">{errors.name}</p>}
                  </div>
                  <div className="field">
                    <label className="label" htmlFor="contact-email">{t('contact.email')} <span className="required">*</span></label>
                    <input
                      id="contact-email"
                      type="email"
                      dir="ltr"
                      className="input"
                      autoComplete="email"
                      value={form.email}
                      onChange={(event) => setField('email', event.target.value)}
                      aria-invalid={Boolean(errors.email)}
                    />
                    {errors.email && <p className="field-error">{errors.email}</p>}
                  </div>
                  <div className="field">
                    <label className="label" htmlFor="contact-phone">{t('contact.phone')} <span className="text-muted">({t('common.optional')})</span></label>
                    <input
                      id="contact-phone"
                      type="tel"
                      dir="ltr"
                      className="input"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(event) => setField('phone', event.target.value)}
                      aria-invalid={Boolean(errors.phone)}
                    />
                    {errors.phone && <p className="field-error">{errors.phone}</p>}
                  </div>
                  <div className="field">
                    <label className="label" htmlFor="contact-subject">{t('contact.subject')} <span className="required">*</span></label>
                    <input
                      id="contact-subject"
                      className="input"
                      value={form.subject}
                      onChange={(event) => setField('subject', event.target.value)}
                      aria-invalid={Boolean(errors.subject)}
                    />
                    {errors.subject && <p className="field-error">{errors.subject}</p>}
                  </div>
                  <div className="field sm:col-span-2">
                    <label className="label" htmlFor="contact-message">{t('contact.message')} <span className="required">*</span></label>
                    <textarea
                      id="contact-message"
                      className="textarea"
                      rows={6}
                      value={form.message}
                      onChange={(event) => setField('message', event.target.value)}
                      aria-invalid={Boolean(errors.message)}
                      placeholder={locale === 'fa' ? 'چگونه می‌توانیم کمک کنیم؟' : 'How can we help?'}
                    />
                    {errors.message && <p className="field-error">{errors.message}</p>}
                  </div>
                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="contact-website">Website</label>
                    <input id="contact-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => setField('website', event.target.value)} />
                  </div>
                  {serverError && <div className="notice sm:col-span-2 border-red-200 bg-red-50 text-red-800">{serverError}</div>}
                  <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[0.62rem] leading-5 text-muted">
                      {locale === 'fa' ? 'با ثبت نمایشی فرم، ' : 'By saving this demo form, you acknowledge the ' }<LocalLink to="/privacy-policy" className="text-blue underline">{locale === 'fa' ? 'سیاست حریم خصوصی' : 'privacy policy'}</LocalLink>{locale === 'fa' ? ' را می‌پذیرید.' : '.'}
                    </p>
                    <button type="submit" className="btn btn-primary" disabled={sending}>
                      {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={14} />}
                      {sending ? t('contact.sending') : t('contact.send')}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="mt-6">
              <h2 className="mb-3 text-[0.9rem]">{t('contact.map')}</h2>
              <div className="map-panel">
                {mapAllowed ? (
                  <iframe
                    title={t('contact.map')}
                    src={brand.mapEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <>
                    <div className="world-dots" />
                    <div className="map-pin">
                      <MapPin size={20} />
                    </div>
                    <div className="absolute inset-x-4 bottom-4 rounded-lg border border-white/60 bg-white/92 p-3 text-center backdrop-blur">
                      <p className="text-[0.7rem] leading-5 text-muted">{t('contact.mapPending')}</p>
                      {brand.mapUrl && (
                        <a href={brand.mapUrl} target="_blank" rel="noopener noreferrer" className="link-arrow mt-1 text-[0.67rem]">
                          {t('contact.openMap')}
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
