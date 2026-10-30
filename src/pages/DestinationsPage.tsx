import { useMemo, useState } from 'react';
import { Compass, Search } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import { usePageMeta } from '@/lib/seo';
import { usePublicSite } from '@/components/PublicLayout';
import { PageHero } from '@/components/PageHero';
import { DestinationCard } from '@/components/Cards';
import { EmptyState } from '@/components/EmptyState';
import { CtaBand } from '@/components/CtaBand';

const filterKeys = ['study', 'work', 'pr', 'family', 'investment'] as const;
const filterLabels = {
  study: 'destinations.filterStudy',
  work: 'destinations.filterWork',
  pr: 'destinations.filterPr',
  family: 'destinations.filterFamily',
  investment: 'destinations.filterInvestment',
} as const;

export function DestinationsPage() {
  const site = usePublicSite();
  const { t, locale } = useLocale();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  usePageMeta({
    title: locale === 'fa' ? 'کشورهای مقصد' : 'Immigration Destinations',
    description: t('destinations.intro'),
    image: site.destinations[0]?.image,
  });

  const filtered = useMemo(() => {
    return site.destinations.filter((destination) => {
      const name = locale === 'fa' ? destination.name_fa : destination.name_en;
      const tagline = locale === 'fa' ? destination.tagline_fa : destination.tagline_en;
      const matchesSearch = !search || `${name} ${tagline}`.toLowerCase().includes(search.toLowerCase());
      const pathwayMap: Record<string, string[]> = {
        study: locale === 'fa' ? destination.study_pathways_fa : destination.study_pathways_en,
        work: locale === 'fa' ? destination.work_pathways_fa : destination.work_pathways_en,
        pr: locale === 'fa' ? destination.pr_pathways_fa : destination.pr_pathways_en,
        family: locale === 'fa' ? destination.family_pathways_fa : destination.family_pathways_en,
        investment: locale === 'fa' ? destination.investment_pathways_fa : destination.investment_pathways_en,
      };
      return matchesSearch && (filter === 'all' || (pathwayMap[filter]?.length || 0) > 0);
    });
  }, [site.destinations, search, filter, locale]);

  return (
    <>
      <PageHero
        eyebrow={t('destinations.eyebrow')}
        title={t('destinations.title')}
        intro={t('destinations.intro')}
        image={site.destinations[0]?.image || '/images/hero-city.jpg'}
        breadcrumbs={[{ label: t('nav.destinations') }]}
      />

      <section className="section">
        <div className="shell">
          <div className="mb-8 rounded-xl border border-line bg-white p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <label className="relative block w-full lg:w-80">
                <span className="sr-only">{t('destinations.search')}</span>
                <Search size={15} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[#8fa1b5]" />
                <input
                  className="input !ps-9"
                  placeholder={t('destinations.search')}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <button type="button" className={`chip ${filter === 'all' ? 'chip-active' : ''}`} onClick={() => setFilter('all')} aria-pressed={filter === 'all'}>
                  {t('common.all')}
                </button>
                {filterKeys.map((key) => (
                  <button
                    type="button"
                    key={key}
                    className={`chip ${filter === key ? 'chip-active' : ''}`}
                    onClick={() => setFilter(key)}
                    aria-pressed={filter === key}
                  >
                    {t(filterLabels[key])}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-5 flex items-center gap-2 text-[0.7rem] text-muted">
            <Compass size={14} className="text-orange-dark" />
            {locale === 'fa'
              ? `${filtered.length} مقصد از ${site.destinations.length}`
              : `${filtered.length} of ${site.destinations.length} destinations`}
          </div>

          {filtered.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          ) : (
            <EmptyState title={t('common.noResults')} body={t('common.noResultsBody')} />
          )}

          <div className="notice mt-10">
            {locale === 'fa' ? site.settings.legalNotice_fa : site.settings.legalNotice}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
