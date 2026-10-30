import { AlertCircle, ChevronLeft, ChevronRight, Inbox, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusStyles: Record<string, string> = {
  pending: 'tag-orange',
  under_review: 'tag bg-blue-50 text-blue-700',
  contacted: 'tag bg-violet-50 text-violet-700',
  in_progress: 'tag bg-sky-50 text-sky-700',
  approved: 'tag-green',
  rejected: 'tag-red',
  completed: 'tag bg-emerald-50 text-emerald-700',
  successful: 'tag-green',
  failed: 'tag-red',
  cancelled: 'tag-gray',
  refunded: 'tag bg-purple-50 text-purple-700',
  new: 'tag-orange',
  read: 'tag-gray',
  replied: 'tag bg-blue-50 text-blue-700',
  archived: 'tag-gray',
  published: 'tag-green',
  draft: 'tag-orange',
};

export function StatusBadge({ status }: { status: string | null | undefined }) {
  const value = status || 'pending';
  return (
    <span className={cn('tag capitalize', statusStyles[value] || 'tag-gray')}>
      {value.replaceAll('_', ' ')}
    </span>
  );
}

export function AdminLoading({ rows = 5 }: { rows?: number }) {
  return (
    <div className="grid gap-2 p-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div className="skeleton h-10 w-full" key={index} />
      ))}
    </div>
  );
}

export function AdminError({ message, retry }: { message?: string; retry?: () => void }) {
  return (
    <div className="grid place-items-center px-6 py-16 text-center">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-red-50 text-red-600">
        <AlertCircle size={20} />
      </span>
      <h3 className="mt-4 text-sm font-semibold text-navy">Could not load this section</h3>
      <p className="mt-1 max-w-sm text-[0.72rem] leading-6 text-[#7b8b9d]">{message || 'Please try again.'}</p>
      {retry && (
        <button type="button" className="btn btn-outline btn-sm mt-4" onClick={retry}>
          Retry
        </button>
      )}
    </div>
  );
}

export function TableEmpty({ label = 'No records yet.' }: { label?: string }) {
  return (
    <div className="grid place-items-center px-6 py-16 text-center">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-[#f1f5f9] text-[#93a4b6]">
        <Inbox size={19} />
      </span>
      <p className="mt-3 text-[0.78rem] text-[#7b8b9d]">{label}</p>
    </div>
  );
}

export function Pagination({
  page,
  pageSize,
  total,
  onChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (total === 0) return null;
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-[#e8eef5] px-4 py-3 sm:flex-row">
      <p className="text-[0.66rem] text-[#8494a7]">
        Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className="icon-btn !h-8 !w-8"
          disabled={page <= 1}
          onClick={() => onChange(Math.max(1, page - 1))}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="min-w-16 text-center text-[0.67rem] font-medium text-[#61758a]">
          {page} / {pages}
        </span>
        <button
          type="button"
          className="icon-btn !h-8 !w-8"
          disabled={page >= pages}
          onClick={() => onChange(Math.min(pages, page + 1))}
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export function AdminSpinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-[0.75rem] text-[#7b8b9d]">
      <Loader2 size={16} className="animate-spin text-blue" />
      {label}
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = 'Delete',
  busy,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-navy/45 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-sm rounded-xl border border-line bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <h3 id="confirm-title" className="text-base font-semibold text-navy">{title}</h3>
        <p className="mt-2 text-[0.76rem] leading-6 text-[#708196]">{body}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="btn btn-outline btn-sm" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-sm bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : null}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
