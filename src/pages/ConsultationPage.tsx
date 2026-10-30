import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Loader2,
  LockKeyhole,
  Mail,
  MessageSquareText,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { publicApi, ApiError } from '@/lib/api';
import { errorMessage } from '@/lib/errors';
import { LocalLink, useLocale } from '@/lib/i18n';
import { usePageMeta } from '@/lib/seo';
import { usePublicSite } from '@/components/PublicLayout';
import { PageHero } from '@/components/PageHero';
import { cn } from '@/lib/utils';

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  contactMethod: 'email' | 'phone' | 'whatsapp';
  serviceId: string;
  destinationId: string;
  educationLevel: string;
  message: string;
  preferredDate: string;
  privacyConsent: boolean;
  website: string;
}

const initialForm: FormState = {
  fullName: '',
  email: '',
  phone: '',
  contactMethod: 'email',
  serviceId: '',
  destinationId: '',
  educationLevel: '',
  message: '',
  preferredDate: '',
  privacyConsent: false,
  website: '',
};

export function ConsultationPage() {
  const queryClient = useQueryClient();
  const site = usePublicSite();
  const { t, locale } = useLocale();
  const [params] = useSearchParams();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [result, setResult] = useState<{ reference: string } | null>(null);
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const initialized = useRef(false);

  const packageSlug = params.get('package') || '';
  const selectedPackage = site.packages.find((pkg) => pkg.slug === packageSlug);
  const payablePackage =
    selectedPackage && selectedPackage.cta_type === 'payment' && selectedPackage.price_minor > 0
      ? selectedPackage
      : null;

  usePageMeta({
    title: locale === 'fa' ? 'درخواست مشاوره رایگان' : 'Free Consultation Request',
    description: t('consultation.intro'),
    image: '/images/consultation.jpg',
  });

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const serviceSlug = params.get('service');
    const destinationSlug = params.get('destination');
    const service = site.services.find((item) => item.slug === serviceSlug);
    const destination = site.destinations.find((item) => item.slug === destinationSlug);
    setForm((current) => ({
      ...current,
      serviceId: service ? String(service.id) : current.serviceId,
      destinationId: destination ? String(destination.id) : current.destinationId,
    }));
  }, [params, site.services, site.destinations]);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setServerError('');
  };

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (form.fullName.trim().length < 2) next.fullName = t('form.required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = t('form.invalidEmail');
    if (form.phone.replace(/[^\p{N}]/gu, '').length < 5) next.phone = t('form.invalidPhone');
    if (form.preferredDate && form.preferredDate < today) next.preferredDate = locale === 'fa' ? 'تاریخی در آینده انتخاب کنید.' : 'Choose today or a future date.';
    if (!form.serviceId) next.serviceId = t('form.required');
    if (!form.privacyConsent) next.privacyConsent = t('form.acceptPrivacy');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError('');
    try {
      const response = await publicApi.submitConsultation({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        contactMethod: form.contactMethod,
        serviceId: form.serviceId ? Number(form.serviceId) : null,
        destinationId: form.destinationId ? Number(form.destinationId) : null,
        educationLevel: form.educationLevel || null,
        message: form.message.trim() || null,
        preferredDate: form.preferredDate || null,
        privacyConsent: true,
        website: form.website,
      });
      void queryClient.invalidateQueries({ queryKey: ['admin-consultations'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setResult({ reference: response.reference });
      window.scrollTo({ top: 220, behavior: 'smooth' });
    } catch (error) {
      if (error instanceof ApiError && error.details?.length) {
        const mapped: Partial<Record<keyof FormState, string>> = {};
        for (const issue of error.details) {
          const field = issue.path as keyof FormState;
          if (field in form) mapped[field] = issue.message;
        }
        setErrors(mapped);
      }
      setServerError(errorMessage(error, locale));
    } finally {
      setSubmitting(false);
    }
  };

  const startPayment = async () => {
    if (!result || !payablePackage) return;
    setPaying(true);
    setPaymentError('');
    try {
      const checkout = await publicApi.createCheckout({
        consultationReference: result.reference,
        packageId: payablePackage.id,
      });
      window.location.assign(checkout.checkoutUrl);
    } catch (error) {
      setPaymentError(errorMessage(error, locale));
      setPaying(false);
    }
  };

  const selectedService = site.services.find((item) => String(item.id) === form.serviceId);

  if (result) {
    return (
      <>
        <PageHero
          eyebrow={t('consultation.eyebrow')}
          title={t('consultation.successTitle')}
          intro={t('consultation.successBody')}
          image="/images/consultation.jpg"
          breadcrumbs={[{ label: t('cta.free') }]}
        />
        <section className="section">
          <div className="shell max-w-3xl">
            <div className="form-card text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e9f8f0] text-[#1d8d58]">
                <CheckCircle2 size={30} />
              </div>
              <h2 className="mt-6 font-display text-2xl font-bold text-navy">{t('consultation.successTitle')}</h2>
              <p className="mx-auto mt-3 max-w-lg text-[0.84rem] leading-7 text-muted">{t('consultation.successBody')}</p>
              <div className="mx-auto mt-7 max-w-sm rounded-xl border border-dashed border-[#c9d9e7] bg-sky-50 px-5 py-4">
                <div className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-muted">{t('consultation.reference')}</div>
                <div className="mt-2 font-mono text-xl font-bold tracking-[0.06em] text-navy">{result.reference}</div>
              </div>
              <div className="mx-auto mt-4 max-w-md text-start text-[0.76rem] leading-7 text-muted">
                <p className="flex gap-2">
                  <Clock3 size={14} className="mt-1 shrink-0 text-blue" />
                  {locale === 'fa' ? 'هیچ مشاوره‌ای رزرو نشده و تماسی انجام نخواهد شد.' : 'No consultation was booked and no follow-up will be sent.'}
                </p>
              </div>

              {payablePackage && (
                <div className="mt-7 rounded-xl border border-line bg-[#fbfdff] p-5 text-start">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-[0.9rem]">
                        {t('consultation.paymentTitle')} — {locale === 'fa' ? payablePackage.name_fa : payablePackage.name_en}
                      </h3>
                      <p className="mt-1.5 text-[0.73rem] leading-6 text-muted">{t('consultation.paymentBody')}</p>
                    </div>
                    <strong className="whitespace-nowrap font-display text-lg text-navy">
                      {new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
                        style: 'currency',
                        currency: payablePackage.currency,
                        maximumFractionDigits: 0,
                      }).format(payablePackage.price_minor / 100)}
                    </strong>
                  </div>
                  {site.payment.enabled ? (
                    <button type="button" className="btn btn-primary mt-4 w-full" disabled={paying} onClick={() => void startPayment()}>
                      {paying ? <Loader2 size={15} className="animate-spin" /> : <CreditCard size={15} />}
                      {paying ? t('common.loading') : t('consultation.payNow')}
                    </button>
                  ) : (
                    <p className="notice mt-4 flex items-start gap-2 text-[0.7rem]">
                      <LockKeyhole size={14} className="mt-0.5 shrink-0" /> {t('consultation.paymentUnavailable')}
                    </p>
                  )}
                  {paymentError && <p className="field-error mt-2">{paymentError}</p>}
                </div>
              )}

              <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
                <LocalLink to="/" className="btn btn-dark">
                  {t('payment.returnHome')}
                </LocalLink>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setResult(null);
                    setForm(initialForm);
                    setErrors({});
                  }}
                >
                  {t('consultation.another')}
                </button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow={t('consultation.eyebrow')}
        title={t('consultation.title')}
        intro={t('consultation.intro')}
        image="/images/consultation.jpg"
        breadcrumbs={[{ label: t('cta.free') }]}
      />

      <section className="section">
        <div className="shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <form className="form-card" onSubmit={(event) => void submit(event)} noValidate>
            <div className="notice mb-6" role="note">{locale === 'fa' ? 'این فرم نمایشی است؛ اطلاعات واقعی یا حساس وارد نکنید. داده‌ها فقط در مرورگر شما ذخیره می‌شوند و ارسال نمی‌شوند.' : 'Demo form only. Do not enter real or sensitive information. Entries stay in this browser and are not sent.'}</div>
            <section className="consultation-benefits mb-7" aria-labelledby="consultation-benefits-title">
              <div className="flex items-start gap-3">
                <span className="consultation-benefits-icon" aria-hidden="true"><MessageSquareText size={18} /></span>
                <div className="min-w-0">
                  <div className="eyebrow">{t('consultation.benefitsEyebrow')}</div>
                  <h2 id="consultation-benefits-title" className="mt-2 font-display text-[1.05rem] font-bold text-navy">{t('consultation.benefitsTitle')}</h2>
                  <p className="mt-2 text-[0.78rem] leading-6 text-muted">{t('consultation.benefitsBody')}</p>
                </div>
              </div>
              <ul className="consultation-benefits-list">
                {(['consultation.benefit1', 'consultation.benefit2', 'consultation.benefit3'] as const).map((key) => (
                  <li key={key}>
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-blue" aria-hidden="true" />
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>
            </section>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="eyebrow">{t('consultation.eyebrow')}</div>
                <h2 className="mt-3 font-display text-xl font-bold text-navy">{t('consultation.formTitle')}</h2>
              </div>
              <span className="hidden items-center gap-1.5 text-[0.62rem] text-muted sm:flex">
                <LockKeyhole size={12} /> {locale === 'fa' ? 'ارسال امن' : 'Secure form'}
              </span>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div className="field">
                <label className="label" htmlFor="fullName">
                  {t('consultation.name')} <span className="required">*</span>
                </label>
                <input
                  id="fullName"
                  className="input"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(event) => setField('fullName', event.target.value)}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  placeholder={locale === 'fa' ? 'نام و نام خانوادگی' : 'Your full name'}
                />
                {errors.fullName && <p id="fullName-error" className="field-error">{errors.fullName}</p>}
              </div>

              <div className="field">
                <label className="label" htmlFor="email">
                  {t('consultation.email')} <span className="required">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  dir="ltr"
                  className="input"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => setField('email', event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  placeholder="you@example.com"
                />
                {errors.email && <p id="email-error" className="field-error">{errors.email}</p>}
              </div>

              <div className="field">
                <label className="label" htmlFor="phone">
                  {t('consultation.phone')} <span className="required">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  dir="ltr"
                  className="input"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(event) => setField('phone', event.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  placeholder="+00 000 000 0000"
                />
                {errors.phone && <p id="phone-error" className="field-error">{errors.phone}</p>}
              </div>

              <div className="field">
                <label className="label" htmlFor="contactMethod">{t('consultation.contactMethod')}</label>
                <select
                  id="contactMethod"
                  className="select"
                  value={form.contactMethod}
                  onChange={(event) => setField('contactMethod', event.target.value as FormState['contactMethod'])}
                >
                  <option value="email">{t('consultation.methodEmail')}</option>
                  <option value="phone">{t('consultation.methodPhone')}</option>
                  <option value="whatsapp">{t('consultation.methodWhatsapp')}</option>
                </select>
              </div>

              <div className="field">
                <label className="label" htmlFor="serviceId">
                  {t('consultation.service')} <span className="required">*</span>
                </label>
                <select
                  id="serviceId"
                  className="select"
                  value={form.serviceId}
                  onChange={(event) => setField('serviceId', event.target.value)}
                  aria-invalid={Boolean(errors.serviceId)}
                >
                  <option value="">{t('consultation.selectService')}</option>
                  {site.services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {locale === 'fa' ? service.title_fa : service.title_en}
                    </option>
                  ))}
                </select>
                {errors.serviceId && <p className="field-error">{errors.serviceId}</p>}
              </div>

              <div className="field">
                <label className="label" htmlFor="destinationId">{t('consultation.destination')}</label>
                <select
                  id="destinationId"
                  className="select"
                  value={form.destinationId}
                  onChange={(event) => setField('destinationId', event.target.value)}
                >
                  <option value="">{t('consultation.selectDestination')}</option>
                  {site.destinations.map((destination) => (
                    <option key={destination.id} value={destination.id}>
                      {locale === 'fa' ? destination.name_fa : destination.name_en}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label className="label" htmlFor="educationLevel">{t('consultation.education')}</label>
                <select
                  id="educationLevel"
                  className="select"
                  value={form.educationLevel}
                  onChange={(event) => setField('educationLevel', event.target.value)}
                >
                  <option value="">{t('consultation.selectEducation')}</option>
                  <option value="high_school">{t('consultation.highSchool')}</option>
                  <option value="bachelor">{t('consultation.bachelor')}</option>
                  <option value="master">{t('consultation.master')}</option>
                  <option value="doctorate">{t('consultation.doctorate')}</option>
                  <option value="other">{t('consultation.other')}</option>
                </select>
              </div>

              <div className="field">
                <label className="label" htmlFor="preferredDate">{t('consultation.date')}</label>
                <div className="relative">
                  <CalendarDays size={14} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[#8fa1b5]" />
                  <input
                    id="preferredDate"
                    type="date"
                    min={today}
                    className="input !pe-9"
                    value={form.preferredDate}
                    onChange={(event) => setField('preferredDate', event.target.value)}
                  />
                </div>
                {errors.preferredDate && <p className="field-error">{errors.preferredDate}</p>}
              </div>

              <div className="field sm:col-span-2">
                <label className="label" htmlFor="message">{t('consultation.message')}</label>
                <textarea
                  id="message"
                  className="textarea"
                  rows={5}
                  value={form.message}
                  onChange={(event) => setField('message', event.target.value)}
                  placeholder={
                    locale === 'fa'
                      ? 'هدف خود، زمان‌بندی، بودجه یا هر نکته مهم درباره پرونده را بنویسید. مدارک حساس را ارسال نکنید.'
                      : 'Tell us about your goal, timeline, budget or anything important about your case. Please do not send sensitive documents.'
                  }
                  maxLength={4000}
                />
                <span className="field-hint">{form.message.length}/4000</span>
              </div>
            </div>

            <div className="sr-only" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(event) => setField('website', event.target.value)}
              />
            </div>

            <label className="mt-6 flex cursor-pointer items-start gap-2.5 text-[0.74rem] leading-6 text-[#526980]">
              <input
                type="checkbox"
                className="check"
                checked={form.privacyConsent}
                onChange={(event) => setField('privacyConsent', event.target.checked)}
                aria-invalid={Boolean(errors.privacyConsent)}
              />
              <span>
                {t('consultation.consent')}{' '}
                <LocalLink to="/privacy-policy" className="font-semibold text-blue underline underline-offset-2">
                  {t('footer.privacy')}
                </LocalLink>
              </span>
            </label>
            {errors.privacyConsent && <p className="field-error mt-1">{errors.privacyConsent}</p>}

            {serverError && (
              <div className="notice mt-4 border-red-200 bg-red-50 text-red-800" role="alert">
                {serverError}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-1.5 text-[0.65rem] text-muted">
                <ShieldCheck size={13} className="text-[#2f8a5d]" /> {t('consultation.privacyNote')}
              </p>
              <button type="submit" className="btn btn-primary min-w-44" disabled={submitting}>
                {submitting ? <Loader2 size={15} className="animate-spin" /> : <MessageSquareText size={15} />}
                {submitting ? t('consultation.sending') : t('consultation.submit')}
              </button>
            </div>
          </form>

          <aside className="detail-sidebar">
            <div className="rounded-[16px] bg-navy p-6 text-white">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-orange text-navy">
                <Clock3 size={18} />
              </div>
              <h2 className="mt-5 font-display text-[1.12rem] font-bold text-white">{t('consultation.whyTitle')}</h2>
              <ol className="mt-5 space-y-4">
                {[1, 2, 3, 4].map((step) => (
                  <li key={step} className="flex gap-3 text-[0.74rem] leading-6 text-white/60">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-[0.58rem] font-bold text-orange">
                      {step}
                    </span>
                    <span>{t(`consultation.why${step}` as never)}</span>
                  </li>
                ))}
              </ol>
            </div>

            {selectedService && (
              <div className="card mt-5 p-5">
                <div className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-muted">
                  {locale === 'fa' ? 'خدمت انتخاب‌شده' : 'Selected service'}
                </div>
                <div className="mt-2 text-[0.84rem] font-semibold text-navy">
                  {locale === 'fa' ? selectedService.title_fa : selectedService.title_en}
                </div>
                <p className="mt-2 text-[0.72rem] leading-6 text-muted">
                  {locale === 'fa' ? selectedService.short_fa : selectedService.short_en}
                </p>
              </div>
            )}

            <div className="card mt-5 p-5">
              <h2 className="text-[0.84rem]">{t('contact.getInTouch')}</h2>
              <a className="mt-3 flex items-center gap-2 text-[0.72rem] text-muted hover:text-navy" href={`mailto:${site.settings.brand.email}`}>
                <Mail size={13} className="text-blue" /> {site.settings.brand.email}
              </a>
              <p className="mt-3 flex items-center gap-2 text-[0.72rem] text-muted">
                <UserRound size={13} className="text-blue" /> {locale === 'fa' ? site.settings.brand.hours_fa : site.settings.brand.hours}
              </p>
              {selectedPackage && (
                <p className="mt-4 border-t border-line pt-4 text-[0.69rem] leading-6 text-muted">
                  {locale === 'fa' ? 'بسته انتخاب‌شده' : 'Selected package'}:{' '}
                  <strong className="text-navy">{locale === 'fa' ? selectedPackage.name_fa : selectedPackage.name_en}</strong>
                </p>
              )}
            </div>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[0.61rem] text-muted">
              <LockKeyhole size={11} /> {locale === 'fa' ? 'فقط نمایش محلی؛ اطلاعات واقعی وارد نکنید' : 'Browser-only demo; do not enter real information'}
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
