import { cn } from '@/lib/utils';

export function Logo({
  light = false,
  compact = false,
  name = 'FaraTech',
}: {
  light?: boolean;
  compact?: boolean;
  name?: string;
}) {
  const split = name.length > 4 ? name.slice(0, 4) : name;
  const rest = name.length > 4 ? name.slice(4) : '';
  return (
    <span className={cn('brand-lockup', compact && 'gap-2')}>
      <svg className="brand-mark" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <rect width="44" height="44" rx="12" fill={light ? '#12375F' : '#09264A'} />
        <path
          d="M11.2 29.6c1.5-8.7 6.8-14.5 15.3-16.9 2.6-.7 5-.8 7.1-.3"
          stroke="#FF861F"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <circle cx="23.3" cy="22.7" r="6.2" stroke="white" strokeWidth="1.65" />
        <path d="M17.1 22.7h12.4M23.3 16.5c2.7 3.3 2.7 9.1 0 12.4M23.3 16.5c-2.7 3.3-2.7 9.1 0 12.4" stroke="white" strokeWidth="1.35" />
        <circle cx="33.2" cy="11.6" r="2.4" fill="#FF861F" />
      </svg>
      {!compact && (
        <span className="leading-none">
          <span className="brand-name" style={light ? { color: 'white' } : undefined}>
            {split}
            <span>{rest}</span>
          </span>
          <span className="brand-caption block" style={light ? { color: 'rgba(219,234,249,.48)' } : undefined}>
            Global Mobility
          </span>
        </span>
      )}
    </span>
  );
}
