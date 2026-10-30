import { useAdminTranslation } from './i18n';
import { useDeferredValue, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, Filter, RotateCcw, Search } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import type { ConsultationStatus } from '@shared/types';
import { CONSULTATION_STATUSES } from '@shared/types';
import { adminApi } from '@/lib/api';
import { usePageMeta } from '@/lib/seo';
import { useSiteData } from '@/lib/site';
import { useLocale } from '@/lib/i18n';
import { downloadCsv } from '@/lib/download';
import { AdminPageHeader } from './AdminLayout';
import { AdminError, AdminSpinner, Pagination, StatusBadge, TableEmpty } from './components';

export function ConsultationsPage() {
  const a = useAdminTranslation();
  const { locale } = useLocale();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');
  const deferredSearch = useDeferredValue(search);
  const [filtersOpen, setFiltersOpen] = useState(Boolean(params.get('from') || params.get('to')));
  const site = useSiteData();
  const page = Number(params.get('page') || 1);
  const status = params.get('status') || 'all';
  const serviceId = params.get('serviceId') || '';
  const destinationId = params.get('destinationId') || '';
  const from = params.get('from') || '';
  const to = params.get('to') || '';

  usePageMeta({ title: 'Consultations', description: 'Manage consultation requests.', noindex: true });

  const queryKey = ['admin-consultations', page, status, serviceId, destinationId, from, to, deferredSearch];
  const query = useQuery({
    queryKey,
    queryFn: () =>
      adminApi.consultations({
        page,
        pageSize: 15,
        status,
        serviceId: serviceId || undefined,
        destinationId: destinationId || undefined,
        from: from || undefined,
        to: to || undefined,
        search: deferredSearch || undefined,
      }),
    retry: false,
  });

  const updateParam = (key: string, value: string, resetPage = true) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (resetPage) next.delete('page');
    setParams(next, { replace: true });
  };

  const exportRows = async () => {
    const records = await adminApi.consultations({ page: 1, pageSize: 1000, status, serviceId, destinationId, from, to, search: deferredSearch });
    downloadCsv('apply-now-demo-requests.csv', records.items.map((item) => ({
      reference: item.reference, applicant: item.full_name, email: item.email, phone: item.phone,
      service: item.service_title_en, destination: item.destination_name_en, status: item.status, submitted: item.created_at,
    })));
  };

  const reset = () => {
    setSearch('');
    setParams(new URLSearchParams(), { replace: true });
  };

  return (
    <>
      <AdminPageHeader
        title={a("Consultation requests")}
        description={a("Review, filter and manage every request submitted through the website.")}
        action={
          <>
            <button type="button" className="btn btn-outline btn-sm" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((value) => !value)}>
              <Filter size={13} />{a(" Filters ")}</button>
            <button type="button" className="btn btn-dark btn-sm" onClick={() => void exportRows()} disabled={!query.data?.total}>
              <Download size={13} />{a(" Export CSV ")}</button>
          </>
        }
      />

      <div className="admin-card overflow-hidden">
        <div className="admin-filter-bar !border-b-0">
          <label className="relative min-w-[220px] flex-1">
            <span className="sr-only">{a("Search requests")}</span>
            <Search size={14} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[#93a4b6]" />
            <input
              className="admin-input w-full !ps-8"
              placeholder={a("Search reference, name, email or phone…")}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                updateParam('search', event.target.value);
              }}
            />
          </label>
          <select className="admin-select" value={status} onChange={(event) => updateParam('status', event.target.value)} aria-label={a("Filter by status")}>
            <option value="all">{a("All statuses")}</option>
            {CONSULTATION_STATUSES.map((item) => (
              <option key={item} value={item}>
                {a(item.replaceAll('_', ' '))}
              </option>
            ))}
          </select>
          <button type="button" className="admin-input flex items-center gap-1.5 !w-auto" onClick={reset}>
            <RotateCcw size={12} />{a(" Reset ")}</button>
        </div>

        <div className="flex flex-wrap gap-1.5 border-b border-[#e8eef5] px-3 py-2">
          <button
            type="button"
            onClick={() => updateParam('status', '')}
            className={`rounded-full px-2.5 py-1 text-[0.63rem] font-medium ${status === 'all' ? 'bg-navy text-white' : 'bg-[#f6f9fc] text-[#708196] hover:bg-[#edf4fb]'}`}
          >{a(" All ")}</button>
          {(['pending', 'under_review', 'contacted', 'in_progress', 'approved', 'completed'] as ConsultationStatus[]).map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => updateParam('status', item)}
              className={`rounded-full px-2.5 py-1 text-[0.63rem] font-medium capitalize ${
                status === item ? 'bg-navy text-white' : 'bg-[#f6f9fc] text-[#708196] hover:bg-[#edf4fb]'
              }`}
            >
              {a(item.replaceAll('_', ' '))}
            </button>
          ))}
        </div>

        {filtersOpen && (
          <div className="grid gap-2 border-b border-[#e8eef5] bg-[#fbfcfe] p-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="grid gap-1">
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.06em] text-[#8b9bad]">{a("Service")}</span>
              <select className="admin-select" value={serviceId} onChange={(event) => updateParam('serviceId', event.target.value)}>
                <option value="">{a("All services")}</option>
                {site.data?.services.map((service) => (
                  <option key={service.id} value={service.id}>{locale === 'fa' ? service.title_fa : service.title_en}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.06em] text-[#8b9bad]">{a("Destination")}</span>
              <select className="admin-select" value={destinationId} onChange={(event) => updateParam('destinationId', event.target.value)}>
                <option value="">{a("All destinations")}</option>
                {site.data?.destinations.map((destination) => (
                  <option key={destination.id} value={destination.id}>{locale === 'fa' ? destination.name_fa : destination.name_en}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.06em] text-[#8b9bad]">{a("From")}</span>
              <input type="date" className="admin-input" value={from} onChange={(event) => updateParam('from', event.target.value)} />
            </label>
            <label className="grid gap-1">
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.06em] text-[#8b9bad]">{a("To")}</span>
              <input type="date" className="admin-input" value={to} onChange={(event) => updateParam('to', event.target.value)} />
            </label>
          </div>
        )}

        {query.isLoading ? (
          <AdminSpinner />
        ) : query.isError ? (
          <AdminError message="The requests could not be loaded." retry={() => void query.refetch()} />
        ) : !query.data || query.data.items.length === 0 ? (
          <TableEmpty label={a("No consultation requests match these filters.")} />
        ) : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{a("Reference")}</th>
                    <th>{a("Applicant")}</th>
                    <th>{a("Service / destination")}</th>
                    <th>{a("Contact")}</th>
                    <th>{a("Status")}</th>
                    <th>{a("Payment")}</th>
                    <th>{a("Submitted")}</th>
                  </tr>
                </thead>
                <tbody>
                  {query.data.items.map((request) => (
                    <tr key={request.id}>
                      <td data-label={a("Reference")}>
                        <Link to={`/admin/consultations/${request.id}`} className="font-mono text-[0.67rem] font-semibold text-blue">
                          {request.reference}
                        </Link>
                        {request.notes_count ? <span className="ms-1.5 text-[0.58rem] text-[#9aa9b9]">({request.notes_count} {locale === 'fa' ? 'یادداشت' : 'notes'})</span> : null}
                      </td>
                      <td data-label={a("Applicant")}>
                        <Link to={`/admin/consultations/${request.id}`} className="font-medium text-[#304a63] hover:text-blue">
                          {request.full_name}
                        </Link>
                        <div className="mt-0.5 text-[0.6rem] text-[#96a5b5]">{a(request.education_level?.replaceAll('_', ' ') || '—')}</div>
                      </td>
                      <td data-label={a("Service / destination")}>
                        <div className="text-[0.72rem]">{(locale === 'fa' ? request.service_title_fa : request.service_title_en) || '—'}</div>
                        <div className="mt-0.5 text-[0.6rem] text-[#96a5b5]">{(locale === 'fa' ? request.destination_name_fa : request.destination_name_en) || a('No destination')}</div>
                      </td>
                      <td data-label={a("Contact")}>
                        <div className="text-[0.68rem]">{request.email}</div>
                        <div className="mt-0.5 text-[0.6rem] text-[#96a5b5]">{request.phone}</div>
                      </td>
                      <td data-label={a("Status")}><StatusBadge status={request.status} /></td>
                      <td data-label={a("Payment")}><StatusBadge status={request.payment_status ?? '—'} /></td>
                      <td data-label={a("Submitted")} className="whitespace-nowrap text-[0.66rem]">
                        {new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-GB', { dateStyle: 'medium' }).format(new Date(request.created_at))}
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
              onChange={(nextPage) => updateParam('page', String(nextPage), false)}
            />
          </>
        )}
      </div>
    </>
  );
}
