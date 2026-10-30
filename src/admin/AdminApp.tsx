import { useAdminTranslation } from './i18n';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { resourceConfigs } from './resourceConfigs';
import { AdminAuthProvider, useAdminAuth } from './AuthContext';
import { AdminToastProvider } from './Toast';
import { AdminLayout } from './AdminLayout';
import { AdminLoginPage } from './LoginPage';
import { DashboardPage } from './DashboardPage';
import { ConsultationsPage } from './ConsultationsPage';
import { ConsultationDetailPage } from './ConsultationDetailPage';
import { PaymentsPage } from './PaymentsPage';
import { MessagesPage } from './MessagesPage';
import { SettingsPage } from './SettingsPage';
import { LegalAdminPage } from './LegalAdminPage';
import { AccountPage } from './AccountPage';
import { ResourceManager } from './ResourceManager';

function AdminGuard() {
  const { admin, loading } = useAdminAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="admin-root grid min-h-screen place-items-center">
        <div className="h-1 w-40 overflow-hidden rounded-full bg-[#e4ebf3]">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-orange" />
        </div>
      </div>
    );
  }
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: `${location.pathname}${location.search}${location.hash}` }} />;
  return <Outlet />;
}

function AdminNotFound() {
  const a = useAdminTranslation();
  return (
    <div className="admin-card grid place-items-center px-6 py-24 text-center">
      <p className="text-5xl font-bold text-[#e2ebf4]">404</p>
      <h2 className="mt-3 text-lg">{a("Admin page not found")}</h2>
      <p className="mt-2 text-[0.75rem] text-[#7b8b9d]">{a("The management page you requested does not exist.")}</p>
      <Link to="/admin" className="btn btn-dark btn-sm mt-5">{a("Back to dashboard")}</Link>
    </div>
  );
}

export function AdminApp() {
  return (
    <AdminAuthProvider>
      <AdminToastProvider>
        <Routes>
          <Route path="login" element={<AdminLoginPage />} />
          <Route element={<AdminGuard />}>
            <Route element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="requests" element={<ConsultationsPage />} />
              <Route path="requests/:id" element={<ConsultationDetailPage />} />
              <Route path="pricing" element={<ResourceManager config={resourceConfigs.packages} />} />
              <Route path="consultations" element={<ConsultationsPage />} />
              <Route path="consultations/:id" element={<ConsultationDetailPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="services" element={<ResourceManager config={resourceConfigs.services} />} />
              <Route path="destinations" element={<ResourceManager config={resourceConfigs.destinations} />} />
              <Route path="packages" element={<ResourceManager config={resourceConfigs.packages} />} />
              <Route path="experts" element={<ResourceManager config={resourceConfigs.experts} />} />
              <Route path="articles" element={<ResourceManager config={resourceConfigs.articles} />} />
              <Route path="categories" element={<ResourceManager config={resourceConfigs.categories} />} />
              <Route path="faqs" element={<ResourceManager config={resourceConfigs.faqs} />} />
              <Route path="testimonials" element={<ResourceManager config={resourceConfigs.testimonials} />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="legal" element={<LegalAdminPage />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="*" element={<AdminNotFound />} />
            </Route>
          </Route>
        </Routes>
      </AdminToastProvider>
    </AdminAuthProvider>
  );
}
