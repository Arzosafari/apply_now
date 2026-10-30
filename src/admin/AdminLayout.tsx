import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  BookOpenText,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  CircleHelp,
  CreditCard,
  FileText,
  FolderKanban,
  Globe2,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Package,
  Scale,
  Settings,
  ShieldCheck,
  Star,
  Tags,
  Users,
  X,
} from 'lucide-react';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { cn, initials } from '@/lib/utils';
import { useAdminAuth } from './AuthContext';

const groups = [
  {
    label: 'Overview',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { to: '/admin/consultations', label: 'Consultations', icon: MessageSquareText },
      { to: '/admin/payments', label: 'Payments', icon: CreditCard },
      { to: '/admin/messages', label: 'Messages', icon: MessageSquareText },
    ],
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/services', label: 'Services', icon: BriefcaseBusiness },
      { to: '/admin/destinations', label: 'Destinations', icon: Globe2 },
      { to: '/admin/packages', label: 'Packages', icon: Package },
      { to: '/admin/experts', label: 'Experts', icon: Users },
      { to: '/admin/articles', label: 'Articles', icon: BookOpenText },
      { to: '/admin/categories', label: 'Categories', icon: Tags },
      { to: '/admin/faqs', label: 'FAQs', icon: CircleHelp },
      { to: '/admin/testimonials', label: 'Testimonials', icon: Star },
    ],
  },
  {
    label: 'Website',
    items: [
      { to: '/admin/settings', label: 'Settings', icon: Settings },
      { to: '/admin/legal', label: 'Legal pages', icon: Scale },
      { to: '/admin/account', label: 'Account security', icon: ShieldCheck },
    ],
  },
];

function pageTitle(pathname: string) {
  if (/^\/admin\/consultations\/\d+/.test(pathname)) return 'Consultation detail';
  if (/^\/admin\//.test(pathname)) {
    const segment = pathname.replace('/admin/', '').split('/')[0];
    const map: Record<string, string> = {
      consultations: 'Consultations',
      payments: 'Payments',
      messages: 'Contact messages',
      services: 'Services',
      destinations: 'Destinations',
      packages: 'Packages',
      experts: 'Experts',
      articles: 'Articles',
      categories: 'Categories',
      faqs: 'FAQs',
      testimonials: 'Testimonials',
      settings: 'Website settings',
      legal: 'Legal pages',
      account: 'Account security',
    };
    return map[segment] || 'Admin';
  }
  return 'Dashboard';
}

export function AdminLayout() {
  const { admin, loading, logout } = useAdminAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', close);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', close);
    };
  }, [open]);

  if (loading) {
    return (
      <div className="admin-root grid min-h-screen place-items-center">
        <div className="flex flex-col items-center gap-4">
          <Logo />
          <div className="h-1 w-32 overflow-hidden rounded-full bg-[#e4ebf3]">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-orange" />
          </div>
        </div>
      </div>
    );
  }
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;

  const sidebar = (
    <aside className={cn('admin-sidebar', open && 'open')}>
      <div className="admin-sidebar-brand flex items-center justify-between">
        <Link to="/admin" aria-label="FaraTech admin dashboard">
          <Logo light />
        </Link>
        <button type="button" className="text-white/60 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation">
          <X size={18} />
        </button>
      </div>

      <nav className="admin-nav" aria-label="Admin navigation">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="admin-nav-section">{group.label}</div>
            {group.items.map((item) => {
              const active = item.exact
                ? location.pathname === item.to
                : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
              return (
                <Link key={item.to} to={item.to} className={cn('admin-nav-link', active && 'active')}>
                  <item.icon size={15} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="admin-user">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-orange/90 text-[0.65rem] font-bold text-navy">
            {initials(admin.name)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[0.71rem] font-semibold text-white">{admin.name}</div>
            <div className="truncate text-[0.59rem] capitalize text-white/40">{admin.role}</div>
          </div>
          <button
            type="button"
            className="text-white/40 hover:text-white"
            aria-label="Sign out"
            onClick={() => {
              void logout().then(() => navigate('/admin/login'));
            }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="admin-root">
      <div className="admin-shell">
        {sidebar}
        {open && (
          <button
            type="button"
            className="fixed inset-0 z-20 bg-navy/40 backdrop-blur-[2px] lg:hidden"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          />
        )}
        <div className="admin-main">
          <header className="admin-topbar">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="admin-mobile-toggle icon-btn !h-9 !w-9"
                onClick={() => setOpen(true)}
                aria-label="Open navigation"
              >
                <Menu size={17} />
              </button>
              <div>
                <div className="hidden text-[0.59rem] font-semibold uppercase tracking-[0.13em] text-[#93a2b4] sm:block">
                  FaraTech management
                </div>
                <h1 className="admin-page-title text-[1.12rem] sm:text-[1.3rem]">{pageTitle(location.pathname)}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="hidden items-center gap-1.5 rounded-lg border border-[#e0e8f1] bg-white px-3 py-2 text-[0.68rem] font-medium text-[#526980] transition hover:border-[#bfd0e1] hover:text-navy sm:inline-flex"
              >
                View website <ArrowUpRight size={12} />
              </a>
              <div className="flex items-center gap-2 rounded-lg border border-[#e0e8f1] bg-white px-2 py-1.5">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-navy text-[0.56rem] font-bold text-white">
                  {initials(admin.name)}
                </span>
                <span className="hidden max-w-28 truncate text-[0.68rem] font-medium text-navy md:block">{admin.name}</span>
                <ChevronRight size={11} className="hidden text-[#a3b1c0] md:block" />
              </div>
            </div>
          </header>
          <main className="admin-content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <h2 className="font-display text-[1.25rem] font-bold tracking-[-0.03em] text-navy">{title}</h2>
        {description && <p className="mt-1 text-[0.73rem] text-[#7b8b9d]">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}

export const adminIcons = {
  BriefcaseBusiness,
  Building2,
  FileText,
  FolderKanban,
  GraduationCap,
};
