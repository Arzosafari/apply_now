import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Clock3, Loader2, ShieldCheck, XCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { publicApi } from '@/lib/api';
import { LocalLink, useLocale } from '@/lib/i18n';
import { usePageMeta } from '@/lib/seo';
import { usePublicSite } from '@/components/PublicLayout';
import { PageHero } from '@/components/PageHero';

export function PaymentSuccessPage() {
  const site = usePublicSite();
  const { t, locale, formatPrice } = useLocale();
  const [params] = useSearchParams();
  const sessionId = params.get('session_id') || '';
  const query = useQuery({
    queryKey: ['payment-status', sessionId],
    queryFn: () => publicApi.paymentStatus(sessionId),
    enabled: Boolean(sessionId),
    retry: 2,
  });

  usePageMeta({
    title: t('payment.successTitle'),
    description: t('payment.successBody'),
    noindex: true,
  });

  const paid = query.data?.paymentStatus === 'paid';
  const pending = query.data && !paid && ['open', 'processing'].includes(query.data.sessionStatus || '');
  const failed = !sessionId || query.isError || (query.data && !paid && !pending);

  return (
    <>
      <PageHero
        eyebrow={t('payment.successTitle')}
        title={paid ? t('payment.successTitle') : pending ? t('payment.pendingTitle') : t('payment.failedTitle')}
        intro={paid ? t('payment.successBody') : pending ? t('payment.pendingBody') : t('payment.failedBody')}
        image="/images/hero-city.jpg"
        breadcrumbs={[{ label: t('nav.pricing'), to: '/pricing' }, { label: t('payment.successTitle') }]}
      />
      <section className="section">
        <div className="shell max-w-2xl">
          <div className="form-card text-center">
            {query.isLoading ? (
              <div className="py-8">
                <Loader2 size={34} className="mx-auto animate-spin text-blue" />
                <p className="mt-4 text-sm text-muted">{t('payment.verifying')}</p>
              </div>
            ) : (
              <>
                <div
                  className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${
                    paid ? 'bg-[#e9f8f0] text-[#1d8d58]' : pending ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                  }`}
                >
                  {paid ? <CheckCircle2 size={30} /> : pending ? <Clock3 size={29} /> : <XCircle size={30} />}
                </div>
                <h2 className="mt-6 font-display text-2xl font-bold text-navy">
                  {paid ? t('payment.successTitle') : pending ? t('payment.pendingTitle') : t('payment.failedTitle')}
                </h2>
                <p className="mx-auto mt-3 max-w-md text-[0.84rem] leading-7 text-muted">
                  {paid ? t('payment.successBody') : pending ? t('payment.pendingBody') : t('payment.failedBody')}
                </p>

                {query.data && (
                  <dl className="mx-auto mt-6 max-w-sm space-y-3 rounded-xl border border-line bg-sky-50 p-4 text-start text-[0.75rem]">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted">{t('payment.reference')}</dt>
                      <dd className="font-mono font-semibold text-navy">{query.data.reference || '—'}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted">{t('payment.amount')}</dt>
                      <dd className="font-semibold text-navy">
                        {query.data.amountMinor !== null && query.data.currency
                          ? formatPrice(query.data.amountMinor, query.data.currency)
                          : '—'}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted">{t('admin.status')}</dt>
                      <dd className="font-semibold uppercase tracking-[0.05em] text-navy">{query.data.recordStatus}</dd>
                    </div>
                  </dl>
                )}

                <p className="mt-4 flex items-center justify-center gap-1.5 text-[0.63rem] text-muted">
                  <ShieldCheck size={12} className="text-[#2f8a5d]" />
                  {locale === 'fa'
                    ? 'پرداخت در این پیش‌نمایش فعال نیست.'
                    : 'Payments are not connected in this frontend preview.'}
                </p>

                <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
                  <LocalLink to="/" className="btn btn-dark">{t('payment.returnHome')}</LocalLink>
                  <LocalLink to="/pricing" className="btn btn-outline">{t('payment.goPricing')}</LocalLink>
                </div>
                {failed && (
                  <p className="mt-4 text-[0.7rem] text-muted">
                    {locale === 'fa' ? 'این صفحه فقط یک پیش‌نمایش است.' : 'This page is a preview only.'}{' '}
                    <a href={`mailto:${site.settings.brand.email}`} className="text-blue underline">{site.settings.brand.email}</a>
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export function PaymentCancelledPage() {
  const { t, locale } = useLocale();
  usePageMeta({ title: t('payment.cancelledTitle'), description: t('payment.cancelledBody'), noindex: true });
  return (
    <>
      <PageHero
        eyebrow={t('pricing.eyebrow')}
        title={t('payment.cancelledTitle')}
        intro={t('payment.cancelledBody')}
        image="/images/consultation.jpg"
        breadcrumbs={[{ label: t('nav.pricing'), to: '/pricing' }, { label: t('payment.cancelledTitle') }]}
      />
      <section className="section">
        <div className="shell max-w-2xl">
          <div className="form-card text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-50 text-amber-600">
              <Clock3 size={30} />
            </div>
            <h2 className="mt-6 font-display text-2xl font-bold text-navy">{t('payment.cancelledTitle')}</h2>
            <p className="mx-auto mt-3 max-w-md text-[0.84rem] leading-7 text-muted">{t('payment.cancelledBody')}</p>
            <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
              <LocalLink to="/pricing" className="btn btn-primary">{t('payment.goPricing')}</LocalLink>
              <LocalLink to="/contact" className="btn btn-outline">{t('nav.contact')}</LocalLink>
            </div>
            <p className="mt-4 text-[0.66rem] text-muted">
              {locale === 'fa' ? 'هیچ پرداختی در این پیش‌نمایش انجام نشده است.' : 'No payment has been made in this preview.'}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
