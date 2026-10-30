import { DEFAULT_BRAND_LOGO, DEFAULT_BRAND_NAME } from '@/lib/brand';
import { cn } from '@/lib/utils';

export function Logo({
  light = false,
  compact = false,
  name = DEFAULT_BRAND_NAME,
  src,
}: {
  light?: boolean;
  compact?: boolean;
  name?: string;
  src?: string | null;
}) {
  return (
    <span className={cn('brand-lockup', light && 'brand-lockup-light', compact && 'brand-lockup-compact')}>
      <img className="brand-logo" src={src || DEFAULT_BRAND_LOGO} alt={name} width="540" height="320" />
    </span>
  );
}
