import { useMemo, useState } from 'react';
import { ArrowRight, HelpCircle, Search } from 'lucide-react';
import type { TranslationKey } from '@/lib/i18n';
import { LocalLink, useLocale } from '@/lib/i18n';
import { usePageMeta } from '@/lib/seo';
import { usePublicSite } from '@/components/PublicLayout';
import { PageHero } from '@/components/PageHero';
import { FaqAccordion } from '@/components/FaqAccordion';
import { EmptyState } from '@/components/EmptyState';
import { CtaBand } from '@/components/CtaBand';

const categories = [
  'general',
  'study',
  'student-visa',
  'work-visa',
  'immigration',
  'pricing',
  'payments',
] as const;

export function FaqPage() {
  const site = usePublicSite();
  const { t, locale } = useLocale();
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  usePageMeta({
    title: locale === 'fa' ? 'پرسش‌های متداول' : 'Frequently Asked Questions',
    description: t('faq.intro'),
    image: '/images/consultation.jpg',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: site.faqs.slice(0, 8).map((faq) => ({
        '@type': 'Question',
        name: locale === 'fa' ? faq.question_fa : faq.question_en,
        acceptedAnswer: {
          '@type': 'Answer',
          text: locale === 'fa' ? faq.answer_fa : faq.answer_en,
        },
      })),
    },
  });

  const filtered = useMemo(() => {
    return site.faqs.filter((faq) => {
      const haystack = `${faq.question_en} ${faq.question_fa} ${faq.answer_en} ${faq.answer_fa}`.toLowerCase();
      return (
        (category === 'all' || faq.category === category) &&
        (!search || haystack.includes(search.toLowerCase()))
      );
    });
  }, [site.faqs, category, search]);

  return (
    <>
      <PageHero
        eyebrow={t('faq.eyebrow')}
        title={t('faq.title')}
        intro={t('faq.intro')}
        image="/images/consultation.jpg"
        breadcrumbs={[{ label: t('nav.faq') }]}
      />

      <section className="section">
        <div className="shell grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside>
            <div className="detail-sidebar">
              <label className="relative block">
                <span className="sr-only">{t('faq.search')}</span>
                <Search size={15} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[#8fa1b5]" />
                <input
                  className="input !ps-9"
                  placeholder={t('faq.search')}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <div className="mt-4 grid gap-1.5">
                <button
                  type="button"
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-start text-[0.77rem] transition ${
                    category === 'all' ? 'bg-navy text-white' : 'text-[#526980] hover:bg-white'
                  }`}
                  onClick={() => setCategory('all')}
                >
                  {t('common.all')}
                  <span className="text-[0.65rem] opacity-60">{site.faqs.length}</span>
                </button>
                {categories.map((item) => {
                  const count = site.faqs.filter((faq) => faq.category === item).length;
                  return (
                    <button
                      type="button"
                      key={item}
                      className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-start text-[0.77rem] transition ${
                        category === item ? 'bg-navy text-white' : 'text-[#526980] hover:bg-white'
                      }`}
                      onClick={() => setCategory(item)}
                    >
                      {t(`faq.${item}` as TranslationKey)}
                      <span className="text-[0.65rem] opacity-60">{count}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 rounded-xl bg-navy p-5 text-white">
                <HelpCircle size={19} className="text-orange" />
                <h2 className="mt-3 font-display text-[0.95rem] font-bold text-white">{t('faq.ctaTitle')}</h2>
                <p className="mt-2 text-[0.7rem] leading-6 text-white/55">{t('faq.ctaBody')}</p>
                <LocalLink to="/contact" className="mt-4 inline-flex items-center gap-1.5 text-[0.72rem] font-semibold text-orange">
                  {t('nav.contact')} <ArrowRight size={12} className="rtl:rotate-180" />
                </LocalLink>
              </div>
            </div>
          </aside>

          <div className="card self-start px-6 md:px-8">
            {filtered.length > 0 ? (
              <FaqAccordion items={filtered} />
            ) : (
              <div className="py-10">
                <EmptyState title={t('faq.noResults')} />
              </div>
            )}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
