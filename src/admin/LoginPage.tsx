import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { errorMessage } from '@/lib/errors';
import { usePageMeta } from '@/lib/seo';
import { useLocale } from '@/lib/i18n';
import { useAdminAuth } from './AuthContext';

export function AdminLoginPage() {
  const { admin, login } = useAdminAuth();
  const { locale, switchLocale } = useLocale();
  const fa = locale === 'fa';
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('demo@applynow.example');
  const [password, setPassword] = useState('demo');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  usePageMeta({ title: fa ? 'ورود نمایشی مدیریت' : 'Demo admin sign in', description: fa ? 'پیش‌نمایش محلی بدون احراز هویت واقعی.' : 'Browser-local management preview without real authentication.', noindex: true });

  const from = (location.state as { from?: string } | null)?.from;
  const destination = from && from.startsWith('/admin/') && !from.startsWith('/admin/login') ? from : '/admin';
  if (admin) return <Navigate to={destination} replace />;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(destination, { replace: true });
    } catch (caught) {
      setError(errorMessage(caught, locale));
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
              <div className="eyebrow eyebrow-light">{fa ? 'پنل مدیریت نمایشی' : 'Demonstration workspace'}</div>
              <h1 className="mt-5 font-display text-[2.7rem] font-bold leading-[1.08] tracking-[-0.045em] text-white">
                {fa ? 'فضایی روشن برای مدیریت هر مسیر.' : 'The work behind every clear answer.'}
              </h1>
              <p className="mt-5 text-[0.88rem] leading-7 text-white/55">
                {fa ? 'درخواست‌ها، خدمات، مقاصد و محتوا را در یک پیش‌نمایش محلی بررسی کنید.' : 'Explore consultations, services, destinations and content in a browser-local preview.'}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                {[
                  { icon: ShieldCheck, label: fa ? 'فقط داده نمونه' : 'Sample data only' },
                  { icon: LockKeyhole, label: fa ? 'بدون احراز هویت واقعی' : 'No real authentication' },
                ].map((item) => (
                  <span key={item.label} className="inline-flex items-center gap-2 text-[0.68rem] text-white/55">
                    <item.icon size={14} className="text-orange" /> {item.label}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-[0.6rem] text-white/30">© {new Date().getFullYear()} Apply Now Immigration Group</p>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-10 sm:px-10">
          <div className="w-full max-w-[390px]">
            <div className="mb-8 lg:hidden">
              <Logo />
            </div>
            <div className="mb-6 flex justify-end"><div className="lang-switch" aria-label={fa ? 'زبان' : 'Language'}><button type="button" aria-pressed={!fa} onClick={() => fa && switchLocale()}>EN</button><button type="button" aria-pressed={fa} onClick={() => !fa && switchLocale()}>FA</button></div></div>
            <div className="mb-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e3ebf3] bg-white px-3 py-1.5 text-[0.62rem] font-semibold text-[#62768b]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {fa ? 'فقط پیش‌نمایش' : 'Frontend preview only'}
              </div>
              <h2 className="mt-5 font-display text-[1.85rem] font-bold tracking-[-0.04em] text-navy">{fa ? 'خوش آمدید' : 'Welcome back'}</h2>
              <p className="mt-2 text-[0.8rem] leading-6 text-[#7b8b9d]">{fa ? 'برای مشاهده پنل نمایشی وارد شوید.' : 'Enter the demonstration management workspace.'}</p>
            </div>

            <form onSubmit={(event) => void submit(event)} className="rounded-2xl border border-[#e2eaf2] bg-white p-6 shadow-[0_30px_70px_-50px_rgba(9,38,74,.4)] sm:p-7">
              <div className="field">
                <label className="label" htmlFor="admin-email">{fa ? 'ایمیل نمونه' : 'Demo email'}</label>
                <input
                  id="admin-email"
                  type="email"
                  dir="ltr"
                  className="input"
                  autoComplete="off"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@applynow.example"
                />
              </div>
              <div className="field mt-4">
                <label className="label" htmlFor="admin-password">{fa ? 'رمز نمونه' : 'Demo password'}</label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    dir="ltr"
                    className="input !pe-11"
                    autoComplete="off"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-[#8a9caf] hover:text-navy"
                    aria-label={showPassword ? (fa ? 'پنهان کردن رمز' : 'Hide password') : (fa ? 'نمایش رمز' : 'Show password')}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && <div className="notice mt-4 border-red-200 bg-red-50 text-[0.72rem] text-red-800" role="alert">{error}</div>}

              <button type="submit" className="btn btn-primary mt-6 w-full" disabled={loading}>
                {loading ? (fa ? 'در حال ورود…' : 'Opening…') : (fa ? 'ورود به پنل نمایشی' : 'Enter demo workspace')}
                {!loading && <ArrowRight size={15} />}
              </button>

              <p className="mt-5 flex items-start gap-2 text-[0.64rem] leading-5 text-[#8999aa]">
                <LockKeyhole size={12} className="mt-0.5 shrink-0" />
                {fa ? 'این ورود واقعی و امن نیست. از اطلاعات نمونه استفاده کنید؛ رمز یا اطلاعات شخصی واقعی وارد نکنید.' : 'This is not secure authentication. Use the sample values; never enter real credentials or personal information.'}
              </p>
            </form>
            <a href={fa ? "/fa" : "/"} className="mt-6 inline-flex items-center gap-1.5 text-[0.7rem] font-medium text-[#73879c] hover:text-navy">
              {fa ? 'بازگشت به وب‌سایت ←' : '← Back to website'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
