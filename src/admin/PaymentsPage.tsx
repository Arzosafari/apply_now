import { useDeferredValue, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, LockKeyhole, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { adminApi } from '@/lib/api';
import { usePageMeta } from '@/lib/seo';
import { AdminPageHeader } from './AdminLayout';
import { AdminError, AdminSpinner, Pagination, StatusBadge, TableEmpty } from './components';

export function PaymentsPage() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');
  const deferredSearch = useDeferredValue(search);
  const page = Number(params.get('page') || 1);
  const status = params.get('status') || 'all';

  usePageMeta({ title: 'Payments', description: 'View provider-verified payments.', noindex: true });

  const query = useQuery({
    queryKey: ['admin-payments', page, status, deferredSearch],
    queryFn: () =>
      adminApi.payments({ page, pageSize: 20, status, search: deferredSearch || undefined }),
    retry: false,
  });

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setParams(next, { replace: true });
  };

  return (
    <>
      <AdminPageHeader
        title="Payments"
        description="Provider-verified transactions and their linked consultation requests."
        action={
          <a className="btn btn-dark btn-sm" href="/api/admin/payments/export">
            <Download size={13} /> Export CSV
          </a>
        }
      />

      <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-[#dce8f3] bg-[#f6faff] p-4">
        <LockKeyhole size={16} className="mt-0.5 shrink-0 text-[#3b75a8]" />
        <p className="text-[0.68rem] leading-6 text-[#56718a]">
          Payment results are read-only. Only transactions verified server-side with the payment provider are marked successful. Refunds must be handled through the provider dashboard and then reconciled by an owner.
        </p>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="admin-filter-bar">
          <label className="relative min-w-[220px] flex-1">
            <span className="sr-only">Search payments</span>
            <Search size={14} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[#93a4b6]" />
            <input
              className="admin-input w-full !ps-8"
              placeholder="Search payment or consultation reference…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                updateParam('search', event.target.value);
              }}
            />
          </label>
          <select className="admin-select" value={status} onChange={(event) => updateParam('status', event.target.value)} aria-label="Filter by status">
            {['all', 'pending', 'successful', 'failed', 'cancelled', 'refunded'].map((item) => (
              <option key={item} value={item}>
                {item === 'all' ? 'All statuses' : item}
              </option>
            ))}
          </select>
        </div>

        {query.isLoading ? (
          <AdminSpinner />
        ) : query.isError ? (
          <AdminError message="Payments could not be loaded." retry={() => void query.refetch()} />
        ) : !query.data || query.data.items.length === 0 ? (
          <TableEmpty label="No payments have been recorded yet." />
        ) : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Payment reference</th>
                    <th>Package</th>
                    <th>Consultation</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Provider</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {query.data.items.map((payment) => (
                    <tr key={payment.id}>
                      <td data-label="Payment reference" className="font-mono text-[0.66rem] font-semibold text-[#3e5c78]">{payment.reference}</td>
                      <td data-label="Package">{payment.package_name_en || payment.description}</td>
                      <td data-label="Consultation" className="font-mono text-[0.64rem]">{payment.consultation_reference || '—'}</td>
                      <td data-label="Amount" className="whitespace-nowrap font-semibold text-[#304a63]">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: payment.currency, maximumFractionDigits: 0 }).format(payment.amount_minor / 100)}
                      </td>
                      <td data-label="Status"><StatusBadge status={payment.status} /></td>
                      <td data-label="Provider" className="capitalize">{payment.provider}</td>
                      <td data-label="Created" className="whitespace-nowrap text-[0.65rem]">
                        {new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(payment.created_at))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={query.data.page}
              pageSize={query.data.pageSize}
              total={query.data.total}
              onChange={(nextPage) => updateParam('page', String(nextPage))}
            />
          </>
        )}
      </div>
    </>
  );
}
