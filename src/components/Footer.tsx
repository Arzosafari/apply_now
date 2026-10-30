import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Youtube,
} from 'lucide-react';
import { LocalLink, useLocale } from '@/lib/i18n';
import type { Destination, Service, SiteSettings } from '@shared/types';
import { Logo } from './Logo';

const socialIcons: Record<string, typeof Instagram> = {
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: Facebook,
  youtube: Youtube,
  telegram: Send,
  x: Send,
};

export function Footer({
  settings,
  services,
  destinations,
}: {
  settings: SiteSettings;
  services: Service[];
  destinations: Destination[];
}) {
  const { t, locale } = useLocale();
  const year = new Date().getFullYear();
  const social = Object.entries(settings.brand.social || {}).filter(([, url]) => Boolean(url));

  return (
    <footer className="footer">
      <div className="shell">
        <div className="grid gap-10 py-[58px] md:grid-cols-[1.45fr_1fr_1fr_1fr_1.2fr]">
          <div>
            <LocalLink to="/" aria-label={locale === 'fa' ? `خانه ${settings.brand.name}` : `${settings.brand.name} home`}>
              {settings.brand.logoUrl ? (
                <img src={settings.brand.logoUrl} alt={settings.brand.name} className="h-11 w-auto max-w-[190px] object-contain" />
              ) : (
                <Logo light name={settings.brand.name} />
              )}
            </LocalLink>
            <p className="mt-5 max-w-[275px] text-[0.76rem] leading-[1.8] text-white/55">
              {locale === 'fa' ? settings.footer.statement_fa : settings.footer.statement}
            </p>
            <p className="mt-4 text-[0.63rem] text-white/35">{locale === 'fa' ? settings.brand.tagline_fa || settings.brand.tagline : settings.brand.tagline}</p>
            {social.length > 0 && (
              <div className="mt-5 flex gap-2">
                {social.map(([network, url]) => {
                  const Icon = socialIcons[network] || Send;
                  return (
                    <a
                      key={network}
                      className="social-btn"
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={network}
                    >
                      <Icon size={14} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h2 className="footer-heading">{t('footer.quickLinks')}</h2>
            <LocalLink className="footer-link" to="/about">
              {t('nav.about')}
            </LocalLink>
            <LocalLink className="footer-link" to="/services">
              {t('nav.services')}
            </LocalLink>
            <LocalLink className="footer-link" to="/destinations">
              {t('nav.destinations')}
            </LocalLink>
            <LocalLink className="footer-link" to="/experts">
              {t('nav.experts')}
            </LocalLink>
            <LocalLink className="footer-link" to="/blog">
              {t('nav.blog')}
            </LocalLink>
            <LocalLink className="footer-link" to="/faq">
              {t('nav.faq')}
            </LocalLink>
            <LocalLink className="footer-link" to="/contact">
              {t('nav.contact')}
            </LocalLink>
          </div>

          <div>
            <h2 className="footer-heading">{t('footer.services')}</h2>
            {services.slice(0, 5).map((service) => (
              <LocalLink className="footer-link" key={service.id} to={`/services/${service.slug}`}>
                {locale === 'fa' ? service.title_fa : service.title_en}
              </LocalLink>
            ))}
            <LocalLink className="footer-link !text-orange" to="/services">
              {t('nav.viewAll')} →
            </LocalLink>
          </div>

          <div>
            <h2 className="footer-heading">{t('footer.destinations')}</h2>
            {destinations.map((destination) => (
              <LocalLink className="footer-link" key={destination.id} to={`/destinations/${destination.slug}`}>
                {locale === 'fa' ? destination.name_fa : destination.name_en}
              </LocalLink>
            ))}
          </div>

          <div>
            <h2 className="footer-heading">{t('footer.contact')}</h2>
            <a className="flex items-start gap-2.5 py-1.5 text-[0.74rem] leading-6 text-white/55 hover:text-white" href={`mailto:${settings.brand.email}`}>
              <Mail size={14} className="mt-1 shrink-0 text-orange/80" />
              <span className="break-all">{settings.brand.email}</span>
            </a>
            <a className="flex items-start gap-2.5 py-1.5 text-[0.74rem] leading-6 text-white/55 hover:text-white" href={`tel:${settings.brand.phone}`} dir="ltr">
              <Phone size={14} className="mt-1 shrink-0 text-orange/80" />
              <span>{settings.brand.phone}</span>
            </a>
            <p className="flex items-start gap-2.5 py-1.5 text-[0.74rem] leading-6 text-white/55">
              <MapPin size={14} className="mt-1 shrink-0 text-orange/80" />
              <span>{locale === 'fa' ? settings.brand.address_fa : settings.brand.address}</span>
            </p>
            <LocalLink to="/consultation" className="btn btn-primary btn-sm mt-4">
              {t('cta.free')}
            </LocalLink>
          </div>
        </div>

        <div className="border-t border-white/10 py-4">
          <p className="text-[0.65rem] leading-6 text-white/35">
            {locale === 'fa' ? settings.legalNotice_fa : settings.legalNotice}
          </p>
        </div>

        <div className="footer-bottom flex flex-col items-start justify-between gap-4 py-5 text-[0.67rem] text-white/40 md:flex-row md:items-center">
          <p>
            © {year} {settings.brand.legalName || settings.brand.name}. {t('footer.rights')}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <LocalLink className="hover:text-white" to="/privacy-policy">
              {t('footer.privacy')}
            </LocalLink>
            <LocalLink className="hover:text-white" to="/terms-and-conditions">
              {t('footer.terms')}
            </LocalLink>
            <LocalLink className="hover:text-white" to="/faq">
              {t('nav.faq')}
            </LocalLink>
            <a className="hover:text-white" href="/admin">
              {t('footer.adminAccess')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
