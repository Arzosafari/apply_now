import { ArrowRight, Check, Info, LockKeyhole, ShieldCheck, X } from 'lucide-react';
import { LocalLink, useLocale } from '@/lib/i18n';
import { usePageMeta } from '@/lib/seo';
import { usePublicSite } from '@/components/PublicLayout';
import { PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { FaqAccordion } from '@/components/FaqAccordion';
import { Reveal } from '@/components/Reveal';

export function PricingPage() {
  const site = usePublicSite();
  const { t, locale, formatPrice } = useLocale();
  const { packages, faqs, settings } = site;

  usePageMeta({
    title: locale === 'fa' ? 'قیمت‌ها و بسته‌های خدمات' : 'Pricing & Service Packages',
    description: t('pricing.intro'),
    image: '/images/consultation.jpg',
  });

  const pricingFaqs = faqs.filter((faq) => faq.category === 'pricing' || faq.category === 'payments');

  return (
    <>
      <PageHero
        eyebrow={t('pricing.eyebrow')}
        title={t('pricing.title')}
        intro={t('pricing.intro')}
        image="/images/consultation.jpg"
        breadcrumbs={[{ label: t('nav.pricing') }]}
      />

      <section className="section">
        <div className="shell">
          {!site.contentVerified && (
            <div className="notice mb-8 flex items-start gap-2.5">
              <Info size={16} className="mt-0.5 shrink-0" />
              <span>{t('pricing.demoNote')}</span>
            </div>
          )}

          <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
            {packages.map((pkg, index) => {
              const features = locale === 'fa' ? pkg.features_fa : pkg.features_en;
              const exclusions = locale === 'fa' ? pkg.exclusions_fa : pkg.exclusions_en;
              const name = locale === 'fa' ? pkg.name_fa : pkg.name_en;
              const description = locale === 'fa' ? pkg.description_fa : pkg.description_en;
              const duration = locale === 'fa' ? pkg.duration_fa : pkg.duration_en;
              const canPay = pkg.cta_type === 'payment' && site.payment.enabled && pkg.price_minor > 0;
              const href = `/consultation?package=${encodeURIComponent(pkg.slug)}${canPay ? '&pay=1' : ''}`;
              return (
                <Reveal key={pkg.id} delay={index * 45}>
                  <article className={`pricing-card h-full ${pkg.featured ? 'featured' : ''}`}>
                    {pkg.featured && <span className="pricing-featured-label">{t('pricing.featured')}</span>}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-display text-[1.08rem] font-bold leading-6 text-navy">{name}</h2>
                        <p className="mt-2 text-[0.76rem] leading-6 text-muted">{description}</p>
                      </div>
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sky-100 text-blue">
                        <ShieldCheck size={17} />
                      </span>
                    </div>
                    <div className="mt-6 flex items-baseline gap-2">
                      <span className="pricing-price">{formatPrice(pkg.price_minor, pkg.currency)}</span>
                      {pkg.price_minor > 0 && <span className="text-[0.65rem] text-muted">/ {pkg.billing_type === 'deposit' ? (locale === 'fa' ? 'ودیعه' : 'deposit') : (locale === 'fa' ? 'یک‌بار' : 'one-time')}</span>}
                    </div>
                    {duration && <p className="mt-2 text-[0.68rem] text-muted">{duration}</p>}

                    <div className="mt-5 border-t border-line pt-4">
                      <p className="text-[0.63rem] font-bold uppercase tracking-[0.08em] text-[#7e8fa2]">{t('pricing.included')}</p>
                      <ul className="pricing-list">
                        {features.map((feature) => (
                          <li key={feature}>
                            <Check size={12} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {exclusions.length > 0 && (
                      <div className="mt-4">
                        <p className="text-[0.63rem] font-bold uppercase tracking-[0.08em] text-[#a0acb8]">{t('pricing.excluded')}</p>
                        <ul className="pricing-list muted-list">
                          {exclusions.slice(0, 3).map((item) => (
                            <li key={item}>
                              <X size={12} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-auto pt-6">
                      <LocalLink to={href} className={`btn w-full ${pkg.featured ? 'btn-primary' : 'btn-dark'}`}>
                        {pkg.price_minor === 0 ? t('cta.getStarted') : canPay ? (locale === 'fa' ? 'رزرو و پرداخت' : 'Book & pay online') : t('cta.book')}
                        <ArrowRight size={14} className="rtl:rotate-180" />
                      </LocalLink>
                      {pkg.cta_type === 'payment' && !site.payment.enabled && (
                        <p className="mt-2 flex items-center justify-center gap-1 text-center text-[0.6rem] leading-4 text-muted">
                          <LockKeyhole size={10} /> {locale === 'fa' ? 'پرداخت آنلاین هنوز فعال نیست' : 'Online payment is not enabled yet'}
                        </p>
                      )}
                    </div>
                  </article>
                </Reveal>
              );
            })}
            {packages.length % 3 !== 0 && (
              <article className="pricing-card !border-navy !bg-navy">
                <div className="flex h-full flex-col">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-orange">
                    <ShieldCheck size={17} />
                  </span>
                  <h2 className="mt-5 font-display text-[1.18rem] font-bold leading-7 text-white">{t('pricing.customTitle')}</h2>
                  <p className="mt-3 text-[0.78rem] leading-7 text-white/55">{t('pricing.customBody')}</p>
                  <div className="mt-auto pt-6">
                    <LocalLink to="/contact" className="btn btn-primary w-full">
                      {t('nav.contact')} <ArrowRight size={14} className="rtl:rotate-180" />
                    </LocalLink>
                  </div>
                </div>
              </article>
            )}
            {packages.length % 3 === 1 && (
              <article className="pricing-card bg-sky-50">
                <div className="flex h-full flex-col">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-blue">
                    <Info size={17} />
                  </span>
                  <h2 className="mt-5 font-display text-[1.18rem] font-bold leading-7 text-navy">{t('services.ctaTitle')}</h2>
                  <p className="mt-3 text-[0.78rem] leading-7 text-muted">{t('services.ctaBody')}</p>
                  <div className="mt-auto pt-6">
                    <LocalLink to="/consultation" className="btn btn-outline w-full">
                      {t('cta.free')} <ArrowRight size={14} className="rtl:rotate-180" />
                    </LocalLink>
                  </div>
                </div>
              </article>
            )}
          </div>

          <p className="notice mt-8">
            {locale === 'fa' ? settings.legalNotice_fa : settings.legalNotice}
          </p>
        </div>
      </section>

      <section className="section bg-sky-50">
        <div className="shell grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <div className="eyebrow">{t('home.faqEyebrow')}</div>
            <h2 className="section-title mt-4">{t('pricing.eyebrow')}</h2>
            <p className="lede mt-4">
              {locale === 'fa'
                ? 'پیش از پرداخت، دامنه خدمات، مبلغ نهایی و هزینه‌های شخص ثالث را کتبی دریافت کنید.'
                : 'Before paying, ask for the scope, final amount and third-party costs in writing.'}
            </p>
          </div>
          <div className="card px-6">
            <FaqAccordion items={pricingFaqs} />
          </div>
        </div>
      </section>

      <CtaBand
        title={t('pricing.customTitle')}
        body={t('pricing.customBody')}
        ctaLabel={t('cta.book')}
      />
    </>
  );
}
