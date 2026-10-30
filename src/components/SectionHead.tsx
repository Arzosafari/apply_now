import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function SectionHead({
  eyebrow,
  title,
  intro,
  action,
  align = 'left',
  light = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: string;
  action?: ReactNode;
  align?: 'left' | 'center';
  light?: boolean;
}) {
  return (
    <div
      className={cn(
        'section-head',
        align === 'center' && 'flex-col items-center text-center',
        align === 'center' && '[&_.section-head-copy]:mx-auto',
      )}
    >
      <div className="section-head-copy">
        {eyebrow && <div className={cn('eyebrow', light && 'eyebrow-light')}>{eyebrow}</div>}
        <h2 className={cn('section-title', light && 'text-white')}>{title}</h2>
        {intro && <p className={cn('lede', light && 'text-white/60')}>{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
