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
import { AdminPageHeader } from './AdminLayout';
import { AdminError, AdminSpinner, StatusBadge } from './components';
import { useToast } from './Toast';

export function ConsultationDetailPage() {
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
    onError: (error) => setActionError(errorMessage(error, 'en')),
  });

  const noteMutation = useMutation({
    mutationFn: () => adminApi.addNote(numericId, note.trim()),
    onSuccess: () => {
      notify('Internal note added.');
      setNote('');
      setActionError('');
      void queryClient.invalidateQueries({ queryKey: ['admin-consultation', numericId] });
    },
    onError: (error) => setActionError(errorMessage(error, 'en')),
  });

  if (query.isLoading) return <AdminSpinner label="Loading request…" />;
  if (query.isError || !query.data) {
    return <AdminError message="This request could not be loaded." retry={() => void query.refetch()} />;
  }

  const { consultation, notes, payments } = query.data;
  const date = (value: string | null) =>
    value ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—';
  const amount = (minor: number, currency: string) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(minor / 100);

  return (
    <>
      <Link to="/admin/consultations" className="mb-4 inline-flex items-center gap-1.5 text-[0.68rem] font-medium text-[#7b8b9d] hover:text-navy">
        <ArrowLeft size={13} /> Back to consultations
      </Link>
      <AdminPageHeader
        title={consultation.reference}
        description={`Submitted ${date(consultation.created_at)} · ${consultation.source}`}
        action={<StatusBadge status={consultation.status} />}
      />

      {actionError && <div className="notice mb-4 border-red-200 bg-red-50 text-[0.72rem] text-red-800">{actionError}</div>}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-4">
          <div className="admin-card">
            <div className="flex items-center justify-between border-b border-[#e8eef5] px-5 py-3.5">
              <h3 className="text-[0.8rem] font-semibold text-navy">Applicant information</h3>
              <span className="flex items-center gap-1 text-[0.61rem] text-[#8e9eaf]"><ShieldCheck size={12} /> Private</span>
            </div>
            <dl className="grid gap-x-8 gap-y-4 p-5 sm:grid-cols-2">
              {[
                ['Full name', consultation.full_name],
                ['Email address', consultation.email],
                ['Phone number', consultation.phone],
                ['Preferred contact', consultation.contact_method],
                ['Service', consultation.service_title_en || '—'],
                ['Destination', consultation.destination_name_en || '—'],
                ['Education level', consultation.education_level || '—'],
                ['Preferred date', consultation.preferred_date || '—'],
                ['Privacy consent', consultation.privacy_consent ? 'Accepted' : 'Not recorded'],
                ['Last updated', date(consultation.updated_at)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[0.59rem] font-semibold uppercase tracking-[0.07em] text-[#93a2b4]">{label}</dt>
                  <dd className="mt-1.5 text-[0.78rem] font-medium capitalize text-[#304a63]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="admin-card">
            <div className="border-b border-[#e8eef5] px-5 py-3.5">
              <h3 className="text-[0.8rem] font-semibold text-navy">Applicant message</h3>
            </div>
            <div className="p-5">
              {consultation.message ? (
                <p className="whitespace-pre-wrap text-[0.78rem] leading-7 text-[#526980]">{consultation.message}</p>
              ) : (
                <p className="text-[0.75rem] text-[#93a2b4]">No additional information was provided.</p>
              )}
            </div>
          </div>

          <div className="admin-card">
            <div className="border-b border-[#e8eef5] px-5 py-3.5">
              <h3 className="text-[0.8rem] font-semibold text-navy">Payments</h3>
            </div>
            {payments.length === 0 ? (
              <p className="px-5 py-8 text-center text-[0.73rem] text-[#93a2b4]">No payments are associated with this request.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Package</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td data-label="Reference" className="font-mono text-[0.66rem]">{payment.reference}</td>
                        <td data-label="Package">{payment.package_name_en || '—'}</td>
                        <td data-label="Amount">{amount(payment.amount_minor, payment.currency)}</td>
                        <td data-label="Status"><StatusBadge status={payment.status} /></td>
                        <td data-label="Created" className="whitespace-nowrap">{date(payment.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="border-t border-[#eef2f7] px-5 py-3 text-[0.61rem] text-[#96a5b5]">
              Gateway results are immutable. Refunds are handled with the provider.
            </p>
          </div>

          <div className="admin-card">
            <div className="flex items-center justify-between border-b border-[#e8eef5] px-5 py-3.5">
              <div>
                <h3 className="text-[0.8rem] font-semibold text-navy">Internal notes</h3>
                <p className="mt-0.5 text-[0.6rem] text-[#96a5b5]">Visible only to authorised staff.</p>
              </div>
              <span className="tag tag-gray">{notes.length}</span>
            </div>
            <div className="grid gap-3 p-5">
              <label className="field">
                <span className="sr-only">Internal note</span>
                <textarea
                  className="admin-input !min-h-24"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Add a case note, next action or internal context…"
                  maxLength={5000}
                />
              </label>
              <div className="flex items-center justify-between">
                <span className="text-[0.6rem] text-[#9aa9b9]">{note.length}/5000 · never public</span>
                <button
                  type="button"
                  className="btn btn-dark btn-sm"
                  disabled={note.trim().length < 2 || noteMutation.isPending}
                  onClick={() => noteMutation.mutate()}
                >
                  <MessageSquareText size={13} /> {noteMutation.isPending ? 'Saving…' : 'Add note'}
                </button>
              </div>
              <div className="mt-1 grid gap-2">
                {notes.map((item) => (
                  <div key={item.id} className="rounded-lg border border-[#e8eef5] bg-[#fbfcfe] p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[0.65rem] font-semibold text-[#3b566f]">{item.admin_name || 'Administrator'}</span>
                      <span className="text-[0.59rem] text-[#96a5b5]">{date(item.created_at)}</span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-[0.73rem] leading-6 text-[#5d7186]">{item.note}</p>
                  </div>
                ))}
                {notes.length === 0 && <p className="py-4 text-center text-[0.7rem] text-[#9aa9b9]">No internal notes yet.</p>}
              </div>
            </div>
          </div>
        </div>

        <aside className="grid content-start gap-4">
          <div className="admin-card p-5">
            <h3 className="text-[0.8rem] font-semibold text-navy">Update status</h3>
            <p className="mt-1 text-[0.63rem] leading-5 text-[#8e9eaf]">Changes are recorded in the activity log.</p>
            <select className="admin-select mt-4 w-full capitalize" value={status} onChange={(event) => setStatus(event.target.value as ConsultationStatus)}>
              {CONSULTATION_STATUSES.map((item) => (
                <option key={item} value={item}>{item.replaceAll('_', ' ')}</option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-primary btn-sm mt-3 w-full"
              disabled={status === consultation.status || statusMutation.isPending}
              onClick={() => statusMutation.mutate()}
            >
              <Save size={13} /> {statusMutation.isPending ? 'Updating…' : 'Update status'}
            </button>
          </div>

          <div className="admin-card p-5">
            <h3 className="text-[0.8rem] font-semibold text-navy">Contact applicant</h3>
            <div className="mt-4 grid gap-2">
              <a href={`mailto:${consultation.email}?subject=${encodeURIComponent(`FaraTech consultation ${consultation.reference}`)}`} className="flex items-center gap-2 rounded-lg border border-[#e8eef5] px-3 py-2.5 text-[0.7rem] text-[#526980] hover:border-[#c7d8e8] hover:text-navy">
                <Mail size={14} className="text-blue" /> Email
              </a>
              <a href={`tel:${consultation.phone}`} className="flex items-center gap-2 rounded-lg border border-[#e8eef5] px-3 py-2.5 text-[0.7rem] text-[#526980] hover:border-[#c7d8e8] hover:text-navy">
                <Phone size={14} className="text-blue" /> Call
              </a>
              {consultation.contact_method === 'whatsapp' && (
                <a href={`https://wa.me/${consultation.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border border-[#e8eef5] px-3 py-2.5 text-[0.7rem] text-[#526980] hover:border-[#c7d8e8] hover:text-navy">
                  <MessageSquareText size={14} className="text-blue" /> WhatsApp
                </a>
              )}
            </div>
          </div>

          <div className="admin-card p-5">
            <h3 className="text-[0.8rem] font-semibold text-navy">Request metadata</h3>
            <dl className="mt-4 space-y-3 text-[0.68rem]">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-[#8e9eaf]">Reference</dt>
                <dd className="font-mono font-semibold text-[#304a63]">{consultation.reference}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-[#8e9eaf]">Submitted</dt>
                <dd className="text-end text-[#304a63]">{date(consultation.created_at)}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-[#8e9eaf]">Source</dt>
                <dd className="capitalize text-[#304a63]">{consultation.source}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-[#8e9eaf]">Consent</dt>
                <dd className="text-[#304a63]">{consultation.privacy_consent ? 'Recorded' : 'Missing'}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-[#f0d6b7] bg-[#fffaf3] p-4">
            <p className="flex items-start gap-2 text-[0.65rem] leading-5 text-[#7c5b3a]">
              <CreditCard size={13} className="mt-0.5 shrink-0" />
              Payment edits are blocked. Verified transactions can only be changed through the gateway or a documented refund process.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
