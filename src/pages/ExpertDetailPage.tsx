import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, Languages, Linkedin } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { publicApi } from '@/lib/api';
import { LocalLink, useLocale } from '@/lib/i18n';
import { usePageMeta } from '@/lib/seo';
import { PageHero } from '@/components/PageHero';
import { usePublicSite } from '@/components/PublicLayout';
import { CtaBand } from '@/components/CtaBand';

export function ExpertDetailPage() {
  const { slug = '' } = useParams();
  const site = usePublicSite();
  const { t, locale } = useLocale();
  const query = useQuery({
    queryKey: ['expert', slug],
    queryFn: () => publicApi.expert(slug),
    enabled: Boolean(slug),
  });
  const expert = query.data?.expert;
  const name = expert ? (locale === 'fa' ? expert.name_fa || expert.name : expert.name) : '';
  const role = expert ? (locale === 'fa' ? expert.role_fa : expert.role_en) : '';
  const bio = expert ? (locale === 'fa' ? expert.bio_fa : expert.bio_en) : '';

  usePageMeta({
    title: expert ? `${name} — ${role}` : t('common.loading'),
    description: expert ? (locale === 'fa' ? expert.expertise_fa : expert.expertise_en) : '',
    image: expert?.photo,
    type: 'profile',
  });

  if (query.isLoading) return <div className="shell py-24"><div className="skeleton h-96 w-full" /></div>;
  if (query.isError || !expert) {
    return (
      <div className="shell py-28 text-center">
        <h1>{t('common.error')}</h1>
        <LocalLink to="/experts" className="btn btn-dark mt-5">{t('nav.experts')}</LocalLink>
      </div>
    );
  }

  return (
    <>
      <PageHero
        eyebrow={role}
        title={name}
        intro={locale === 'fa' ? expert.expertise_fa : expert.expertise_en}
        image="/images/team.jpg"
        breadcrumbs={[{ label: t('nav.experts'), to: '/experts' }, { label: name }]}
      />
      <section className="section">
        <div className="shell grid gap-10 md:grid-cols-[0.7fr_1.3fr]">
          <div>
            <div className="overflow-hidden rounded-[18px] border border-line bg-white">
              {expert.photo ? <img className="aspect-[4/4.6] w-full object-cover object-top" src={expert.photo} alt={name} width="600" height="700" /> : <div className="grid aspect-[4/4.6] place-items-center bg-sky-50 text-5xl font-bold text-blue" aria-hidden="true">{name.slice(0, 1)}</div>}
            </div>
            {expert.is_demo && (
              <p className="notice mt-4 text-center text-[0.68rem]">{t('experts.demo')}</p>
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="tag">{role}</span>
              {expert.is_demo && <span className="tag tag-orange">{t('common.demo')}</span>}
            </div>
            <h2 className="mt-5 font-display text-3xl font-bold text-navy">{name}</h2>
            <p className="mt-2 text-[0.88rem] text-muted">{locale === 'fa' ? expert.expertise_fa : expert.expertise_en}</p>
            <div className="prose-body mt-7 whitespace-pre-line">{bio}</div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="info-panel">
                <h2 className="info-panel-title">
                  <Languages size={15} /> {t('experts.languages')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(locale === 'fa' ? expert.languages_fa : expert.languages_en).map((language) => (
                    <span className="tag" key={language}>{language}</span>
                  ))}
                </div>
              </div>
              <div className="info-panel">
                <h2 className="info-panel-title">{t('experts.expertise')}</h2>
                <p className="text-[0.78rem] leading-7 text-muted">
                  {locale === 'fa' ? expert.expertise_fa : expert.expertise_en}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <LocalLink to="/consultation" className="btn btn-primary">
                {t('cta.book')} <ArrowRight size={14} className="rtl:rotate-180" />
              </LocalLink>
              {expert.linkedin_url && (
                <a href={expert.linkedin_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  <Linkedin size={15} /> LinkedIn
                </a>
              )}
              <LocalLink to="/experts" className="btn btn-outline">
                <ArrowLeft size={14} className="rtl:rotate-180" /> {t('nav.experts')}
              </LocalLink>
            </div>
          </div>
        </div>
      </section>
      <CtaBand image={site.settings.seo.ogImage} />
    </>
  );
}
