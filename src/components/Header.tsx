import { useEffect, useRef, useState, type MouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
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
import { useDialogFocus } from '@/lib/useDialogFocus';
import type { Destination, Service, SiteSettings } from '@shared/types';
import { Logo } from './Logo';
import { ServiceIcon } from './ServiceIcon';

interface HeaderProps {
  settings: SiteSettings;
  services: Service[];
  destinations: Destination[];
}

type NavDropdown = 'services' | 'destinations';

export function Header({ settings, services, destinations }: HeaderProps) {
  const { t, locale, switchLocale } = useLocale();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const menuRef = useDialogFocus<HTMLDivElement>(open);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<NavDropdown | null>(null);
  const activeDropdownRef = useRef<NavDropdown | null>(null);
  const desktopNavRef = useRef<HTMLElement>(null);
  const switchDropdownTimer = useRef<number | null>(null);
  const pendingDropdown = useRef<NavDropdown | null>(null);
  const pendingPointerY = useRef<number | null>(null);
  const lastActivePointer = useRef<{ dropdown: NavDropdown; y: number; time: number } | null>(null);
  const suppressFocusOpen = useRef(false);
  const barePath = location.pathname === '/fa' ? '/' : location.pathname.replace(/^\/fa(?=\/|$)/, '');

  const clearDropdownTimer = () => {
    if (switchDropdownTimer.current !== null) window.clearTimeout(switchDropdownTimer.current);
    switchDropdownTimer.current = null;
    pendingDropdown.current = null;
    pendingPointerY.current = null;
  };

  const showDropdown = (dropdown: NavDropdown | null) => {
    activeDropdownRef.current = dropdown;
    if (!dropdown) lastActivePointer.current = null;
    setActiveDropdown(dropdown);
  };

  const closeDropdown = () => {
    clearDropdownTimer();
    showDropdown(null);
  };

  const dropdownGroup = (dropdown: NavDropdown) =>
    desktopNavRef.current?.querySelector<HTMLElement>(`[data-dropdown="${dropdown}"]`);

  const deferDropdownSwitch = (dropdown: NavDropdown) => {
    if (switchDropdownTimer.current !== null) window.clearTimeout(switchDropdownTimer.current);
    pendingDropdown.current = dropdown;
    switchDropdownTimer.current = window.setTimeout(() => {
      clearDropdownTimer();
      showDropdown(dropdown);
    }, 650);
  };

  const enterDropdown = (dropdown: NavDropdown, event: ReactPointerEvent<HTMLDivElement>) => {
    clearDropdownTimer();
    const active = activeDropdownRef.current;
    if (active && active !== dropdown) {
      const activeGroup = dropdownGroup(active);
      // Don't hide a menu that currently contains keyboard focus.
      if (activeGroup?.contains(document.activeElement)) return;
      const previous = lastActivePointer.current;
      const movingDownFromActive = previous?.dropdown === active
        && performance.now() - previous.time < 1200
        && event.clientY > previous.y + 0.1;
      if (movingDownFromActive) {
        // A diagonal crossing on the way into the current panel is not a choice
        // of the neighbouring menu. Straight movement to that menu is immediate.
        pendingPointerY.current = event.clientY;
        deferDropdownSwitch(dropdown);
        return;
      }
    }
    showDropdown(dropdown);
  };

  const selectDropdownLink = (event: MouseEvent<HTMLDivElement>) => {
    // Leave modified clicks alone so opening a link in a new tab still works.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!(event.target instanceof Element) || !event.target.closest('a')) return;
    closeDropdown();
    document.getElementById('main-content')?.focus({ preventScroll: true });
  };

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const active = activeDropdownRef.current;
      if (active && event.target instanceof Node && !dropdownGroup(active)?.contains(event.target)) closeDropdown();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const active = activeDropdownRef.current;
      if (event.key !== 'Escape' || !active) return;
      const group = dropdownGroup(active);
      const focusWasInside = group?.contains(document.activeElement);
      closeDropdown();
      if (focusWasInside) {
        const trigger = group?.querySelector<HTMLAnchorElement>('.nav-link');
        if (trigger && document.activeElement !== trigger) {
          suppressFocusOpen.current = true;
          trigger.focus();
          suppressFocusOpen.current = false;
        }
      }
      event.preventDefault();
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      clearDropdownTimer();
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    closeDropdown();
  }, [location.pathname]);

  useEffect(() => {
    // Keep this in sync with the mobile header media query in index.css.
    const mobileHeader = window.matchMedia('(max-width: 1199px), (max-width: 1366px) and (hover: none) and (pointer: coarse)');
    const onHeaderLayoutChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        closeDropdown();
      } else {
        setOpen(false);
      }
    };
    mobileHeader.addEventListener('change', onHeaderLayoutChange);
    return () => mobileHeader.removeEventListener('change', onHeaderLayoutChange);
  }, []);

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

  const nav: { to: string; label: string; dropdown?: NavDropdown }[] = [
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
        <LocalLink className="header-brand" to="/" aria-label={locale === 'fa' ? `خانه ${settings.brand.name}` : `${settings.brand.name} home`}>
          <Logo name={settings.brand.name} src={settings.brand.logoUrl} />
        </LocalLink>

        <nav
          ref={desktopNavRef}
          className="desktop-nav"
          aria-label={locale === 'fa' ? 'منوی اصلی' : 'Primary'}
          onPointerMoveCapture={(event) => {
            if (event.pointerType === 'touch' || !(event.target instanceof Node)) return;
            const active = activeDropdownRef.current;
            if (active && dropdownGroup(active)?.contains(event.target)) {
              lastActivePointer.current = { dropdown: active, y: event.clientY, time: performance.now() };
            }
            const pending = pendingDropdown.current;
            if (pending && dropdownGroup(pending)?.contains(event.target)) {
              if (pendingPointerY.current !== null && event.clientY > pendingPointerY.current + 0.1) {
                // Keep the current menu open for as long as the pointer is
                // travelling downward, even when that movement is slow.
                deferDropdownSwitch(pending);
              }
              pendingPointerY.current = event.clientY;
            }
          }}
        >
          <div className="nav-list">
            {nav.map((item) => (
              <div
                key={item.to}
                className={cn(item.dropdown && 'nav-dropdown')}
                data-dropdown={item.dropdown}
                onClickCapture={item.dropdown ? selectDropdownLink : undefined}
                onPointerEnter={item.dropdown ? (event) => {
                  if (event.pointerType !== 'touch' && item.dropdown) enterDropdown(item.dropdown, event);
                } : undefined}
                onPointerLeave={item.dropdown ? (event) => {
                  if (event.pointerType !== 'touch') clearDropdownTimer();
                } : undefined}
                onFocusCapture={item.dropdown ? () => {
                  if (!suppressFocusOpen.current && item.dropdown) {
                    clearDropdownTimer();
                    showDropdown(item.dropdown);
                  }
                } : undefined}
                onBlurCapture={item.dropdown ? (event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)
                    && activeDropdownRef.current === item.dropdown
                    && !event.currentTarget.matches(':hover')) {
                    closeDropdown();
                  }
                } : undefined}
              >
                <LocalLink
                  to={item.to}
                  className={cn('nav-link', isActive(item.to) && 'active')}
                  aria-current={isActive(item.to) ? 'page' : undefined}
                  aria-haspopup={item.dropdown ? 'true' : undefined}
                  aria-expanded={item.dropdown ? activeDropdown === item.dropdown : undefined}
                  aria-controls={item.dropdown ? `nav-dropdown-${item.dropdown}` : undefined}
                >
                  {item.label}
                  {item.dropdown && <ChevronDown size={12} strokeWidth={2} aria-hidden="true" />}
                </LocalLink>
                {item.dropdown === 'services' && (
                  <div id="nav-dropdown-services" className="dropdown-panel" data-open={activeDropdown === 'services' ? 'true' : undefined} role="group" aria-label={t('nav.services')}>
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
                  <div id="nav-dropdown-destinations" className="dropdown-panel" data-open={activeDropdown === 'destinations' ? 'true' : undefined} role="group" aria-label={t('nav.destinations')}>
                    {destinations.map((destination) => (
                      <LocalLink
                        key={destination.id}
                        to={`/destinations/${destination.slug}`}
                        className="dropdown-item"
                      >
                        <span className="flag-badge !h-5 !w-7">
                          {destination.flag ? <img src={destination.flag} alt="" width="28" height="20" loading="lazy" /> : <span aria-hidden="true">{destination.country_code}</span>}
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

        <LocalLink to="/consultation" className="btn btn-primary mobile-consultation" aria-label={t('cta.book')}>
          <span className="mobile-consultation-full">{t('cta.book')}</span>
          <span className="mobile-consultation-compact" aria-hidden="true">{t('cta.bookCompact')}</span>
        </LocalLink>

        <div className="mobile-header-actions">
          <button
            type="button"
            className="mobile-language icon-btn"
            onClick={switchLocale}
            aria-label={t(locale === 'fa' ? 'nav.switchToEnglish' : 'nav.switchToPersian')}
            title={t(locale === 'fa' ? 'nav.switchToEnglish' : 'nav.switchToPersian')}
          >
            <Globe2 size={16} aria-hidden="true" />
            <span aria-hidden="true">{locale === 'fa' ? 'EN' : 'FA'}</span>
          </button>
          <button
            type="button"
            className="mobile-toggle icon-btn"
            onClick={() => setOpen(true)}
            aria-label={t('nav.menu')}
            aria-expanded={open}
            aria-controls="public-mobile-menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {open && createPortal(
        <div className="mobile-nav">
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
          />
          <div ref={menuRef} id="public-mobile-menu" tabIndex={-1} className="mobile-nav-panel" role="dialog" aria-modal="true" aria-label={t('nav.menu')}>
            <div className="mobile-nav-header">
              <LocalLink to="/" onClick={() => setOpen(false)} aria-label={locale === 'fa' ? `خانه ${settings.brand.name}` : `${settings.brand.name} home`}>
                <Logo name={settings.brand.name} src={settings.brand.logoUrl} />
              </LocalLink>
              <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label={t('nav.close')}>
                <X size={18} />
              </button>
            </div>

            <div className="mobile-nav-body">
              <div className="mt-6 flex items-center justify-between rounded-xl bg-sky-50 p-3">
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

              <nav className="mt-5" aria-label={locale === 'fa' ? 'منوی اصلی موبایل' : 'Mobile primary'}>
                {nav.map((item) => (
                  <LocalLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center justify-between border-b border-line py-3.5 text-[0.95rem] font-medium text-[#3f536a]',
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
              <p className="mt-5 text-[10px] leading-5 text-muted">{locale === 'fa' ? settings.brand.hours_fa : settings.brand.hours}</p>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </header>
  );
}
