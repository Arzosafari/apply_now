import { useAdminTranslation } from './i18n';
import { useDeferredValue, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, LockKeyhole, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { adminApi } from '@/lib/api';
import { usePageMeta } from '@/lib/seo';
import { useLocale } from '@/lib/i18n';
import { downloadCsv } from '@/lib/download';
import { AdminPageHeader } from './AdminLayout';
import { AdminError, AdminSpinner, Pagination, StatusBadge, TableEmpty } from './components';

export function PaymentsPage() {
  const a = useAdminTranslation();
  const { locale } = useLocale();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');
  const deferredSearch = useDeferredValue(search);
  const page = Number(params.get('page') || 1);
  const status = params.get('status') || 'all';

  usePageMeta({ title: 'Payments', description: 'View sample payment records in the local demo.', noindex: true });

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
        title={a("Payments")}
        description={a("Illustrative payment records for the frontend preview.")}
        action={
          <button type="button" className="btn btn-dark btn-sm" disabled={!query.data?.total} onClick={async () => {
            const records = await adminApi.payments({ page: 1, pageSize: 1000, status, search: deferredSearch });
            downloadCsv('faratech-demo-payments.csv', records.items.map((item) => ({ transaction: item.reference, applicant: item.customer_email, package: item.package_name_en, amount: item.amount_minor / 100, currency: item.currency, status: item.status, date: item.created_at })));
          }}>
            <Download size={13} />{a(" Export CSV ")}</button>
        }
      />

      <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-[#dce8f3] bg-[#f6faff] p-4">
        <LockKeyhole size={16} className="mt-0.5 shrink-0 text-[#3b75a8]" />
        <p className="text-[0.68rem] leading-6 text-[#56718a]">{a(" Demonstration records only. No payment has been processed, verified, or refunded in this preview. A real payment provider must be integrated later. ")}</p>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="admin-filter-bar">
          <label className="relative min-w-[220px] flex-1">
            <span className="sr-only">{a("Search payments")}</span>
            <Search size={14} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[#93a4b6]" />
            <input
              className="admin-input w-full !ps-8"
              placeholder={a("Search payment or consultation reference…")}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                updateParam('search', event.target.value);
              }}
            />
          </label>
          <select className="admin-select" value={status} onChange={(event) => updateParam('status', event.target.value)} aria-label={a("Filter by status")}>
            {['all', 'pending', 'successful', 'failed', 'cancelled', 'refunded'].map((item) => (
              <option key={item} value={item}>
                {item === 'all' ? a("All statuses") : a(item)}
              </option>
            ))}
          </select>
        </div>

        {query.isLoading ? (
          <AdminSpinner />
        ) : query.isError ? (
          <AdminError message="Payments could not be loaded." retry={() => void query.refetch()} />
        ) : !query.data || query.data.items.length === 0 ? (
          <TableEmpty label={a("No payments have been recorded yet.")} />
        ) : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{a("Payment reference")}</th>
                    <th>{a("Applicant")}</th>
                    <th>{a("Package")}</th>
                    <th>{a("Consultation")}</th>
                    <th>{a("Amount")}</th>
                    <th>{a("Status")}</th>
                    <th>{a("Provider")}</th>
                    <th>{a("Created")}</th>
                  </tr>
                </thead>
                <tbody>
                  {query.data.items.map((payment) => (
                    <tr key={payment.id}>
                      <td data-label={a("Payment reference")} className="font-mono text-[0.66rem] font-semibold text-[#3e5c78]">{payment.reference}</td>
                      <td data-label={a("Applicant")}>{(payment as typeof payment & { applicant_name?: string }).applicant_name || payment.customer_email || '—'}</td>
                      <td data-label={a("Package")}>{(locale === 'fa' ? payment.package_name_fa : payment.package_name_en) || payment.description}</td>
                      <td data-label={a("Consultation")} className="font-mono text-[0.64rem]">{payment.consultation_reference || '—'}</td>
                      <td data-label={a("Amount")} className="whitespace-nowrap font-semibold text-[#304a63]">
                        {new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', { style: 'currency', currency: payment.currency, maximumFractionDigits: 0 }).format(payment.amount_minor / 100)}
                      </td>
                      <td data-label={a("Status")}><StatusBadge status={payment.status} /></td>
                      <td data-label={a("Provider")} className="capitalize">{a(payment.provider)}</td>
                      <td data-label={a("Created")} className="whitespace-nowrap text-[0.65rem]">
                        {new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(payment.created_at))}
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
