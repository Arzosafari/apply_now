import { ArrowRight, Compass, Handshake, MessageCircle, Scale, ShieldCheck, Target } from 'lucide-react';
import { LocalLink, useLocale } from '@/lib/i18n';
import { usePageMeta } from '@/lib/seo';
import { usePublicSite } from '@/components/PublicLayout';
import { PageHero } from '@/components/PageHero';
import { ExpertCard } from '@/components/Cards';
import { CtaBand } from '@/components/CtaBand';
import { Reveal } from '@/components/Reveal';

const values = [
  { icon: Scale, title: 'about.value1', body: 'about.value1Body' },
  { icon: ShieldCheck, title: 'about.value2', body: 'about.value2Body' },
  { icon: MessageCircle, title: 'about.value3', body: 'about.value3Body' },
  { icon: Handshake, title: 'about.value4', body: 'about.value4Body' },
] as const;

export function AboutPage() {
  const site = usePublicSite();
  const { t, locale } = useLocale();
  usePageMeta({
    title: locale === 'fa' ? 'درباره FaraTech' : 'About FaraTech',
    description: t('about.intro'),
    image: '/images/office.jpg',
  });

  return (
    <>
      <PageHero
        eyebrow={t('about.eyebrow')}
        title={t('about.title')}
        intro={t('about.intro')}
        image="/images/office.jpg"
        breadcrumbs={[{ label: t('nav.about') }]}
      />

      <section className="section">
        <div className="shell grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <div className="eyebrow">{t('about.storyTitle')}</div>
            <h2 className="section-title mt-4">
              {locale === 'fa' ? 'ما برای تصمیم‌های مهم، اطلاعات روشن می‌سازیم.' : 'We make important decisions clearer.'}
            </h2>
            <p className="mt-5 text-[0.92rem] leading-8 text-[#435a72]">{t('about.story1')}</p>
            <p className="mt-4 text-[0.92rem] leading-8 text-[#435a72]">{t('about.story2')}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <LocalLink to="/services" className="btn btn-dark">
                {t('cta.explore')} <ArrowRight size={14} className="rtl:rotate-180" />
              </LocalLink>
              <LocalLink to="/experts" className="btn btn-outline">
                {t('nav.experts')}
              </LocalLink>
            </div>
          </Reveal>
          <Reveal delay={80} className="relative">
            <div className="overflow-hidden rounded-[20px]">
              <img
                className="aspect-[4/4.4] w-full object-cover"
                src="/images/team.jpg"
                alt={locale === 'fa' ? 'تیم در حال کار روی یک پرونده' : 'A team working through an application'}
                loading="lazy"
                width="900"
                height="1000"
              />
            </div>
            <div className="absolute -bottom-4 start-5 rounded-xl border border-line bg-white px-5 py-4 shadow-card">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-orange text-navy">
                  <Compass size={18} />
                </span>
                <div>
                  <div className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-orange-dark">
                    {locale === 'fa' ? 'اصل ما' : 'Our principle'}
                  </div>
                  <div className="mt-0.5 text-[0.8rem] font-semibold text-navy">
                    {locale === 'fa' ? 'واقعیت پیش از وعده' : 'Reality before promises'}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-sky-50">
        <div className="shell">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="card relative overflow-hidden p-7">
              <div className="absolute end-4 top-4 text-[3.4rem] font-bold leading-none text-sky-100">01</div>
              <Target size={22} className="text-orange-dark" />
              <h2 className="mt-5 font-display text-xl font-bold text-navy">{t('about.mission')}</h2>
              <p className="mt-3 max-w-lg text-[0.86rem] leading-8 text-muted">{t('about.missionBody')}</p>
            </div>
            <div className="card relative overflow-hidden p-7">
              <div className="absolute end-4 top-4 text-[3.4rem] font-bold leading-none text-sky-100">02</div>
              <Compass size={22} className="text-orange-dark" />
              <h2 className="mt-5 font-display text-xl font-bold text-navy">{t('about.vision')}</h2>
              <p className="mt-3 max-w-lg text-[0.86rem] leading-8 text-muted">{t('about.visionBody')}</p>
            </div>
          </div>

          <div className="mt-14">
            <div className="eyebrow">{t('about.values')}</div>
            <h2 className="section-title mt-4">{t('about.values')}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <Reveal key={value.title} className="card p-5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-sky-100 text-blue">
                    <value.icon size={17} />
                  </span>
                  <h3 className="mt-4 text-[0.88rem]">{t(value.title)}</h3>
                  <p className="mt-2 text-[0.74rem] leading-6 text-muted">{t(value.body)}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="eyebrow">{t('about.approachTitle')}</div>
            <h2 className="section-title mt-4">{t('about.approachTitle')}</h2>
            <p className="lede mt-4">{t('about.approachBody')}</p>
            <div className="notice mt-6">{locale === 'fa' ? site.settings.legalNotice_fa : site.settings.legalNotice}</div>
          </div>
          <div className="overflow-hidden rounded-[20px]">
            <img
              className="aspect-[16/10] w-full object-cover"
              src="/images/office.jpg"
              alt={locale === 'fa' ? 'دفتر مشاوره' : 'The FaraTech office environment'}
              loading="lazy"
              width="1100"
              height="700"
            />
          </div>
        </div>
      </section>

      <section className="section bg-sky-50">
        <div className="shell">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="eyebrow">{t('nav.experts')}</div>
              <h2 className="section-title mt-3">{t('experts.title')}</h2>
            </div>
            <LocalLink to="/experts" className="link-arrow">
              {t('nav.viewAll')} <ArrowRight size={14} className="rtl:rotate-180" />
            </LocalLink>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {site.experts.map((expert) => (
              <ExpertCard key={expert.id} expert={expert} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
