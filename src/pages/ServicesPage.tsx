import { useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { LocalLink, useLocale } from '@/lib/i18n';
import { usePageMeta } from '@/lib/seo';
import { usePublicSite } from '@/components/PublicLayout';
import { PageHero } from '@/components/PageHero';
import { ServiceCard } from '@/components/Cards';
import { SectionHead } from '@/components/SectionHead';
import { CtaBand } from '@/components/CtaBand';
import { EmptyState } from '@/components/EmptyState';

export function ServicesPage() {
  const site = usePublicSite();
  const { t, locale } = useLocale();
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  usePageMeta({
    title: locale === 'fa' ? 'خدمات مهاجرت و تحصیل' : 'Immigration & Study Abroad Services',
    description: t('services.intro'),
    image: '/images/consultation.jpg',
  });

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    for (const service of site.services) {
      map.set(service.category_en, locale === 'fa' ? service.category_fa : service.category_en);
    }
    return [...map.entries()];
  }, [site.services, locale]);

  const filtered = site.services.filter((service) => {
    const matchesCategory =
      category === 'all' ||
      service.category_en === category ||
      service.category_fa === category;
    const haystack = `${service.title_en} ${service.title_fa} ${service.short_en} ${service.short_fa}`.toLowerCase();
    return matchesCategory && (!search || haystack.includes(search.toLowerCase()));
  });

  return (
    <>
      <PageHero
        eyebrow={t('services.eyebrow')}
        title={t('services.title')}
        intro={t('services.intro')}
        image="/images/consultation.jpg"
        breadcrumbs={[{ label: t('nav.services') }]}
      />

      <section className="section">
        <div className="shell">
          <div className="mb-8 flex flex-col gap-4 rounded-xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategory('all')}
                aria-pressed={category === 'all'}
                className={`chip ${category === 'all' ? 'chip-active' : ''}`}
              >
                {t('services.all')}
              </button>
              {categories.map(([key, label]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setCategory(key)}
                  aria-pressed={category === key}
                  className={`chip ${category === key ? 'chip-active' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="relative block w-full sm:w-64">
              <span className="sr-only">{t('common.search')}</span>
              <Search size={15} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[#8fa1b5]" />
              <input
                className="input !ps-9"
                placeholder={t('common.searchPlaceholder')}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>

          {filtered.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
              {filtered.length % 3 === 1 && (
                <div className="promo-card min-h-[250px] sm:col-span-2">
                  <div>
                    <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-orange">
                      {t('services.eyebrow')}
                    </span>
                    <h3 className="mt-3">{t('services.ctaTitle')}</h3>
                    <p>{t('services.ctaBody')}</p>
                  </div>
                  <LocalLink to="/consultation" className="mt-5 inline-flex items-center gap-2 self-start text-[0.76rem] font-semibold text-orange">
                    {t('cta.free')} <ArrowRight size={13} className="rtl:rotate-180" />
                  </LocalLink>
                </div>
              )}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>

      <section className="bg-sky-50 py-16">
        <div className="shell">
          <SectionHead
            eyebrow={t('home.processEyebrow')}
            title={t('home.processTitle')}
            intro={t('home.processIntro')}
          />
          <div className="grid gap-5 md:grid-cols-4">
            {[1, 2, 3, 4].map((step) => (
              <div className="card p-5" key={step}>
                <span className="font-display text-2xl font-bold text-[#d2dfec]">0{step}</span>
                <h3 className="mt-3 text-sm">{t(`home.process${step}Title` as never)}</h3>
                <p className="mt-2 text-[0.75rem] leading-6 text-muted">{t(`home.process${step}Body` as never)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
