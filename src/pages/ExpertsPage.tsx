import { Info, Languages, ShieldCheck } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import { usePageMeta } from '@/lib/seo';
import { usePublicSite } from '@/components/PublicLayout';
import { PageHero } from '@/components/PageHero';
import { ExpertCard } from '@/components/Cards';
import { CtaBand } from '@/components/CtaBand';
import { Reveal } from '@/components/Reveal';

export function ExpertsPage() {
  const site = usePublicSite();
  const { t, locale } = useLocale();
  usePageMeta({
    title: locale === 'fa' ? 'کارشناسان ما' : 'Our Experts',
    description: t('experts.intro'),
    image: '/images/team.jpg',
  });

  return (
    <>
      <PageHero
        eyebrow={t('experts.eyebrow')}
        title={t('experts.title')}
        intro={t('experts.intro')}
        image="/images/team.jpg"
        breadcrumbs={[{ label: t('nav.experts') }]}
      />

      <section className="section">
        <div className="shell">
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                en: 'Named accountability',
                fa: 'پاسخگویی مشخص',
                bodyEn: 'A future workflow can assign an adviser and document the next step.',
                bodyFa: 'در روند نهایی می‌توان مشاور و گام بعدی را برای هر پرونده مشخص کرد.',
              },
              {
                icon: Languages,
                en: 'Bilingual communication',
                fa: 'ارتباط دوزبانه',
                bodyEn: 'The interface supports content in English and Persian.',
                bodyFa: 'این رابط از محتوای فارسی و انگلیسی پشتیبانی می‌کند.',
              },
              {
                icon: Info,
                en: 'Honest boundaries',
                fa: 'مرزهای صادقانه',
                bodyEn: 'Legal, tax and financial questions should be referred to qualified professionals.',
                bodyFa: 'پرسش‌های حقوقی، مالیاتی و مالی باید به متخصصان واجد شرایط ارجاع شوند.',
              },
            ].map((item) => (
              <div className="card flex gap-3 p-5" key={item.en}>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sky-100 text-blue">
                  <item.icon size={17} />
                </span>
                <div>
                  <h2 className="text-[0.84rem]">{locale === 'fa' ? item.fa : item.en}</h2>
                  <p className="mt-1.5 text-[0.72rem] leading-6 text-muted">{locale === 'fa' ? item.bodyFa : item.bodyEn}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {site.experts.map((expert, index) => (
              <Reveal key={expert.id} delay={index * 55}>
                <ExpertCard expert={expert} />
              </Reveal>
            ))}
          </div>

          <div className="notice mt-8 flex gap-2.5">
            <Info size={15} className="mt-0.5 shrink-0" />
            {locale === 'fa'
              ? 'پروفایل‌های نمایش‌داده‌شده نمونه هستند. پیش از انتشار، اطلاعات واقعی و تأییدشده تیم را از پنل مدیریت وارد کنید.'
              : 'The profiles shown are sample layouts. Replace them with verified team information in the admin portal before launch.'}
          </div>
        </div>
      </section>

      <CtaBand title={t('experts.ctaTitle')} body={t('services.ctaBody')} />
    </>
  );
}
