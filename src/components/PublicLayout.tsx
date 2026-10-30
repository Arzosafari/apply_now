import { createContext, useContext, useEffect, useState } from 'react';
import { ArrowUp, RefreshCw } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import type { PublicSitePayload } from '@shared/types';
import { useLocale } from '@/lib/i18n';
import { useSiteData } from '@/lib/site';
import { useScrollToTop } from '@/lib/seo';
import { Footer } from './Footer';
import { Header } from './Header';
import { Logo } from './Logo';

const SiteContext = createContext<PublicSitePayload | null>(null);

export function usePublicSite() {
  const value = useContext(SiteContext);
  if (!value) throw new Error('usePublicSite must be used inside PublicLayout');
  return value;
}

function FullPageLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-sky-50">
      <div className="flex flex-col items-center gap-5">
        <Logo />
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="h-2 w-2 animate-pulse rounded-full bg-orange" />
          <span>Loading FaraTech…</span>
        </div>
      </div>
    </div>
  );
}

function LoadError({ retry }: { retry: () => void }) {
  const { t } = useLocale();
  return (
    <div className="grid min-h-screen place-items-center bg-sky-50 px-6">
      <div className="max-w-md text-center">
        <Logo />
        <h1 className="mt-8 text-2xl">{t('common.error')}</h1>
        <p className="mt-3 text-sm leading-7 text-muted">{t('common.errorBody')}</p>
        <button type="button" className="btn btn-dark mt-6" onClick={retry}>
          <RefreshCw size={15} /> {t('common.retry')}
        </button>
      </div>
    </div>
  );
}

export function PublicLayout() {
  const { data, isLoading, isError, refetch } = useSiteData();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { t, locale } = useLocale();
  const [showTop, setShowTop] = useState(false);
  useScrollToTop(pathname);

  useEffect(() => {
    if (!data || pathname !== '/') return;
    const preference = (() => {
      try {
        return window.localStorage.getItem('faratech_lang');
      } catch {
        return null;
      }
    })();
    if (!preference && data.settings.general?.defaultLanguage === 'fa') {
      navigate(`/fa${search}`, { replace: true });
    }
  }, [data, pathname, search, navigate]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (isLoading || (!data && !isError)) return <FullPageLoader />;
  if (isError || !data) return <LoadError retry={() => void refetch()} />;

  return (
    <SiteContext.Provider value={data}>
      <a href="#main-content" className="skip-link">
        {locale === 'fa' ? 'رفتن به محتوای اصلی' : 'Skip to main content'}
      </a>
      {!data.contentVerified && (
        <div className="demo-bar">
          <div className="shell flex items-center justify-center gap-2.5 text-center">
            <span className="dot" />
            <span>{t('common.demoNotice')}</span>
          </div>
        </div>
      )}
      <Header settings={data.settings} services={data.services} destinations={data.destinations} />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer settings={data.settings} services={data.services} destinations={data.destinations} />
      {showTop && (
        <button
          type="button"
          className="fixed bottom-5 end-5 z-30 grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-navy shadow-card transition hover:-translate-y-0.5"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={locale === 'fa' ? 'بازگشت به بالا' : 'Back to top'}
        >
          <ArrowUp size={17} />
        </button>
      )}
    </SiteContext.Provider>
  );
}
