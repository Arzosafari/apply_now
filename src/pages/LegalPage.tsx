import { useQuery } from '@tanstack/react-query';
import { Info, ShieldCheck } from 'lucide-react';
import { publicApi } from '@/lib/api';
import { useLocale } from '@/lib/i18n';
import { usePageMeta } from '@/lib/seo';
import { PageHero } from '@/components/PageHero';
import { Markdown } from '@/components/Markdown';
import { usePublicSite } from '@/components/PublicLayout';

export function LegalPage({ slug }: { slug: 'privacy-policy' | 'terms-and-conditions' }) {
  const site = usePublicSite();
  const { t, locale, formatDate } = useLocale();
  const query = useQuery({
    queryKey: ['legal', slug],
    queryFn: () => publicApi.legal(slug),
  });
  const page = query.data?.page;
  const title = page ? (locale === 'fa' ? page.title_fa : page.title_en) : t('common.loading');

  usePageMeta({
    title,
    description: `${title} — ${site.settings.brand.name}`,
    image: '/images/office.jpg',
    noindex: false,
  });

  if (query.isLoading) return <div className="shell max-w-4xl py-24"><div className="skeleton h-96 w-full" /></div>;
  if (query.isError || !page) {
    return <div className="shell py-24 text-center"><h1>{t('common.error')}</h1></div>;
  }

  return (
    <>
      <PageHero
        eyebrow={locale === 'fa' ? 'حقوقی' : 'Legal'}
        title={title}
        intro={locale === 'fa' ? 'شرایط استفاده و نحوه رسیدگی به اطلاعات شما.' : 'How we handle your information and the terms of using this service.'}
        image="/images/office.jpg"
        breadcrumbs={[{ label: title }]}
      />
      <section className="section">
        <div className="shell max-w-4xl">
          <div className="notice mb-7 flex gap-2.5">
            <Info size={16} className="mt-0.5 shrink-0" />
            <span>{t('legal.reviewNote')}</span>
          </div>
          <div className="card p-7 md:p-10">
            <div className="mb-7 flex items-center justify-between gap-4 border-b border-line pb-5">
              <div className="flex items-center gap-2 text-[0.72rem] text-muted">
                <ShieldCheck size={15} className="text-blue" />
                {t('legal.updated')}: {formatDate(page.updated_at)}
              </div>
              <span className="tag">{site.settings.brand.legalName}</span>
            </div>
            <Markdown content={locale === 'fa' ? page.body_fa : page.body_en} />
          </div>
        </div>
      </section>
    </>
  );
}
