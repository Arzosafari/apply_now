import { SearchX } from 'lucide-react';
import { useLocale } from '@/lib/i18n';

export function EmptyState({ title, body }: { title?: string; body?: string }) {
  const { t } = useLocale();
  return (
    <div className="card grid place-items-center px-6 py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-sky-100 text-blue">
        <SearchX size={20} />
      </div>
      <h3 className="mt-4 text-lg">{title || t('common.noResults')}</h3>
      <p className="mt-2 text-sm text-muted">{body || t('common.noResultsBody')}</p>
    </div>
  );
}
