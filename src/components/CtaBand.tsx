import { ArrowRight } from 'lucide-react';
import { LocalLink, useLocale } from '@/lib/i18n';
import { usePublicSite } from './PublicLayout';

export function CtaBand({
  title,
  body,
  image = '/images/cta-city.jpg',
  ctaLabel,
  ctaTo = '/consultation',
}: {
  title?: string;
  body?: string;
  image?: string;
  ctaLabel?: string;
  ctaTo?: string;
}) {
  const { t, locale } = useLocale();
  const site = usePublicSite();
  const configured = site.settings.cta;
  const defaultTitle = configured ? (locale === 'fa' ? configured.title_fa : configured.title) : t('home.ctaTitle');
  const defaultBody = configured ? (locale === 'fa' ? configured.body_fa : configured.body) : t('home.ctaBody');
  const defaultLabel = configured
    ? (locale === 'fa' ? configured.button_fa : configured.button)
    : t('cta.getStarted');
  return (
    <section className="cta-band">
      <img className="cta-band-image" src={image} alt="" loading="lazy" width="1600" height="600" />
      <div className="cta-band-wash" />
      <div className="shell">
        <div className="cta-band-inner flex-col !items-start md:!flex-row md:!items-center">
          <div>
            <div className="eyebrow eyebrow-light">{t('cta.free')}</div>
            <h2 className="mt-4">{title || defaultTitle}</h2>
            <p>{body || defaultBody}</p>
          </div>
          <LocalLink to={ctaTo} className="btn btn-primary shrink-0">
            {ctaLabel || defaultLabel}
            <ArrowRight size={15} className="rtl:rotate-180" />
          </LocalLink>
        </div>
      </div>
    </section>
  );
}
