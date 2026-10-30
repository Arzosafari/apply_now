import { useEffect, useState } from 'react';
import {
  ChevronDown,
  Globe2,
  Menu,
  Phone,
  Plane,
  Sparkles,
  X,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { LocalLink, useLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { Destination, Service, SiteSettings } from '@shared/types';
import { Logo } from './Logo';
import { ServiceIcon } from './ServiceIcon';

interface HeaderProps {
  settings: SiteSettings;
  services: Service[];
  destinations: Destination[];
}

export function Header({ settings, services, destinations }: HeaderProps) {
  const { t, locale, switchLocale } = useLocale();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const barePath = location.pathname === '/fa' ? '/' : location.pathname.replace(/^\/fa(?=\/|$)/, '');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isActive = (path: string) =>
    path === '/' ? barePath === '/' : barePath === path || barePath.startsWith(`${path}/`);

  const nav = [
    { to: '/', label: t('nav.home') },
    { to: '/services', label: t('nav.services'), dropdown: 'services' },
    { to: '/destinations', label: t('nav.destinations'), dropdown: 'destinations' },
    { to: '/pricing', label: t('nav.pricing') },
    { to: '/experts', label: t('nav.experts') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <header className={cn('site-header', scrolled && 'is-scrolled')}>
      <div className="shell header-inner">
        <LocalLink to="/" aria-label={`${settings.brand.name} home`}>
          {settings.brand.logoUrl ? (
            <img src={settings.brand.logoUrl} alt={settings.brand.name} className="h-10 w-auto max-w-[175px] object-contain" />
          ) : (
            <Logo name={settings.brand.name} />
          )}
        </LocalLink>

        <nav className="desktop-nav" aria-label="Primary">
          <div className="nav-list">
            {nav.map((item) => (
              <div key={item.to} className={cn(item.dropdown && 'nav-dropdown')}>
                <LocalLink
                  to={item.to}
                  className={cn('nav-link', isActive(item.to) && 'active')}
                  aria-current={isActive(item.to) ? 'page' : undefined}
                  aria-haspopup={item.dropdown ? 'true' : undefined}
                >
                  {item.label}
                  {item.dropdown && <ChevronDown size={12} strokeWidth={2} aria-hidden="true" />}
                </LocalLink>
                {item.dropdown === 'services' && (
                  <div className="dropdown-panel" role="group" aria-label={t('nav.services')}>
                    {services.slice(0, 7).map((service) => (
                      <LocalLink key={service.id} to={`/services/${service.slug}`} className="dropdown-item">
                        <span className="dropdown-icon">
                          <ServiceIcon name={service.icon} size={16} />
                        </span>
                        <span>{locale === 'fa' ? service.title_fa : service.title_en}</span>
                      </LocalLink>
                    ))}
                    <div className="divider my-1" />
                    <LocalLink to="/services" className="dropdown-item font-semibold">
                      <span className="dropdown-icon bg-orange-50 text-orange-600">
                        <Sparkles size={16} />
                      </span>
                      <span>{t('nav.viewAll')}</span>
                    </LocalLink>
                  </div>
                )}
                {item.dropdown === 'destinations' && (
                  <div className="dropdown-panel" role="group" aria-label={t('nav.destinations')}>
                    {destinations.map((destination) => (
                      <LocalLink
                        key={destination.id}
                        to={`/destinations/${destination.slug}`}
                        className="dropdown-item"
                      >
                        <span className="flag-badge !h-5 !w-7">
                          <img src={destination.flag || ''} alt="" width="28" height="20" loading="lazy" />
                        </span>
                        <span>{locale === 'fa' ? destination.name_fa : destination.name_en}</span>
                      </LocalLink>
                    ))}
                    <div className="divider my-1" />
                    <LocalLink to="/destinations" className="dropdown-item font-semibold">
                      <span className="dropdown-icon">
                        <Globe2 size={16} />
                      </span>
                      <span>{t('nav.viewAll')}</span>
                    </LocalLink>
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        <div className="desktop-actions flex items-center gap-3">
          <div className="lang-switch" aria-label={t('nav.language')}>
            <button
              type="button"
              onClick={() => locale !== 'en' && switchLocale()}
              aria-pressed={locale === 'en'}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => locale !== 'fa' && switchLocale()}
              aria-pressed={locale === 'fa'}
            >
              FA
            </button>
          </div>
          <LocalLink to="/consultation" className="btn btn-primary btn-sm">
            {t('cta.free')}
            <Plane size={14} strokeWidth={2} aria-hidden="true" />
          </LocalLink>
        </div>

        <button
          type="button"
          className="mobile-toggle icon-btn"
          onClick={() => setOpen(true)}
          aria-label={t('nav.menu')}
          aria-expanded={open}
        >
          <Menu size={20} />
        </button>
      </div>

      {open && (
        <div className="mobile-nav" role="dialog" aria-modal="true" aria-label={t('nav.menu')}>
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default"
            aria-label={t('nav.close')}
            onClick={() => setOpen(false)}
          />
          <div className="mobile-nav-panel">
            <div className="flex items-center justify-between">
              <LocalLink to="/" onClick={() => setOpen(false)}>
                {settings.brand.logoUrl ? (
                  <img src={settings.brand.logoUrl} alt={settings.brand.name} className="h-10 w-auto max-w-[170px] object-contain" />
                ) : (
                  <Logo name={settings.brand.name} />
                )}
              </LocalLink>
              <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label={t('nav.close')}>
                <X size={18} />
              </button>
            </div>

            <div className="mt-7 flex items-center justify-between rounded-xl bg-sky-50 p-3">
              <span className="text-[11px] font-semibold text-navy">{t('nav.language')}</span>
              <div className="lang-switch">
                <button
                  type="button"
                  onClick={() => {
                    if (locale !== 'en') switchLocale();
                    setOpen(false);
                  }}
                  aria-pressed={locale === 'en'}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (locale !== 'fa') switchLocale();
                    setOpen(false);
                  }}
                  aria-pressed={locale === 'fa'}
                >
                  FA
                </button>
              </div>
            </div>

            <nav className="mt-5" aria-label="Mobile primary">
              {nav.map((item) => (
                <LocalLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center justify-between border-b border-line py-3.5 text-[0.88rem] font-medium text-[#3f536a]',
                    isActive(item.to) && 'text-navy font-bold',
                  )}
                >
                  {item.label}
                  {isActive(item.to) && <span className="h-1.5 w-1.5 rounded-full bg-orange" />}
                </LocalLink>
              ))}
            </nav>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <LocalLink to="/consultation" onClick={() => setOpen(false)} className="btn btn-primary col-span-2">
                {t('cta.getStarted')}
              </LocalLink>
              <a href={`tel:${settings.brand.phone}`} className="btn btn-outline btn-sm">
                <Phone size={14} />
                {t('contact.phone')}
              </a>
              <LocalLink to="/contact" onClick={() => setOpen(false)} className="btn btn-outline btn-sm">
                {t('nav.contact')}
              </LocalLink>
            </div>
            <p className="mt-5 text-[10px] leading-5 text-muted">{settings.brand.hours}</p>
          </div>
        </div>
      )}
    </header>
  );
}
