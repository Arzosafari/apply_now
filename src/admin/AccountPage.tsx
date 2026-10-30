import { useAdminTranslation } from './i18n';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { KeyRound, Loader2, LockKeyhole, Save, ShieldCheck } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { errorMessage } from '@/lib/errors';
import { usePageMeta } from '@/lib/seo';
import { useLocale } from '@/lib/i18n';
import { useAdminAuth } from './AuthContext';
import { AdminPageHeader } from './AdminLayout';
import { useToast } from './Toast';

export function AccountPage() {
  const a = useAdminTranslation();
  const { locale } = useLocale();
  const { admin } = useAdminAuth();
  const { notify } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  usePageMeta({ title: 'Account security', description: 'Change your admin password.', noindex: true });

  const mutation = useMutation({
    mutationFn: () => adminApi.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      notify('Demo only: no password was changed.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setFieldErrors({});
    },
    onError: (caught) => setError(errorMessage(caught, locale)),
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const errors: Record<string, string> = {};
    if (!currentPassword) errors.currentPassword = 'Enter your current password.';
    if (newPassword.length < 12) errors.newPassword = 'Use at least 12 characters.';
    else if (!/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      errors.newPassword = 'Include uppercase, lowercase and a number.';
    }
    if (confirmPassword !== newPassword) errors.confirmPassword = 'Passwords do not match.';
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    mutation.mutate();
  };

  return (
    <>
      <AdminPageHeader title={a("Account security")} description={a("Preview the account form. No authentication is connected.")} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <form className="admin-card p-5 sm:p-6" onSubmit={submit}>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#eef5fc] text-[#2f6b9f]">
              <KeyRound size={18} />
            </span>
            <div>
              <h3 className="text-[0.88rem] font-semibold text-navy">{a("Change password")}</h3>
              <p className="mt-0.5 text-[0.65rem] text-[#8a9aab]">{a("Demo only. Do not enter a real password.")}</p>
            </div>
          </div>

          {error && <div className="notice mt-5 border-red-200 bg-red-50 text-[0.72rem] text-red-800">{error}</div>}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="field sm:col-span-2">
              <span className="label">{a("Current password")}</span>
              <input
                type="password"
                dir="ltr"
                className="admin-input"
                autoComplete="current-password"
                aria-label={a('Current password')}
                aria-describedby={fieldErrors.currentPassword ? 'current-password-error' : undefined}
                value={currentPassword}
                onChange={(event) => { setCurrentPassword(event.target.value); setFieldErrors((errors) => ({ ...errors, currentPassword: '' })); }}
                aria-invalid={Boolean(fieldErrors.currentPassword)}
              />
              {fieldErrors.currentPassword && <span id="current-password-error" className="field-error">{a(fieldErrors.currentPassword)}</span>}
            </label>
            <label className="field">
              <span className="label">{a("New password")}</span>
              <input
                type="password"
                dir="ltr"
                className="admin-input"
                autoComplete="new-password"
                aria-label={a('New password')}
                aria-describedby="new-password-help"
                value={newPassword}
                onChange={(event) => { setNewPassword(event.target.value); setFieldErrors((errors) => ({ ...errors, newPassword: '' })); }}
                aria-invalid={Boolean(fieldErrors.newPassword)}
              />
              {fieldErrors.newPassword ? (
                <span id="new-password-help" className="field-error">{a(fieldErrors.newPassword)}</span>
              ) : (
                <span id="new-password-help" className="field-hint">{a("12+ characters, uppercase, lowercase and a number.")}</span>
              )}
            </label>
            <label className="field">
              <span className="label">{a("Confirm new password")}</span>
              <input
                type="password"
                dir="ltr"
                className="admin-input"
                autoComplete="new-password"
                aria-label={a('Confirm new password')}
                aria-describedby={fieldErrors.confirmPassword ? 'confirm-password-error' : undefined}
                value={confirmPassword}
                onChange={(event) => { setConfirmPassword(event.target.value); setFieldErrors((errors) => ({ ...errors, confirmPassword: '' })); }}
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
              />
              {fieldErrors.confirmPassword && <span id="confirm-password-error" className="field-error">{a(fieldErrors.confirmPassword)}</span>}
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-sm mt-6" disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {mutation.isPending ? a("Updating…") : a("Update password")}
          </button>
        </form>

        <div className="grid content-start gap-4">
          <div className="admin-card p-5">
            <h3 className="text-[0.8rem] font-semibold text-navy">{a("Signed-in account")}</h3>
            <dl className="mt-4 space-y-3 text-[0.7rem]">
              <div className="flex justify-between gap-3">
                <dt className="text-[#8e9eaf]">{a("Name")}</dt>
                <dd className="font-medium text-[#304a63]">{a(admin?.name || '')}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#8e9eaf]">{a("Email")}</dt>
                <dd className="text-[#304a63]">{admin?.email}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#8e9eaf]">{a("Role")}</dt>
                <dd className="capitalize text-[#304a63]">{a(admin?.role || '')}</dd>
              </div>
            </dl>
          </div>

          <div className="admin-card p-5">
            <LockKeyhole size={18} className="text-[#3b75a8]" />
            <h3 className="mt-3 text-[0.8rem] font-semibold text-navy">{a("Session safeguards")}</h3>
            <ul className="mt-3 space-y-2.5 text-[0.66rem] leading-5 text-[#71839a]">
              <li className="flex gap-2"><ShieldCheck size={13} className="mt-0.5 shrink-0 text-emerald-500" />{a(" This interface does not provide real authentication.")}</li>
              <li className="flex gap-2"><ShieldCheck size={13} className="mt-0.5 shrink-0 text-emerald-500" />{a(" The demo session is stored only in this browser tab.")}</li>
              <li className="flex gap-2"><ShieldCheck size={13} className="mt-0.5 shrink-0 text-emerald-500" />{a(" Real security controls must be implemented in the backend stage.")}</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
