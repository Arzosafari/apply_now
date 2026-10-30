import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { publicApi } from '@/lib/api';
import { LocalLink, useLocale } from '@/lib/i18n';
import { usePageMeta } from '@/lib/seo';
import { usePublicSite } from '@/components/PublicLayout';
import { PageHero } from '@/components/PageHero';
import { ArticleCard } from '@/components/Cards';
import { EmptyState } from '@/components/EmptyState';
import { CtaBand } from '@/components/CtaBand';

export function BlogPage() {
  const site = usePublicSite();
  const { t, locale, formatNumber } = useLocale();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  const query = useQuery({
    queryKey: ['articles', search, category, page],
    queryFn: () => publicApi.articles({ search, category, page, pageSize: 6 }),
  });

  usePageMeta({
    title: locale === 'fa' ? 'وبلاگ و مقالات' : 'Blog & Articles',
    description: t('blog.intro'),
    image: '/images/blog-4.jpg',
  });

  const articles = query.data?.items || [];
  const totalPages = Math.max(1, Math.ceil((query.data?.total || 0) / 6));
  const showFeatured = page === 1 && !search && !category && articles.length > 0;

  return (
    <>
      <PageHero
        eyebrow={t('blog.eyebrow')}
        title={t('blog.title')}
        intro={t('blog.intro')}
        image="/images/blog-4.jpg"
        breadcrumbs={[{ label: t('nav.blog') }]}
      />

      <section className="section">
        <div className="shell">
          <div className="mb-8 flex flex-col gap-4 rounded-xl border border-line bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full gap-2 overflow-x-auto pb-1 lg:w-auto lg:flex-1">
              <button type="button" className={`chip shrink-0 ${!category ? 'chip-active' : ''}`} onClick={() => setCategory('')} aria-pressed={!category}>
                {t('blog.allCategories')}
              </button>
              {site.categories.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setCategory(item.slug)}
                  aria-pressed={category === item.slug}
                  className={`chip shrink-0 ${category === item.slug ? 'chip-active' : ''}`}
                >
                  {locale === 'fa' ? item.name_fa : item.name_en}
                </button>
              ))}
            </div>
            <label className="relative block w-full lg:w-64">
              <span className="sr-only">{t('blog.search')}</span>
              <Search size={15} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[#8fa1b5]" />
              <input
                className="input !ps-9"
                placeholder={t('blog.search')}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>

          {query.isLoading ? (
            <div className="grid gap-5 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div className="card overflow-hidden" key={index}>
                  <div className="skeleton aspect-[16/10] rounded-none" />
                  <div className="p-5">
                    <div className="skeleton h-3 w-1/3" />
                    <div className="skeleton mt-3 h-5 w-full" />
                    <div className="skeleton mt-2 h-5 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <EmptyState title={t('blog.noArticles')} body={t('common.noResultsBody')} />
          ) : (
            <>
              {showFeatured && (
                <div className="mb-8">
                  <div className="grid overflow-hidden rounded-[18px] border border-line bg-white md:grid-cols-[1.1fr_0.9fr]">
                    <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[340px]">
                      <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src={articles[0].image || '/images/blog-1.jpg'}
                        alt={locale === 'fa' ? articles[0].title_fa : articles[0].title_en}
                        width="900"
                        height="600"
                      />
                      <span className="absolute start-4 top-4 rounded-md bg-white/95 px-2.5 py-1.5 text-[0.63rem] font-bold text-navy">
                        {t('blog.featured')}
                      </span>
                    </div>
                    <div className="flex flex-col justify-center p-7 md:p-10">
                      <div className="article-meta">
                        <span>{locale === 'fa' ? articles[0].category_name_fa : articles[0].category_name_en}</span>
                        <span className="h-1 w-1 rounded-full bg-[#c0ccd8]" />
                        <span>{t('common.readingTime', { count: articles[0].reading_minutes })}</span>
                      </div>
                      <h2 className="mt-3 font-display text-[clamp(1.45rem,2.7vw,2.1rem)] font-bold leading-[1.2] text-navy">
                        {locale === 'fa' ? articles[0].title_fa : articles[0].title_en}
                      </h2>
                      <p className="mt-4 text-[0.83rem] leading-7 text-muted">
                        {locale === 'fa' ? articles[0].excerpt_fa : articles[0].excerpt_en}
                      </p>
                      <LocalLink to={`/blog/${articles[0].slug}`} className="btn btn-primary mt-6 self-start">
                        {t('cta.readMore')} <ArrowRight size={14} className="rtl:rotate-180" />
                      </LocalLink>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {(showFeatured ? articles.slice(1) : articles).map((article) => (
                  <ArticleCard article={article} key={article.id} />
                ))}
                {(showFeatured ? articles.slice(1) : articles).length % 3 === 2 && (
                  <div className="promo-card min-h-[330px]">
                    <div>
                      <span className="text-[0.62rem] font-bold uppercase tracking-[0.13em] text-orange">
                        {t('home.insightsEyebrow')}
                      </span>
                      <h3 className="mt-3">{t('home.faqTitle')}</h3>
                      <p>{t('faq.ctaBody')}</p>
                    </div>
                    <LocalLink to="/faq" className="mt-5 inline-flex items-center gap-2 self-start text-[0.76rem] font-semibold text-orange">
                      {t('home.faqMore')} <ArrowRight size={13} className="rtl:rotate-180" />
                    </LocalLink>
                  </div>
                )}
              </div>

              <div className="mt-10 flex items-center justify-between gap-3">
                <p className="text-[0.7rem] text-muted">
                  {t('common.page')} {formatNumber(page)} / {formatNumber(totalPages)}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    disabled={page <= 1}
                    onClick={() => {
                      setPage((current) => Math.max(1, current - 1));
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                  >
                    <ChevronLeft size={14} className="rtl:rotate-180" /> {t('common.previous')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    disabled={page >= totalPages}
                    onClick={() => {
                      setPage((current) => Math.min(totalPages, current + 1));
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                  >
                    {t('common.next')} <ChevronRight size={14} className="rtl:rotate-180" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
