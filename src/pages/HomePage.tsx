import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  FileCheck2,
  Globe2,
  MessageSquareText,
  Plane,
  Route,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { LocalLink, useLocale } from '@/lib/i18n';
import { usePageMeta } from '@/lib/seo';
import { usePublicSite } from '@/components/PublicLayout';
import { ArticleCard, DestinationCard, ExpertCard, ServiceCard, TestimonialCard } from '@/components/Cards';
import { CtaBand } from '@/components/CtaBand';
import { FaqAccordion } from '@/components/FaqAccordion';
import { Reveal } from '@/components/Reveal';
import { SectionHead } from '@/components/SectionHead';

const statIcons = [BriefcaseBusiness, Globe2, Route, UserRound];

const whyItems = [
  { icon: ShieldCheck, title: 'home.why1Title', body: 'home.why1Body' },
  { icon: UserRound, title: 'home.why2Title', body: 'home.why2Body' },
  { icon: FileCheck2, title: 'home.why3Title', body: 'home.why3Body' },
  { icon: BadgeCheck, title: 'home.why4Title', body: 'home.why4Body' },
  { icon: MessageSquareText, title: 'home.why5Title', body: 'home.why5Body' },
  { icon: Sparkles, title: 'home.why6Title', body: 'home.why6Body' },
] as const;

const processIcons = [MessageSquareText, Route, FileCheck2, BadgeCheck];

export function HomePage() {
  const site = usePublicSite();
  const { settings, services, destinations, experts, testimonials, articles, faqs } = site;
  const { t, locale } = useLocale();
  const hero = settings.hero;
  const featuredExperts = experts.slice(0, 4);

  usePageMeta({
    title: locale === 'fa' ? settings.seo.title_fa : settings.seo.title,
    description: locale === 'fa' ? settings.seo.description_fa : settings.seo.description,
    image: settings.seo.ogImage,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: settings.brand.name,
      description: locale === 'fa' ? settings.brand.description_fa : settings.brand.description,
      email: settings.brand.email,
      areaServed: 'Worldwide',
      knowsLanguage: ['en', 'fa'],
    },
  });

  const stats = settings.stats?.length
    ? settings.stats
    : [
        { value: '10', label_en: 'Specialist services', label_fa: 'خدمت تخصصی' },
        { value: '6', label_en: 'Destination countries', label_fa: 'کشور مقصد' },
        { value: '4', label_en: 'Guided steps', label_fa: 'گام راهنما' },
        { value: '1:1', label_en: 'Advisor support', label_fa: 'پشتیبانی مشاور' },
      ];

  return (
    <>
      <section className="hero">
        <img className="hero-image" src={hero.image || '/images/hero-city.jpg'} alt="" width="1900" height="1100" fetchPriority="high" />
        <div className="hero-wash" />
        <svg className="plane-track" viewBox="0 0 620 330" fill="none" aria-hidden="true">
          <path
            d="M-10 288C87 238 155 245 223 200C304 146 356 58 548 45"
            stroke="rgba(255,255,255,.32)"
            strokeWidth="1.3"
            strokeDasharray="4 9"
          />
          <path d="M552 43l16-8-6 17-6-3-4 7z" fill="#FF861F" />
          <circle cx="552" cy="43" r="21" stroke="rgba(255,134,31,.32)" />
        </svg>

        <div className="shell hero-grid">
          <div className="hero-copy">
            <div className="eyebrow eyebrow-light">
              {(locale === 'fa' ? hero.eyebrow_fa : hero.eyebrow) || t('home.eyebrow')}
            </div>
            <h1>
              {(locale === 'fa' ? hero.title_fa : hero.title) || t('home.title1')}
              <span className="accent">
                {(locale === 'fa' ? hero.highlight_fa : hero.highlight) || t('home.title2')}
              </span>
            </h1>
            <p className="hero-supporting">
              {(locale === 'fa' ? hero.supporting_fa : hero.supporting) || t('home.supporting')}
            </p>
            <p className="hero-description">
              {locale === 'fa'
                ? hero.description_fa || t('home.description')
                : hero.description || t('home.description')}
            </p>
            <div className="hero-actions">
              <LocalLink to="/consultation" className="btn btn-primary">
                {(locale === 'fa' ? hero.primaryCta_fa : hero.primaryCta) || t('cta.getStarted')}
                <ArrowRight size={15} className="rtl:rotate-180" />
              </LocalLink>
              <LocalLink to="/services" className="btn btn-outline-light">
                {(locale === 'fa' ? hero.secondaryCta_fa : hero.secondaryCta) || t('cta.explore')}
              </LocalLink>
            </div>
            <div className="hero-trust">
              <ShieldCheck size={14} className="text-orange" />
              <span>{t('home.trust')}</span>
            </div>
          </div>

          <div className="hero-orbit" aria-hidden="true">
            <div className="orbit-ring">
              <span className="orbit-dot" />
              <span className="absolute left-[19%] top-[71%] h-1.5 w-1.5 rounded-full bg-white/40" />
              <span className="absolute left-[63%] top-[12%] h-1 w-1 rounded-full bg-white/50" />
            </div>
            <div className="hero-note">
              <div className="hero-note-icon">
                <Plane size={17} />
              </div>
              <p className="mt-3 font-display text-[0.92rem] font-semibold leading-6 text-white">
                {locale === 'fa' ? 'مسیر روشن، تصمیم آگاهانه' : 'A clear route. An informed decision.'}
              </p>
              <p className="mt-1.5 text-[0.68rem] leading-5 text-white/50">
                {locale === 'fa'
                  ? 'بر پایه منابع رسمی و پروفایل واقعی شما'
                  : 'Built on official sources and your real profile.'}
              </p>
              <div className="mt-4 space-y-2 border-t border-white/10 pt-3">
                {[
                  locale === 'fa' ? 'مشاور اختصاصی' : 'Dedicated adviser',
                  locale === 'fa' ? 'فرایند مستند' : 'Documented process',
                  locale === 'fa' ? 'بدون وعده غیرواقعی' : 'No false promises',
                ].map((text) => (
                  <div key={text} className="flex items-center gap-2 text-[0.65rem] text-white/62">
                    <Check size={10} className="text-orange" /> {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hero-stats">
          <div className="shell hero-stats-grid">
            {stats.map((stat, index) => {
              const Icon = statIcons[index] || BadgeCheck;
              return (
                <div className="hero-stat" key={`${stat.label_en}-${index}`}>
                  <Icon className="hero-stat-icon" size={20} strokeWidth={1.6} aria-hidden="true" />
                  <div>
                    <div className="hero-stat-value">{stat.value}</div>
                    <div className="hero-stat-label">
                      {locale === 'fa' ? stat.label_fa : stat.label_en}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow={t('home.destinationsEyebrow')}
              title={t('home.destinationsTitle')}
              intro={t('home.destinationsIntro')}
              action={
                <LocalLink to="/destinations" className="link-arrow">
                  {t('nav.viewAll')} <ArrowRight size={14} className="rtl:rotate-180" />
                </LocalLink>
              }
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.slice(0, 6).map((destination, index) => (
              <Reveal key={destination.id} delay={index * 50}>
                <DestinationCard destination={destination} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-sky-50">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow={t('home.servicesEyebrow')}
              title={t('home.servicesTitle')}
              intro={t('home.servicesIntro')}
              action={
                <LocalLink to="/services" className="link-arrow">
                  {t('nav.viewAll')} <ArrowRight size={14} className="rtl:rotate-180" />
                </LocalLink>
              }
            />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <Reveal key={service.id} delay={Math.min(index * 35, 210)}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
            <Reveal className="lg:col-span-2" delay={240}>
              <div className="promo-card h-full">
                <div>
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-orange">
                    <MessageSquareText size={17} />
                  </span>
                  <h3 className="mt-5">{t('home.servicePromoTitle')}</h3>
                  <p>{t('home.servicePromoBody')}</p>
                </div>
                <LocalLink to="/consultation" className="mt-5 inline-flex items-center gap-2 self-start text-[0.76rem] font-semibold text-orange">
                  {t('cta.talk')} <ArrowRight size={13} className="rtl:rotate-180" />
                </LocalLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:grid-rows-[auto_auto_1fr] lg:gap-x-12">
          <Reveal className="home-why-image relative mb-12 lg:col-start-1 lg:row-start-2 lg:row-end-4 lg:mb-0">
            <div className="home-why-image-frame relative aspect-[4/3] overflow-hidden rounded-[20px] lg:absolute lg:inset-0 lg:aspect-auto">
              <img
                className="absolute inset-0 h-full w-full object-cover"
                src="/images/consultation.jpg"
                alt={locale === 'fa' ? 'جلسه مشاوره حرفه‌ای' : 'A professional immigration consultation'}
                loading="lazy"
                width="1800"
                height="1350"
              />
            </div>
            <div className="home-why-image-note absolute bottom-4 start-4 end-4 rounded-xl border border-line bg-white/95 p-4 shadow-card backdrop-blur md:end-auto md:w-72">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-orange text-[#2c210f]">
                  <ShieldCheck size={19} />
                </span>
                <div>
                  <div className="text-[0.55rem] font-bold uppercase tracking-[0.13em] text-orange-dark">
                    {locale === 'fa' ? 'اصل راهنمایی ما' : 'Our standard'}
                  </div>
                  <div className="mt-1 font-display text-[0.83rem] font-bold text-navy">
                    {locale === 'fa' ? 'منبع رسمی، اول از همه' : 'Official sources first'}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="eyebrow mb-4 justify-self-start lg:col-start-2 lg:row-start-1">{t('home.whyEyebrow')}</div>
          <h2 className="section-title min-w-0 lg:col-start-2 lg:row-start-2">{t('home.whyTitle')}</h2>
          <Reveal className="home-why-details mt-4 min-w-0 lg:col-start-2 lg:row-start-3" delay={80}>
            <p className="lede">{t('home.whyBody')}</p>
            <div className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {whyItems.map((item) => (
                <div key={item.title} className="flex gap-3.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sky-100 text-blue">
                    <item.icon size={16} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="text-[0.86rem] leading-5">{t(item.title)}</h3>
                    <p className="mt-1.5 text-[0.74rem] leading-[1.7] text-muted">{t(item.body)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-sky-100/60">
        <div className="shell">
          <div className="home-advice-card grid overflow-hidden rounded-[20px] bg-white shadow-card">
            <div className="home-advice-copy p-7 md:p-10">
              <div className="eyebrow">{t('home.adviceEyebrow')}</div>
              <h2 className="mt-4 font-display text-[clamp(1.5rem,2.6vw,2.05rem)] font-bold leading-[1.2] text-navy">
                {t('home.adviceTitle')}
              </h2>
              <p className="mt-4 text-[0.88rem] leading-8 text-muted">{t('home.adviceBody')}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <LocalLink to="/consultation" className="btn btn-primary btn-sm">
                  {t('cta.free')}
                  <ArrowRight size={14} className="rtl:rotate-180" />
                </LocalLink>
                <LocalLink to="/about" className="btn btn-outline btn-sm">
                  {t('nav.about')}
                </LocalLink>
              </div>
            </div>
            <div className="home-advice-image relative min-h-[280px] overflow-hidden">
              <div className="home-advice-photo">
                <img
                  className="absolute inset-0 h-full w-full object-cover"
                  src="/images/team.jpg"
                  alt={locale === 'fa' ? 'تیم مشاوره در حال بررسی پرونده' : 'Advisers reviewing a client case'}
                  loading="lazy"
                  width="1800"
                  height="2699"
                />
                <div className="home-advice-shade absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
                <div className="home-advice-note absolute bottom-5 start-5 end-5 flex items-center gap-3 rounded-xl border border-white/20 bg-navy/60 p-3 text-white backdrop-blur">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-orange text-navy">
                    <UserRound size={17} />
                  </span>
                  <div>
                    <div className="text-[0.75rem] font-semibold">
                      {locale === 'fa' ? 'یک مشاور مشخص برای پرونده شما' : 'One named adviser for your case'}
                    </div>
                    <div className="mt-0.5 text-[0.63rem] text-white/55">
                      {locale === 'fa' ? 'بدون انتقال مکرر میان افراد' : 'No repeated hand-offs'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {featuredExperts.length > 0 && (
        <section className="section bg-sky-50" aria-label={t('home.expertsTitle')}>
          <div className="shell">
            <Reveal>
              <SectionHead
                eyebrow={t('home.expertsEyebrow')}
                title={t('home.expertsTitle')}
                intro={t('home.expertsIntro')}
                action={
                  <LocalLink to="/experts" className="link-arrow">
                    {t('home.expertsViewAll')} <ArrowRight size={14} className="rtl:rotate-180" />
                  </LocalLink>
                }
              />
            </Reveal>
            <div className="home-experts-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredExperts.map((expert, index) => (
                <Reveal key={expert.id} delay={index * 55}>
                  <ExpertCard expert={expert} />
                </Reveal>
              ))}
            </div>
            {featuredExperts.some((expert) => expert.is_demo) && (
              <p className="mt-6 text-[0.72rem] leading-6 text-muted">{t('home.expertsDemoNote')}</p>
            )}
          </div>
        </section>
      )}

      <section className="section">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow={t('home.processEyebrow')}
              title={t('home.processTitle')}
              intro={t('home.processIntro')}
              align="center"
            />
          </Reveal>
          <div className="relative mt-2 grid gap-9 md:grid-cols-4 md:gap-0">
            <div className="process-line hidden md:block" aria-hidden="true" />
            {[
              ['home.process1Title', 'home.process1Body'],
              ['home.process2Title', 'home.process2Body'],
              ['home.process3Title', 'home.process3Body'],
              ['home.process4Title', 'home.process4Body'],
            ].map(([title, body], index) => {
              const Icon = processIcons[index];
              return (
                <Reveal key={title} className="process-step text-center" delay={index * 70}>
                  <div className="process-number">
                    <Icon size={20} strokeWidth={1.7} />
                  </div>
                  <div className="mt-3 text-[0.6rem] font-bold tracking-[0.13em] text-orange-dark">
                    0{index + 1}
                  </div>
                  <h3>{t(title as never)}</h3>
                  <p>{t(body as never)}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section bg-sky-50">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow={t('home.storiesEyebrow')}
              title={t('home.storiesTitle')}
              intro={t('home.storiesNote')}
            />
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <Reveal key={testimonial.id} delay={index * 60}>
                <TestimonialCard testimonial={testimonial} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow={t('home.insightsEyebrow')}
              title={t('home.insightsTitle')}
              intro={t('home.insightsIntro')}
              action={
                <LocalLink to="/blog" className="link-arrow">
                  {t('nav.viewAll')} <ArrowRight size={14} className="rtl:rotate-180" />
                </LocalLink>
              }
            />
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 3).map((article, index) => (
              <Reveal key={article.id} delay={index * 60}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-sky-50">
        <div className="shell grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <Reveal>
            <div className="eyebrow">{t('home.faqEyebrow')}</div>
            <h2 className="section-title mt-4">{t('home.faqTitle')}</h2>
            <p className="lede mt-4">{t('home.faqIntro')}</p>
            <LocalLink to="/faq" className="btn btn-outline mt-6">
              {t('home.faqMore')}
              <ArrowRight size={14} className="rtl:rotate-180" />
            </LocalLink>
          </Reveal>
          <Reveal delay={60}>
            <div className="card px-6 md:px-7">
              <FaqAccordion items={faqs.slice(0, 6)} />
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
