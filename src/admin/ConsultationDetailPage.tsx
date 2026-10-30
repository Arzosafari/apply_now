import { useAdminTranslation } from './i18n';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Mail,
  MessageSquareText,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import type { ConsultationStatus } from '@shared/types';
import { CONSULTATION_STATUSES } from '@shared/types';
import { adminApi } from '@/lib/api';
import { errorMessage } from '@/lib/errors';
import { usePageMeta } from '@/lib/seo';
import { useLocale } from '@/lib/i18n';
import { AdminPageHeader } from './AdminLayout';
import { AdminError, AdminSpinner, StatusBadge } from './components';
import { useToast } from './Toast';

export function ConsultationDetailPage() {
  const a = useAdminTranslation();
  const { locale } = useLocale();
  const { id = '' } = useParams();
  const numericId = Number(id);
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const [status, setStatus] = useState<ConsultationStatus>('pending');
  const [note, setNote] = useState('');
  const [actionError, setActionError] = useState('');

  usePageMeta({ title: 'Consultation detail', description: 'Consultation request details.', noindex: true });

  const query = useQuery({
    queryKey: ['admin-consultation', numericId],
    queryFn: () => adminApi.consultation(numericId),
    enabled: Number.isInteger(numericId) && numericId > 0,
    retry: false,
  });

  useEffect(() => {
    if (query.data) setStatus(query.data.consultation.status);
  }, [query.data]);

  const statusMutation = useMutation({
    mutationFn: () => adminApi.updateConsultationStatus(numericId, status),
    onSuccess: () => {
      notify('Status updated.');
      setActionError('');
      void queryClient.invalidateQueries({ queryKey: ['admin-consultation', numericId] });
      void queryClient.invalidateQueries({ queryKey: ['admin-consultations'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (error) => setActionError(errorMessage(error, locale)),
  });

  const noteMutation = useMutation({
    mutationFn: () => adminApi.addNote(numericId, note.trim()),
    onSuccess: () => {
      notify('Internal note added.');
      setNote('');
      setActionError('');
      void queryClient.invalidateQueries({ queryKey: ['admin-consultation', numericId] });
    },
    onError: (error) => setActionError(errorMessage(error, locale)),
  });

  if (query.isLoading) return <AdminSpinner label={a("Loading request…")} />;
  if (query.isError || !query.data) {
    return <AdminError message="This request could not be loaded." retry={() => void query.refetch()} />;
  }

  const { consultation, notes, payments } = query.data;
  const date = (value: string | null) =>
    value ? new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—';
  const amount = (minor: number, currency: string) =>
    new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(minor / 100);

  return (
    <>
      <Link to="/admin/consultations" className="mb-4 inline-flex items-center gap-1.5 text-[0.68rem] font-medium text-[#7b8b9d] hover:text-navy">
        <ArrowLeft size={13} />{a(" Back to consultations ")}</Link>
      <AdminPageHeader
        title={consultation.reference}
        description={`${a("Submitted")} ${date(consultation.created_at)} · ${a(consultation.source)}`}
        action={<StatusBadge status={consultation.status} />}
      />

      {actionError && <div className="notice mb-4 border-red-200 bg-red-50 text-[0.72rem] text-red-800">{actionError}</div>}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-4">
          <div className="admin-card">
            <div className="flex items-center justify-between border-b border-[#e8eef5] px-5 py-3.5">
              <h3 className="text-[0.8rem] font-semibold text-navy">{a("Applicant information")}</h3>
              <span className="flex items-center gap-1 text-[0.61rem] text-[#8e9eaf]"><ShieldCheck size={12} />{a(" Demo record")}</span>
            </div>
            <dl className="grid gap-x-8 gap-y-4 p-5 sm:grid-cols-2">
              {[
                ['Full name', consultation.full_name],
                ['Email address', consultation.email],
                ['Phone number', consultation.phone],
                ['Preferred contact', consultation.contact_method],
                ['Service', (locale === 'fa' ? consultation.service_title_fa : consultation.service_title_en) || '—'],
                ['Destination', (locale === 'fa' ? consultation.destination_name_fa : consultation.destination_name_en) || '—'],
                ['Education level', consultation.education_level?.replaceAll('_', ' ') || '—'],
                ['Preferred date', consultation.preferred_date || '—'],
                ['Privacy consent', consultation.privacy_consent ? a("Accepted") : a("Not recorded")],
                ['Last updated', date(consultation.updated_at)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[0.59rem] font-semibold uppercase tracking-[0.07em] text-[#93a2b4]">{a(label)}</dt>
                  <dd className="mt-1.5 text-[0.78rem] font-medium capitalize text-[#304a63]">{a(value)}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="admin-card">
            <div className="border-b border-[#e8eef5] px-5 py-3.5">
              <h3 className="text-[0.8rem] font-semibold text-navy">{a("Applicant message")}</h3>
            </div>
            <div className="p-5">
              {consultation.message ? (
                <p className="whitespace-pre-wrap text-[0.78rem] leading-7 text-[#526980]">{a(consultation.message)}</p>
              ) : (
                <p className="text-[0.75rem] text-[#93a2b4]">{a("No additional information was provided.")}</p>
              )}
            </div>
          </div>

          <div className="admin-card">
            <div className="border-b border-[#e8eef5] px-5 py-3.5">
              <h3 className="text-[0.8rem] font-semibold text-navy">{a("Payments")}</h3>
            </div>
            {payments.length === 0 ? (
              <p className="px-5 py-8 text-center text-[0.73rem] text-[#93a2b4]">{a("No payments are associated with this request.")}</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{a("Reference")}</th>
                      <th>{a("Package")}</th>
                      <th>{a("Amount")}</th>
                      <th>{a("Status")}</th>
                      <th>{a("Created")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td data-label={a("Reference")} className="font-mono text-[0.66rem]">{payment.reference}</td>
                        <td data-label={a("Package")}>{(locale === 'fa' ? payment.package_name_fa : payment.package_name_en) || '—'}</td>
                        <td data-label={a("Amount")}>{amount(payment.amount_minor, payment.currency)}</td>
                        <td data-label={a("Status")}><StatusBadge status={payment.status} /></td>
                        <td data-label={a("Created")} className="whitespace-nowrap">{date(payment.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="border-t border-[#eef2f7] px-5 py-3 text-[0.61rem] text-[#96a5b5]">{a(" These are sample records only. No payment was processed. ")}</p>
          </div>

          <div className="admin-card">
            <div className="flex items-center justify-between border-b border-[#e8eef5] px-5 py-3.5">
              <div>
                <h3 className="text-[0.8rem] font-semibold text-navy">{a("Internal notes")}</h3>
                <p className="mt-0.5 text-[0.6rem] text-[#96a5b5]">{a("Stored locally in this browser; not secure.")}</p>
              </div>
              <span className="tag tag-gray">{notes.length}</span>
            </div>
            <div className="grid gap-3 p-5">
              <label className="field">
                <span className="sr-only">{a("Internal note")}</span>
                <textarea
                  className="admin-input !min-h-24"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder={a("Add a case note, next action or internal context…")}
                  maxLength={5000}
                />
              </label>
              <div className="flex items-center justify-between">
                <span className="text-[0.6rem] text-[#9aa9b9]">{note.length}{a("/5000 · local demo only")}</span>
                <button
                  type="button"
                  className="btn btn-dark btn-sm"
                  disabled={note.trim().length < 2 || noteMutation.isPending}
                  onClick={() => noteMutation.mutate()}
                >
                  <MessageSquareText size={13} /> {noteMutation.isPending ? a("Saving…") : a("Add note")}
                </button>
              </div>
              <div className="mt-1 grid gap-2">
                {notes.map((item) => (
                  <div key={item.id} className="rounded-lg border border-[#e8eef5] bg-[#fbfcfe] p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[0.65rem] font-semibold text-[#3b566f]">{a(item.admin_name || 'Administrator')}</span>
                      <span className="text-[0.59rem] text-[#96a5b5]">{date(item.created_at)}</span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-[0.73rem] leading-6 text-[#5d7186]">{item.note}</p>
                  </div>
                ))}
                {notes.length === 0 && <p className="py-4 text-center text-[0.7rem] text-[#9aa9b9]">{a("No internal notes yet.")}</p>}
              </div>
            </div>
          </div>
        </div>

        <aside className="grid content-start gap-4">
          <div className="admin-card p-5">
            <h3 className="text-[0.8rem] font-semibold text-navy">{a("Update status")}</h3>
            <p className="mt-1 text-[0.63rem] leading-5 text-[#8e9eaf]">{a("Changes are recorded in the activity log.")}</p>
            <select className="admin-select mt-4 w-full capitalize" aria-label={a('Update status')} value={status} onChange={(event) => setStatus(event.target.value as ConsultationStatus)}>
              {CONSULTATION_STATUSES.map((item) => (
                <option key={item} value={item}>{a(item.replaceAll('_', ' '))}</option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-primary btn-sm mt-3 w-full"
              disabled={status === consultation.status || statusMutation.isPending}
              onClick={() => statusMutation.mutate()}
            >
              <Save size={13} /> {statusMutation.isPending ? a("Updating…") : a("Update status")}
            </button>
          </div>

          <div className="admin-card p-5">
            <h3 className="text-[0.8rem] font-semibold text-navy">{a("Contact applicant")}</h3>
            <div className="mt-4 grid gap-2">
              <a href={`mailto:${consultation.email}?subject=${encodeURIComponent(`Apply Now consultation ${consultation.reference}`)}`} className="flex items-center gap-2 rounded-lg border border-[#e8eef5] px-3 py-2.5 text-[0.7rem] text-[#526980] hover:border-[#c7d8e8] hover:text-navy">
                <Mail size={14} className="text-blue" />{a(" Email ")}</a>
              <a href={`tel:${consultation.phone}`} className="flex items-center gap-2 rounded-lg border border-[#e8eef5] px-3 py-2.5 text-[0.7rem] text-[#526980] hover:border-[#c7d8e8] hover:text-navy">
                <Phone size={14} className="text-blue" />{a(" Call ")}</a>
              {consultation.contact_method === 'whatsapp' && (
                <a href={`https://wa.me/${consultation.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border border-[#e8eef5] px-3 py-2.5 text-[0.7rem] text-[#526980] hover:border-[#c7d8e8] hover:text-navy">
                  <MessageSquareText size={14} className="text-blue" />{a(" WhatsApp ")}</a>
              )}
            </div>
          </div>

          <div className="admin-card p-5">
            <h3 className="text-[0.8rem] font-semibold text-navy">{a("Request metadata")}</h3>
            <dl className="mt-4 space-y-3 text-[0.68rem]">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-[#8e9eaf]">{a("Reference")}</dt>
                <dd className="font-mono font-semibold text-[#304a63]">{consultation.reference}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-[#8e9eaf]">{a("Submitted")}</dt>
                <dd className="text-end text-[#304a63]">{date(consultation.created_at)}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-[#8e9eaf]">{a("Source")}</dt>
                <dd className="capitalize text-[#304a63]">{a(consultation.source)}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-[#8e9eaf]">{a("Consent")}</dt>
                <dd className="text-[#304a63]">{consultation.privacy_consent ? a("Recorded") : a("Missing")}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-[#f0d6b7] bg-[#fffaf3] p-4">
            <p className="flex items-start gap-2 text-[0.65rem] leading-5 text-[#7c5b3a]">
              <CreditCard size={13} className="mt-0.5 shrink-0" />{a(" Payment records are illustrative and read-only. No real transaction has taken place. ")}</p>
          </div>
        </aside>
      </div>
    </>
  );
}
