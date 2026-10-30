import { Compass } from 'lucide-react';
import { LocalLink, useLocale } from '@/lib/i18n';
import { usePageMeta } from '@/lib/seo';

export function NotFoundPage() {
  const { t } = useLocale();
  usePageMeta({ title: t('notfound.title'), description: t('notfound.body'), noindex: true });
  return (
    <section className="grid min-h-[65vh] place-items-center bg-sky-50 px-6 py-20">
      <div className="max-w-lg text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-line bg-white text-orange shadow-card">
          <Compass size={30} />
        </div>
        <div className="mt-6 font-display text-[5rem] font-bold leading-none tracking-[-0.08em] text-[#dce8f4]">404</div>
        <h1 className="-mt-4 text-2xl">{t('notfound.title')}</h1>
        <p className="mt-3 text-sm leading-7 text-muted">{t('notfound.body')}</p>
        <LocalLink to="/" className="btn btn-dark mt-6">
          {t('notfound.home')}
        </LocalLink>
      </div>
    </section>
  );
}
