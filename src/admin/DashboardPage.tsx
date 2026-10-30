import { useAdminTranslation } from './i18n';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  CalendarPlus,
  CircleDollarSign,
  Clock3,
  FilePlus2,
  Globe2,
  MessageSquareText,
  Settings,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { adminApi } from '@/lib/api';
import { usePageMeta } from '@/lib/seo';
import { useSiteData } from '@/lib/site';
import { useLocale } from '@/lib/i18n';
import { AdminPageHeader } from './AdminLayout';
import { AdminError, AdminSpinner, StatusBadge } from './components';

function shortDate(value: string, locale = 'en') {
  return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-GB', { day: '2-digit', month: 'short' }).format(new Date(value));
}

function money(minor: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(minor / 100);
  } catch {
    return `${currency} ${(minor / 100).toLocaleString()}`;
  }
}

export function DashboardPage() {
  const a = useAdminTranslation();
  const { locale } = useLocale();
  const query = useQuery({ queryKey: ['admin-stats'], queryFn: adminApi.stats, retry: false });
  const site = useSiteData();
  usePageMeta({ title: 'Admin dashboard', description: 'FaraTech operations dashboard.', noindex: true });

  if (query.isLoading) return <AdminSpinner label={a("Loading dashboard…")} />;
  if (query.isError || !query.data) {
    return <AdminError message="Dashboard data could not be loaded." retry={() => void query.refetch()} />;
  }
  const data = query.data;
  const cards = [
    { label: 'Total requests', value: data.consultations.total, icon: MessageSquareText, tint: 'bg-[#eef6ff] text-[#2d6daa]' },
    { label: 'Pending review', value: data.consultations.pending, icon: Clock3, tint: 'bg-amber-50 text-amber-600' },
    { label: 'Approved', value: data.consultations.approved, icon: BadgeCheck, tint: 'bg-emerald-50 text-emerald-600' },
    { label: 'Rejected', value: data.consultations.rejected, icon: FilePlus2, tint: 'bg-red-50 text-red-600' },
    { label: 'Published articles', value: data.content.articlesPublished, icon: BookOpenText, tint: 'bg-violet-50 text-violet-600' },
    { label: 'Services', value: data.content.services, icon: TrendingUp, tint: 'bg-sky-50 text-sky-600' },
    { label: 'Destinations', value: data.content.destinations, icon: Globe2, tint: 'bg-teal-50 text-teal-600' },
    {
      label: 'Sample payment value',
      value: money(data.payments.successfulAmountMinor, data.payments.currency),
      icon: CircleDollarSign,
      tint: 'bg-orange-50 text-orange-600',
    },
  ];

  return (
    <>
      <AdminPageHeader
        title={a("Dashboard")}
        description={a("A local preview of enquiries, content and sample payments.")}
        action={
          <Link to="/admin/consultations" className="btn btn-dark btn-sm">{a(" View requests ")}<ArrowRight size={13} />
          </Link>
        }
      />

      {site.data && !site.data.contentVerified && (
        <div className="mb-5 flex flex-col justify-between gap-3 rounded-xl border border-[#f1d6b8] bg-[#fffaf3] p-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-orange/15 text-orange-600">
              <Settings size={15} />
            </span>
            <div>
              <p className="text-[0.76rem] font-semibold text-[#6b4a2d]">{a("Frontend demonstration workspace")}</p>
              <p className="mt-0.5 text-[0.68rem] leading-5 text-[#8b6c4e]">{a(" All records are examples or browser-local changes. No backend, real authentication or payments are connected. ")}</p>
            </div>
          </div>
          <Link to="/admin/settings" className="btn btn-outline btn-sm shrink-0 border-[#e5c8a9] text-[#6b4a2d]">{a(" Review settings ")}</Link>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div className="stat-card" key={card.label}>
            <div>
              <div className="stat-card-value">{card.value}</div>
              <div className="stat-card-label">{a(card.label)}</div>
            </div>
            <span className={`stat-card-icon ${card.tint}`}>
              <card.icon size={17} />
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_0.85fr]">
        <div className="admin-card">
          <div className="flex items-center justify-between border-b border-[#e8eef5] px-5 py-4">
            <div>
              <h3 className="text-[0.82rem] font-semibold text-navy">{a("Consultation requests")}</h3>
              <p className="mt-0.5 text-[0.64rem] text-[#8a9aab]">{a("Last 14 days")}</p>
            </div>
            <span className="tag tag-gray">{a("Demo data")}</span>
          </div>
          <div className="h-[260px] px-2 pb-3 pt-5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.consultationsByDay} margin={{ top: 5, right: 14, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="consultationsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#164B82" stopOpacity={0.24} />
                    <stop offset="100%" stopColor="#164B82" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value: string) => shortDate(value, locale)}
                  tick={{ fontSize: 9, fill: '#91a1b3' }}
                  axisLine={false}
                  tickLine={false}
                  interval={2}
                />
                <YAxis tick={{ fontSize: 9, fill: '#91a1b3' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e4ebf3', fontSize: 11, boxShadow: '0 10px 30px rgba(9,38,74,.08)' }}
                  labelFormatter={(value) => new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-GB', { dateStyle: 'medium' }).format(new Date(String(value)))}
                />
                <Area type="monotone" dataKey="count" name="Requests" stroke="#164B82" strokeWidth={2} fill="url(#consultationsFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-card">
          <div className="border-b border-[#e8eef5] px-5 py-4">
            <h3 className="text-[0.82rem] font-semibold text-navy">{a("Quick actions")}</h3>
            <p className="mt-0.5 text-[0.64rem] text-[#8a9aab]">{a("Common tasks")}</p>
          </div>
          <div className="grid gap-1.5 p-3">
            {[
              { to: '/admin/consultations', label: 'Review new requests', icon: MessageSquareText, hint: `${data.consultations.pending} ${locale === 'fa' ? 'در انتظار' : 'pending'}` },
              { to: '/admin/articles', label: 'Write an article', icon: BookOpenText, hint: `${data.content.articlesDraft} ${locale === 'fa' ? 'پیش‌نویس' : 'drafts'}` },
              { to: '/admin/services', label: 'Update a service', icon: TrendingUp, hint: `${data.content.services} ${locale === 'fa' ? 'نمونه' : 'demo'}` },
              { to: '/admin/destinations', label: 'Manage destinations', icon: Globe2, hint: `${data.content.destinations} ${locale === 'fa' ? 'نمونه' : 'demo'}` },
              { to: '/admin/settings', label: 'Site settings', icon: Settings, hint: 'Brand & contact' },
            ].map((item) => (
              <Link key={item.to} to={item.to} className="flex items-center gap-3 rounded-lg px-2.5 py-2.5 transition hover:bg-[#f7fafd]">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#eef5fc] text-[#346b9f]">
                  <item.icon size={15} />
                </span>
                <span className="flex-1 text-[0.73rem] font-medium text-[#40566c]">{a(item.label)}</span>
                <span className="text-[0.61rem] text-[#9aa9b9]">{a(item.hint)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_0.85fr]">
        <div className="admin-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#e8eef5] px-5 py-4">
            <div>
              <h3 className="text-[0.82rem] font-semibold text-navy">{a("Recent consultation requests")}</h3>
              <p className="mt-0.5 text-[0.64rem] text-[#8a9aab]">{a("Example requests and local form entries")}</p>
            </div>
            <Link to="/admin/consultations" className="text-[0.65rem] font-medium text-blue hover:text-orange-600">{a(" View all ")}</Link>
          </div>
          {data.recentConsultations.length === 0 ? (
            <div className="px-6 py-14 text-center text-[0.74rem] text-[#8796a8]">{a("No consultation requests yet.")}</div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{a("Reference")}</th>
                    <th>{a("Applicant")}</th>
                    <th>{a("Service")}</th>
                    <th>{a("Status")}</th>
                    <th>{a("Submitted")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentConsultations.map((request) => (
                    <tr key={request.id}>
                      <td data-label={a("Reference")}>
                        <Link to={`/admin/consultations/${request.id}`} className="font-mono text-[0.68rem] font-semibold text-blue">
                          {request.reference}
                        </Link>
                      </td>
                      <td data-label={a("Applicant")}>
                        <div className="font-medium text-[#304a63]">{request.full_name}</div>
                        <div className="mt-0.5 text-[0.6rem] text-[#96a5b5]">{request.email}</div>
                      </td>
                      <td data-label={a("Service")}>{(locale === 'fa' ? request.service_title_fa : request.service_title_en) || '—'}</td>
                      <td data-label={a("Status")}><StatusBadge status={request.status} /></td>
                      <td data-label={a("Submitted")} className="whitespace-nowrap">
                        {new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-GB', { dateStyle: 'medium' }).format(new Date(request.created_at))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="admin-card">
          <div className="border-b border-[#e8eef5] px-5 py-4">
            <h3 className="text-[0.82rem] font-semibold text-navy">{a("Recent activity")}</h3>
            <p className="mt-0.5 text-[0.64rem] text-[#8a9aab]">{a("Local demonstration changes")}</p>
          </div>
          <div className="divide-y divide-[#eff3f8]">
            {data.recentActivity.map((entry) => (
              <div key={entry.id} className="flex items-start gap-2.5 px-5 py-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8bb4d9]" />
                <div className="min-w-0">
                  <p className="text-[0.69rem] font-medium capitalize text-[#425b73]">{a(entry.action.replaceAll('_', ' '))}</p>
                  <p className="mt-0.5 text-[0.61rem] text-[#98a7b7]">
                    {a(entry.entity_type.replaceAll('_', ' '))} · {a(entry.admin_name || 'System')} ·{' '}
                    {new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(entry.created_at))}
                  </p>
                </div>
              </div>
            ))}
            {data.recentActivity.length === 0 && <p className="px-5 py-10 text-center text-[0.72rem] text-[#98a7b7]">{a("No activity yet.")}</p>}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Unread messages', value: data.unreadMessages, to: '/admin/messages', icon: MessageSquareText },
          { label: 'Pending payments', value: data.payments.pendingCount, to: '/admin/payments', icon: CircleDollarSign },
          { label: 'Packages', value: data.content.packages, to: '/admin/packages', icon: CalendarPlus },
          { label: 'Team profiles', value: data.content.experts, to: '/admin/experts', icon: Users },
        ].map((item) => (
          <Link key={item.label} to={item.to} className="admin-card flex items-center gap-3 p-4 transition hover:border-[#c9d9e8]">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#f1f6fb] text-[#4a769e]"><item.icon size={16} /></span>
            <div>
              <div className="text-lg font-bold text-navy">{item.value}</div>
              <div className="text-[0.63rem] text-[#8292a5]">{a(item.label)}</div>
            </div>
            <ArrowRight size={13} className="ms-auto text-[#a8b6c5]" />
          </Link>
        ))}
      </div>
    </>
  );
}
