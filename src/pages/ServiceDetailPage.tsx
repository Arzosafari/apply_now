import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  Check,
  Clock3,
  FileText,
  Info,
  MessageSquareText,
  ShieldCheck,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { publicApi } from '@/lib/api';
import { LocalLink, useLocale } from '@/lib/i18n';
import { usePageMeta } from '@/lib/seo';
import { PageHero } from '@/components/PageHero';
import { FaqAccordion } from '@/components/FaqAccordion';
import { ServiceCard } from '@/components/Cards';
import { Markdown } from '@/components/Markdown';
import { CtaBand } from '@/components/CtaBand';
import { usePublicSite } from '@/components/PublicLayout';

export function ServiceDetailPage() {
  const { slug = '' } = useParams();
  const { t, locale, pick } = useLocale();
  const site = usePublicSite();
  const query = useQuery({
    queryKey: ['service', slug],
    queryFn: () => publicApi.service(slug),
    enabled: Boolean(slug),
  });

  const service = query.data?.service;
  const title = service ? pick(service.title_en, service.title_fa) : t('common.loading');
  usePageMeta({
    title: service ? `${title} — ${locale === 'fa' ? 'خدمات' : 'Services'}` : t('common.loading'),
    description: service
      ? pick(service.seo_description_en, service.seo_description_fa) || pick(service.short_en, service.short_fa)
      : '',
    image: service?.image,
    type: 'website',
    jsonLd: service
      ? {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: title,
          description: pick(service.short_en, service.short_fa),
          provider: { '@type': 'ProfessionalService', name: site.settings.brand.name },
        }
      : undefined,
  });

  if (query.isLoading) {
    return (
      <div className="shell py-24">
        <div className="skeleton h-10 w-2/3" />
        <div className="skeleton mt-4 h-5 w-1/2" />
        <div className="skeleton mt-12 h-96 w-full" />
      </div>
    );
  }

  if (query.isError || !service) {
    return (
      <div className="shell py-28 text-center">
        <h1 className="text-2xl">{t('common.error')}</h1>
        <p className="mt-3 text-sm text-muted">{t('common.errorBody')}</p>
        <LocalLink to="/services" className="btn btn-dark mt-6">
          {t('nav.services')}
        </LocalLink>
      </div>
    );
  }

  const eligibility = locale === 'fa' ? service.eligibility_fa : service.eligibility_en;
  const documents = locale === 'fa' ? service.documents_fa : service.documents_en;
  const process = locale === 'fa' ? service.process_fa : service.process_en;
  const benefits = locale === 'fa' ? service.benefits_fa : service.benefits_en;
  const faqs = locale === 'fa' ? service.faqs_fa : service.faqs_en;
  const description = pick(service.description_en, service.description_fa);
  const related = query.data?.related || [];

  return (
    <>
      <PageHero
        eyebrow={locale === 'fa' ? service.category_fa : service.category_en}
        title={title}
        intro={pick(service.short_en, service.short_fa)}
        image={service.image || '/images/consultation.jpg'}
        breadcrumbs={[
          { label: t('nav.services'), to: '/services' },
          { label: title },
        ]}
      />

      <section className="section">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="tag">
                <ShieldCheck size={12} /> {t('services.available')}
              </span>
              {service.timeline_en && (
                <span className="tag tag-gray">
                  <Clock3 size={12} /> {pick(service.timeline_en, service.timeline_fa)}
                </span>
              )}
            </div>

            <div className="mt-7">
              <h2 className="text-[1.4rem]">{t('service.overview')}</h2>
              <div className="mt-4">
                <Markdown content={description} />
              </div>
            </div>

            {benefits.length > 0 && (
              <div className="mt-10 rounded-xl border border-line bg-white p-6">
                <h2 className="text-[1.15rem]">
                  {locale === 'fa' ? 'مزیت‌های این خدمت' : 'What this service gives you'}
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex gap-2.5 text-[0.8rem] leading-6 text-[#435a72]">
                      <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#e8f7ef] text-[#1c8353]">
                        <Check size={10} strokeWidth={3} />
                      </span>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 grid gap-10 md:grid-cols-2">
              <div>
                <h2 className="flex items-center gap-2 text-[1.25rem]">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-100 text-blue">
                    <Check size={16} />
                  </span>
                  {t('service.eligibility')}
                </h2>
                <ul className="pathway-list mt-5">
                  {eligibility.map((item) => (
                    <li key={item}>
                      <span className="bullet">
                        <Check size={11} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="flex items-center gap-2 text-[1.25rem]">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-100 text-blue">
                    <FileText size={15} />
                  </span>
                  {t('service.documents')}
                </h2>
                <ul className="pathway-list mt-5">
                  {documents.map((item) => (
                    <li key={item}>
                      <span className="bullet">
                        <FileText size={10} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-[1.3rem]">{t('service.process')}</h2>
              <ol className="numbered-list mt-6">
                {process.map((step, index) => (
                  <li key={step}>
                    <strong>{locale === 'fa' ? `گام ${index + 1}` : `Step ${index + 1}`}</strong>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="notice notice-blue mt-12 flex gap-3">
              <Info size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">{t('service.considerations')}</p>
                <ul className="mt-2 list-disc space-y-1 ps-4">
                  <li>{t('service.consideration1')}</li>
                  <li>{t('service.consideration2')}</li>
                  <li>{t('service.consideration3')}</li>
                </ul>
              </div>
            </div>

            {faqs.length > 0 && (
              <div className="mt-12">
                <h2 className="text-[1.3rem]">{t('service.faq')}</h2>
                <div className="card mt-4 px-6">
                  <FaqAccordion
                    items={faqs.map((faq, index) => ({
                      id: index + 1,
                      category: 'general' as const,
                      question_en: faq.q,
                      question_fa: faq.q,
                      answer_en: faq.a,
                      answer_fa: faq.a,
                      published: true,
                      sort_order: index,
                      created_at: '',
                      updated_at: '',
                    }))}
                  />
                </div>
              </div>
            )}
          </div>

          <aside className="detail-sidebar">
            <div className="rounded-[16px] bg-navy p-6 text-white shadow-lift">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-orange text-navy">
                <MessageSquareText size={19} />
              </div>
              <h2 className="mt-5 font-display text-[1.2rem] font-bold text-white">{t('service.sidebarTitle')}</h2>
              <p className="mt-2 text-[0.77rem] leading-7 text-white/60">{t('service.sidebarBody')}</p>
              <LocalLink
                to={`/consultation?service=${encodeURIComponent(service.slug)}`}
                className="btn btn-primary mt-5 w-full"
              >
                {t('cta.talk')}
                <ArrowRight size={14} className="rtl:rotate-180" />
              </LocalLink>
              <div className="mt-4 flex items-start gap-2 border-t border-white/10 pt-4 text-[0.65rem] leading-5 text-white/40">
                <ShieldCheck size={13} className="mt-0.5 shrink-0 text-orange/70" />
                {locale === 'fa'
                  ? 'بدون پرداخت خودکار. ابتدا گزینه‌ها را بررسی می‌کنیم.'
                  : 'No automatic charge. We review the options first.'}
              </div>
            </div>

            {related.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-[0.9rem]">{t('service.related')}</h3>
                <div className="grid gap-2">
                  {related.map((item) => (
                    <LocalLink
                      key={item.id}
                      to={`/services/${item.slug}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-line bg-white px-4 py-3 text-[0.78rem] font-medium text-[#40566c] transition hover:border-[#bfd1e2] hover:text-navy"
                    >
                      {pick(item.title_en, item.title_fa)}
                      <ArrowRight size={13} className="shrink-0 text-[#a7b6c5] rtl:rotate-180" />
                    </LocalLink>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section bg-sky-50">
          <div className="shell">
            <h2 className="section-title">{t('service.related')}</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ServiceCard service={item} key={item.id} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title={t('services.ctaTitle')}
        body={t('services.ctaBody')}
        ctaTo={`/consultation?service=${encodeURIComponent(service.slug)}`}
      />
    </>
  );
}
