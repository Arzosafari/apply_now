import { ChevronRight } from 'lucide-react';
import { LocalLink, useLocale } from '@/lib/i18n';

export function PageHero({
  eyebrow,
  title,
  intro,
  image = '/images/hero-city.jpg',
  breadcrumbs = [],
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  image?: string | null;
  breadcrumbs?: { label: string; to?: string }[];
}) {
  const { locale } = useLocale();
  return (
    <section className="page-hero">
      {image && <img className="page-hero-image" src={image} alt="" width="1600" height="700" />}
      <div className="page-hero-wash" />
      <div className="shell">
        <div className="page-hero-inner">
          <nav className="breadcrumb" aria-label={locale === 'fa' ? 'مسیر صفحه' : 'Breadcrumb'}>
            <LocalLink to="/">FaraTech</LocalLink>
            {breadcrumbs.map((crumb) => (
              <span key={crumb.label} className="contents">
                <ChevronRight size={11} aria-hidden="true" />
                {crumb.to ? (
                  <LocalLink to={crumb.to}>{crumb.label}</LocalLink>
                ) : (
                  <span className="current" aria-current="page">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
          <div className="eyebrow eyebrow-light mt-8">{eyebrow}</div>
          <h1>{title}</h1>
          {intro && <p>{intro}</p>}
        </div>
      </div>
    </section>
  );
}
