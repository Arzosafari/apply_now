import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { errorMessage } from '@/lib/errors';
import { usePageMeta } from '@/lib/seo';
import { useAdminAuth } from './AuthContext';

export function AdminLoginPage() {
  const { admin, login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  usePageMeta({ title: 'Admin sign in', description: 'Authorised FaraTech staff sign-in.', noindex: true });

  if (admin) return <Navigate to="/admin" replace />;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from && from.startsWith('/admin') ? from : '/admin', { replace: true });
    } catch (caught) {
      setError(errorMessage(caught, 'en'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <div className="grid min-h-screen lg:grid-cols-[1.02fr_0.98fr]">
        <div className="relative hidden overflow-hidden bg-navy lg:block">
          <img className="absolute inset-0 h-full w-full object-cover opacity-30" src="/images/hero-city.jpg" alt="" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/75 via-navy/90 to-deep-navy" />
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 70% 10%, rgba(255,134,31,.3), transparent 32%)' }} />
          <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
            <Logo light />
            <div className="max-w-md">
              <div className="eyebrow eyebrow-light">Operations portal</div>
              <h1 className="mt-5 font-display text-[2.7rem] font-bold leading-[1.08] tracking-[-0.045em] text-white">
                The work behind every clear answer.
              </h1>
              <p className="mt-5 text-[0.88rem] leading-7 text-white/55">
                Manage consultations, services, destinations and content from one private workspace. Every change is logged.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                {[
                  { icon: ShieldCheck, label: 'Role-based access' },
                  { icon: LockKeyhole, label: 'HttpOnly sessions' },
                ].map((item) => (
                  <span key={item.label} className="inline-flex items-center gap-2 text-[0.68rem] text-white/55">
                    <item.icon size={14} className="text-orange" /> {item.label}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-[0.6rem] text-white/30">© {new Date().getFullYear()} FaraTech Global Mobility</p>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-10 sm:px-10">
          <div className="w-full max-w-[390px]">
            <div className="mb-8 lg:hidden">
              <Logo />
            </div>
            <div className="mb-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e3ebf3] bg-white px-3 py-1.5 text-[0.62rem] font-semibold text-[#62768b]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Staff access only
              </div>
              <h2 className="mt-5 font-display text-[1.85rem] font-bold tracking-[-0.04em] text-navy">Welcome back</h2>
              <p className="mt-2 text-[0.8rem] leading-6 text-[#7b8b9d]">Sign in to manage FaraTech operations.</p>
            </div>

            <form onSubmit={(event) => void submit(event)} className="rounded-2xl border border-[#e2eaf2] bg-white p-6 shadow-[0_30px_70px_-50px_rgba(9,38,74,.4)] sm:p-7">
              <div className="field">
                <label className="label" htmlFor="admin-email">Email address</label>
                <input
                  id="admin-email"
                  type="email"
                  dir="ltr"
                  className="input"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@faratech.example"
                />
              </div>
              <div className="field mt-4">
                <label className="label" htmlFor="admin-password">Password</label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    dir="ltr"
                    className="input !pe-11"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-[#8a9caf] hover:text-navy"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && <div className="notice mt-4 border-red-200 bg-red-50 text-[0.72rem] text-red-800" role="alert">{error}</div>}

              <button type="submit" className="btn btn-primary mt-6 w-full" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in securely'}
                {!loading && <ArrowRight size={15} />}
              </button>

              <p className="mt-5 flex items-start gap-2 text-[0.64rem] leading-5 text-[#8999aa]">
                <LockKeyhole size={12} className="mt-0.5 shrink-0" />
                Sessions expire automatically. Initial credentials are configured in the environment and should be changed after first sign-in.
              </p>
            </form>
            <a href="/" className="mt-6 inline-flex items-center gap-1.5 text-[0.7rem] font-medium text-[#73879c] hover:text-navy">
              ← Back to website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
