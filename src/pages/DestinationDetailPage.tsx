import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Check,
  FileText,
  GraduationCap,
  HeartHandshake,
  Info,
  Landmark,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { publicApi } from '@/lib/api';
import { LocalLink, useLocale } from '@/lib/i18n';
import { usePageMeta } from '@/lib/seo';
import { PageHero } from '@/components/PageHero';
import { ArticleCard, ServiceCard } from '@/components/Cards';
import { CtaBand } from '@/components/CtaBand';
import { usePublicSite } from '@/components/PublicLayout';

const pathwayTabs = [
  { key: 'study', icon: GraduationCap, en: 'Study pathways', fa: 'مسیرهای تحصیل' },
  { key: 'work', icon: BriefcaseBusiness, en: 'Work pathways', fa: 'مسیرهای کار' },
  { key: 'pr', icon: HomeIcon, en: 'Permanent residency', fa: 'اقامت دائمی' },
  { key: 'family', icon: Users, en: 'Family options', fa: 'گزینه‌های خانوادگی' },
  { key: 'investment', icon: Building2, en: 'Business & investment', fa: 'کسب‌وکار و سرمایه‌گذاری' },
] as const;

function HomeIcon(props: { size?: number; className?: string; strokeWidth?: number }) {
  return <Landmark {...props} />;
}

export function DestinationDetailPage() {
  const { slug = '' } = useParams();
  const { t, locale, formatNumber } = useLocale();
  const site = usePublicSite();
  const [tab, setTab] = useState('study');

  const query = useQuery({
    queryKey: ['destination', slug],
    queryFn: () => publicApi.destination(slug),
    enabled: Boolean(slug),
  });
  const destination = query.data?.destination;
  const name = destination ? (locale === 'fa' ? destination.name_fa : destination.name_en) : '';
  const tagline = destination ? (locale === 'fa' ? destination.tagline_fa : destination.tagline_en) : '';

  usePageMeta({
    title: destination
      ? `${name} — ${locale === 'fa' ? 'مقصد مهاجرتی' : 'Immigration destination'}`
      : t('common.loading'),
    description: destination
      ? (locale === 'fa' ? destination.seo_description_fa : destination.seo_description_en) ||
        (locale === 'fa' ? destination.overview_fa : destination.overview_en).slice(0, 160)
      : '',
    image: destination?.image,
    jsonLd: destination
      ? {
          '@context': 'https://schema.org',
          '@type': 'Country',
          name,
          description: locale === 'fa' ? destination.overview_fa : destination.overview_en,
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
  if (query.isError || !destination) {
    return (
      <div className="shell py-28 text-center">
        <h1 className="text-2xl">{t('common.error')}</h1>
        <p className="mt-3 text-sm text-muted">{t('common.errorBody')}</p>
        <LocalLink to="/destinations" className="btn btn-dark mt-6">
          {t('nav.destinations')}
        </LocalLink>
      </div>
    );
  }

  const arrays = {
    study: locale === 'fa' ? destination.study_pathways_fa : destination.study_pathways_en,
    work: locale === 'fa' ? destination.work_pathways_fa : destination.work_pathways_en,
    pr: locale === 'fa' ? destination.pr_pathways_fa : destination.pr_pathways_en,
    family: locale === 'fa' ? destination.family_pathways_fa : destination.family_pathways_en,
    investment: locale === 'fa' ? destination.investment_pathways_fa : destination.investment_pathways_en,
  };
  const availableTabs = pathwayTabs.filter((item) => arrays[item.key].length > 0);
  const activeTab = availableTabs.some((item) => item.key === tab) ? tab : (availableTabs[0]?.key ?? 'study');
  const overview = locale === 'fa' ? destination.overview_fa : destination.overview_en;
  const education = locale === 'fa' ? destination.education_fa : destination.education_en;
  const universities = locale === 'fa' ? destination.universities_fa : destination.universities_en;
  const eligibility = locale === 'fa' ? destination.eligibility_fa : destination.eligibility_en;
  const documents = locale === 'fa' ? destination.documents_fa : destination.documents_en;
  const process = locale === 'fa' ? destination.process_fa : destination.process_en;
  const highlights = locale === 'fa' ? destination.highlights_fa : destination.highlights_en;

  return (
    <>
      <PageHero
        eyebrow={destination.country_code}
        title={name}
        intro={tagline}
        image={destination.image || '/images/hero-city.jpg'}
        breadcrumbs={[
          { label: t('nav.destinations'), to: '/destinations' },
          { label: name },
        ]}
      />

      <section className="section">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              {highlights.map((highlight) => (
                <span className="tag" key={highlight}>
                  <Check size={11} /> {highlight}
                </span>
              ))}
            </div>

            <div className="mt-7">
              <h2 className="text-[1.4rem]">{t('destination.overview')}</h2>
              <p className="mt-4 whitespace-pre-line text-[0.9rem] leading-8 text-[#435a72]">{overview}</p>
            </div>

            <div className="mt-10 rounded-xl border border-line bg-white p-6">
              <h2 className="flex items-center gap-2 text-[1.2rem]">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-100 text-blue">
                  <BookOpen size={15} />
                </span>
                {t('destination.education')}
              </h2>
              <p className="mt-4 text-[0.86rem] leading-8 text-[#435a72]">{education}</p>
              {universities.length > 0 && (
                <>
                  <h3 className="mt-6 text-[0.93rem]">{t('destination.universities')}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {universities.map((university) => (
                      <span className="rounded-lg border border-line bg-[#fafcff] px-3 py-2 text-[0.72rem] text-[#48617a]" key={university}>
                        {university}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="mt-10">
              <h2 className="text-[1.35rem]">{t('destination.pathways')}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {availableTabs.map((item) => (
                  <button
                    type="button"
                    className={`chip ${activeTab === item.key ? 'chip-active' : ''}`}
                    onClick={() => setTab(item.key)}
                    key={item.key}
                  >
                    <item.icon size={13} />
                    {locale === 'fa' ? item.fa : item.en}
                  </button>
                ))}
              </div>
              <div className="card mt-4 p-6">
                {availableTabs.map((item) =>
                  item.key === activeTab ? (
                    <div key={item.key}>
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-sky-100 text-blue">
                          <item.icon size={17} />
                        </span>
                        <h3 className="text-[1rem]">{locale === 'fa' ? item.fa : item.en}</h3>
                      </div>
                      <ul className="pathway-list mt-5">
                        {arrays[item.key].map((pathway) => (
                          <li key={pathway}>
                            <span className="bullet">
                              <Check size={11} />
                            </span>
                            <span>{pathway}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null,
                )}
              </div>
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="flex items-center gap-2 text-[1.2rem]">
                  <ShieldCheck size={18} className="text-blue" />
                  {t('destination.eligibility')}
                </h2>
                <ul className="pathway-list mt-4">
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
                <h2 className="flex items-center gap-2 text-[1.2rem]">
                  <FileText size={17} className="text-blue" />
                  {t('destination.documents')}
                </h2>
                <ul className="pathway-list mt-4">
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

            <div className="mt-10">
              <h2 className="text-[1.25rem]">{t('destination.process')}</h2>
              <ol className="numbered-list mt-5">
                {process.map((step, index) => (
                  <li key={step}>
                    <strong>{locale === 'fa' ? `مرحله ${index + 1}` : `Stage ${index + 1}`}</strong>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="notice mt-10 flex gap-3">
              <Info size={17} className="mt-0.5 shrink-0" />
              <span>{locale === 'fa' ? site.settings.legalNotice_fa : site.settings.legalNotice}</span>
            </div>
          </div>

          <aside className="detail-sidebar">
            <div className="card overflow-hidden">
              <div className="relative h-36">
                <img className="h-full w-full object-cover" src={destination.image || ''} alt="" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/75 to-transparent" />
                <div className="absolute bottom-3 start-4 flex items-center gap-2 text-white">
                  <span className="flag-badge">
                    <img src={destination.flag || ''} alt="" width="30" height="20" />
                  </span>
                  <span className="font-display text-sm font-semibold">{name}</span>
                </div>
              </div>
              <div className="p-5">
                <h2 className="text-[0.95rem]">{t('destination.quickFacts')}</h2>
                <dl className="mt-4 space-y-3 text-[0.73rem]">
                  <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
                    <dt className="text-muted">{locale === 'fa' ? 'کد کشور' : 'Country code'}</dt>
                    <dd className="font-semibold text-navy">{destination.country_code}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
                    <dt className="text-muted">{t('destinations.filterStudy')}</dt>
                    <dd className="font-semibold text-navy">{formatNumber(arrays.study.length)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
                    <dt className="text-muted">{t('destinations.filterWork')}</dt>
                    <dd className="font-semibold text-navy">{formatNumber(arrays.work.length)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted">{t('destinations.filterPr')}</dt>
                    <dd className="font-semibold text-navy">{formatNumber(arrays.pr.length)}</dd>
                  </div>
                </dl>
                <LocalLink
                  to={`/consultation?destination=${encodeURIComponent(destination.slug)}`}
                  className="btn btn-primary mt-5 w-full"
                >
                  {t('cta.free')} <ArrowRight size={14} className="rtl:rotate-180" />
                </LocalLink>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[0.62rem] text-muted">
                  <MapPin size={11} /> {locale === 'fa' ? 'تأیید شرایط با منابع رسمی' : 'Verify against official sources'}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-line bg-sky-50 p-5">
              <HeartHandshake size={18} className="text-orange-dark" />
              <p className="mt-3 text-[0.82rem] font-semibold leading-6 text-navy">
                {locale === 'fa' ? 'برنامه‌ای متناسب با خانواده شما' : 'A plan that includes your family'}
              </p>
              <p className="mt-2 text-[0.7rem] leading-6 text-muted">
                {locale === 'fa'
                  ? 'همسر و فرزندان، بودجه و زمان‌بندی را از همان ابتدا در نظر می‌گیریم.'
                  : 'We consider partners, children, budget and timing from the first conversation.'}
              </p>
            </div>
          </aside>
        </div>
      </section>

      {query.data?.relatedServices && query.data.relatedServices.length > 0 && (
        <section className="section bg-sky-50">
          <div className="shell">
            <h2 className="section-title">{t('destination.relatedServices')}</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {query.data.relatedServices.map((service) => (
                <ServiceCard service={service} key={service.id} />
              ))}
            </div>
          </div>
        </section>
      )}

      {query.data?.relatedArticles && query.data.relatedArticles.length > 0 && (
        <section className="section">
          <div className="shell">
            <h2 className="section-title">{t('destination.relatedArticles')}</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {query.data.relatedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title={t('destination.ctaTitle')}
        body={t('destination.ctaBody')}
        ctaTo={`/consultation?destination=${encodeURIComponent(destination.slug)}`}
      />
    </>
  );
}
