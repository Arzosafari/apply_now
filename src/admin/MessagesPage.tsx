import { useDeferredValue, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Mail, MessageSquareText, Phone, Search, X } from 'lucide-react';
import type { ContactMessage } from '@shared/types';
import { adminApi } from '@/lib/api';
import { errorMessage } from '@/lib/errors';
import { usePageMeta } from '@/lib/seo';
import { AdminPageHeader } from './AdminLayout';
import { AdminError, AdminSpinner, Pagination, StatusBadge, TableEmpty } from './components';
import { useToast } from './Toast';

export function MessagesPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const queryClient = useQueryClient();
  const { notify } = useToast();

  usePageMeta({ title: 'Contact messages', description: 'Manage contact form messages.', noindex: true });

  const query = useQuery({
    queryKey: ['admin-messages', page, status, deferredSearch],
    queryFn: () => adminApi.contactMessages({ page, pageSize: 20, status, search: deferredSearch || undefined }),
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: ({ id, nextStatus }: { id: number; nextStatus: string }) =>
      adminApi.updateMessageStatus(id, nextStatus),
    onSuccess: () => {
      notify('Message status updated.');
      setSelected(null);
      void queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (error) => notify(errorMessage(error, 'en'), 'error'),
  });

  return (
    <>
      <AdminPageHeader title="Contact messages" description="General enquiries submitted through the public contact form." />

      <div className="admin-card overflow-hidden">
        <div className="admin-filter-bar">
          <label className="relative min-w-[220px] flex-1">
            <span className="sr-only">Search messages</span>
            <Search size={14} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[#93a4b6]" />
            <input
              className="admin-input w-full !ps-8"
              placeholder="Search name, email or subject…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </label>
          <select className="admin-select" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
            {['all', 'new', 'read', 'replied', 'archived'].map((item) => (
              <option key={item} value={item}>{item === 'all' ? 'All messages' : item}</option>
            ))}
          </select>
        </div>

        {query.isLoading ? (
          <AdminSpinner />
        ) : query.isError ? (
          <AdminError message="Messages could not be loaded." retry={() => void query.refetch()} />
        ) : !query.data || query.data.items.length === 0 ? (
          <TableEmpty label="No contact messages yet." />
        ) : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Received</th>
                    <th className="text-end">Open</th>
                  </tr>
                </thead>
                <tbody>
                  {query.data.items.map((message) => (
                    <tr key={message.id}>
                      <td data-label="From">
                        <div className="font-medium text-[#304a63]">{message.name}</div>
                        <div className="mt-0.5 text-[0.6rem] text-[#96a5b5]">{message.email}</div>
                      </td>
                      <td data-label="Subject" className="max-w-sm">
                        <div className="truncate font-medium text-[#40566c]">{message.subject}</div>
                        <div className="mt-0.5 line-clamp-1 text-[0.61rem] text-[#96a5b5]">{message.message}</div>
                      </td>
                      <td data-label="Status"><StatusBadge status={message.status} /></td>
                      <td data-label="Received" className="whitespace-nowrap text-[0.65rem]">
                        {new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(message.created_at))}
                      </td>
                      <td data-label="Open" className="text-end">
                        <button type="button" className="text-[0.65rem] font-semibold text-blue hover:text-orange-600" onClick={() => setSelected(message)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={query.data.page} pageSize={query.data.pageSize} total={query.data.total} onChange={setPage} />
          </>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/40 p-4 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-labelledby="message-title">
          <div className="w-full max-w-xl rounded-xl border border-line bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#e8eef5] p-5">
              <div>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.09em] text-[#93a2b4]">Contact message</p>
                <h2 id="message-title" className="mt-1.5 text-[1.02rem] font-semibold text-navy">{selected.subject}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.66rem] text-[#8494a7]">
                  <StatusBadge status={selected.status} />
                  <span>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(selected.created_at))}</span>
                </div>
              </div>
              <button type="button" className="icon-btn !h-8 !w-8" onClick={() => setSelected(null)} aria-label="Close">
                <X size={15} />
              </button>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-2">
                <a href={`mailto:${selected.email}`} className="chip"><Mail size={12} /> {selected.email}</a>
                {selected.phone && <a href={`tel:${selected.phone}`} className="chip"><Phone size={12} /> {selected.phone}</a>}
              </div>
              <p className="mt-5 whitespace-pre-wrap text-[0.8rem] leading-7 text-[#526980]">{selected.message}</p>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-[#eef2f7] pt-4">
                {selected.status === 'new' && (
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => mutation.mutate({ id: selected.id, nextStatus: 'read' })}>
                    Mark as read
                  </button>
                )}
                <button type="button" className="btn btn-dark btn-sm" onClick={() => mutation.mutate({ id: selected.id, nextStatus: 'replied' })}>
                  <MessageSquareText size={13} /> Mark as replied
                </button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => mutation.mutate({ id: selected.id, nextStatus: 'archived' })}>
                  Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
