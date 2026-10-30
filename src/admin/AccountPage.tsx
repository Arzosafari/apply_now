import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { KeyRound, Loader2, LockKeyhole, Save, ShieldCheck } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { errorMessage } from '@/lib/errors';
import { usePageMeta } from '@/lib/seo';
import { useAdminAuth } from './AuthContext';
import { AdminPageHeader } from './AdminLayout';
import { useToast } from './Toast';

export function AccountPage() {
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
      notify('Password changed. Other sessions have been signed out.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setFieldErrors({});
    },
    onError: (caught) => setError(errorMessage(caught, 'en')),
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
      <AdminPageHeader title="Account security" description="Manage your administrator credentials and review session safeguards." />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <form className="admin-card p-5 sm:p-6" onSubmit={submit}>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#eef5fc] text-[#2f6b9f]">
              <KeyRound size={18} />
            </span>
            <div>
              <h3 className="text-[0.88rem] font-semibold text-navy">Change password</h3>
              <p className="mt-0.5 text-[0.65rem] text-[#8a9aab]">Other active sessions will be signed out.</p>
            </div>
          </div>

          {error && <div className="notice mt-5 border-red-200 bg-red-50 text-[0.72rem] text-red-800">{error}</div>}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="field sm:col-span-2">
              <span className="label">Current password</span>
              <input
                type="password"
                dir="ltr"
                className="admin-input"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                aria-invalid={Boolean(fieldErrors.currentPassword)}
              />
              {fieldErrors.currentPassword && <span className="field-error">{fieldErrors.currentPassword}</span>}
            </label>
            <label className="field">
              <span className="label">New password</span>
              <input
                type="password"
                dir="ltr"
                className="admin-input"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                aria-invalid={Boolean(fieldErrors.newPassword)}
              />
              {fieldErrors.newPassword ? (
                <span className="field-error">{fieldErrors.newPassword}</span>
              ) : (
                <span className="field-hint">12+ characters, uppercase, lowercase and a number.</span>
              )}
            </label>
            <label className="field">
              <span className="label">Confirm new password</span>
              <input
                type="password"
                dir="ltr"
                className="admin-input"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
              />
              {fieldErrors.confirmPassword && <span className="field-error">{fieldErrors.confirmPassword}</span>}
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-sm mt-6" disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {mutation.isPending ? 'Updating…' : 'Update password'}
          </button>
        </form>

        <div className="grid content-start gap-4">
          <div className="admin-card p-5">
            <h3 className="text-[0.8rem] font-semibold text-navy">Signed-in account</h3>
            <dl className="mt-4 space-y-3 text-[0.7rem]">
              <div className="flex justify-between gap-3">
                <dt className="text-[#8e9eaf]">Name</dt>
                <dd className="font-medium text-[#304a63]">{admin?.name}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#8e9eaf]">Email</dt>
                <dd className="text-[#304a63]">{admin?.email}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#8e9eaf]">Role</dt>
                <dd className="capitalize text-[#304a63]">{admin?.role}</dd>
              </div>
            </dl>
          </div>

          <div className="admin-card p-5">
            <LockKeyhole size={18} className="text-[#3b75a8]" />
            <h3 className="mt-3 text-[0.8rem] font-semibold text-navy">Session safeguards</h3>
            <ul className="mt-3 space-y-2.5 text-[0.66rem] leading-5 text-[#71839a]">
              <li className="flex gap-2"><ShieldCheck size={13} className="mt-0.5 shrink-0 text-emerald-500" /> Passwords are hashed with bcrypt; plaintext is never stored.</li>
              <li className="flex gap-2"><ShieldCheck size={13} className="mt-0.5 shrink-0 text-emerald-500" /> Session tokens are HttpOnly and stored as hashes server-side.</li>
              <li className="flex gap-2"><ShieldCheck size={13} className="mt-0.5 shrink-0 text-emerald-500" /> State-changing requests require a per-session CSRF token.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
