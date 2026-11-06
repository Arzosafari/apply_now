import { useLocale } from '@/lib/i18n';
import { Logo } from './Logo';

/** Indeterminate because the demo cannot measure how long loading will take. */
export function LoadingScreen() {
  const { t } = useLocale();
  return (
    <div className="site-loading" data-loading-phase="app">
      <div className="site-loading__content">
        <Logo />
        <p id="site-loading-label" className="site-loading__label" role="status">{t('common.loadingSite')}</p>
        <div className="site-loading__track" role="progressbar" aria-labelledby="site-loading-label">
          <span className="site-loading__bar" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
