import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocaleProvider } from '@/lib/i18n';
import { subscribeDemoStorage } from '@/data/demoStore';
import { PublicLayout } from '@/components/PublicLayout';
import { HomePage } from '@/pages/HomePage';
import { ServicesPage } from '@/pages/ServicesPage';
import { ServiceDetailPage } from '@/pages/ServiceDetailPage';
import { DestinationsPage } from '@/pages/DestinationsPage';
import { DestinationDetailPage } from '@/pages/DestinationDetailPage';
import { PricingPage } from '@/pages/PricingPage';
import { ExpertsPage } from '@/pages/ExpertsPage';
import { ExpertDetailPage } from '@/pages/ExpertDetailPage';
import { AboutPage } from '@/pages/AboutPage';
import { BlogPage } from '@/pages/BlogPage';
import { ArticleDetailPage } from '@/pages/ArticleDetailPage';
import { ConsultationPage } from '@/pages/ConsultationPage';
import { ContactPage } from '@/pages/ContactPage';
import { FaqPage } from '@/pages/FaqPage';
import { LegalPage } from '@/pages/LegalPage';
import { PaymentCancelledPage, PaymentSuccessPage } from '@/pages/PaymentPages';
import { NotFoundPage } from '@/pages/NotFoundPage';

const AdminApp = lazy(() => import('./admin/AdminApp').then((module) => ({ default: module.AdminApp })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const publicPages = [
  { path: '', element: <HomePage /> },
  { path: 'services', element: <ServicesPage /> },
  { path: 'services/:slug', element: <ServiceDetailPage /> },
  { path: 'destinations', element: <DestinationsPage /> },
  { path: 'destinations/:slug', element: <DestinationDetailPage /> },
  { path: 'pricing', element: <PricingPage /> },
  { path: 'experts', element: <ExpertsPage /> },
  { path: 'experts/:slug', element: <ExpertDetailPage /> },
  { path: 'about', element: <AboutPage /> },
  { path: 'blog', element: <BlogPage /> },
  { path: 'blog/:slug', element: <ArticleDetailPage /> },
  { path: 'consultation', element: <ConsultationPage /> },
  { path: 'contact', element: <ContactPage /> },
  { path: 'faq', element: <FaqPage /> },
  { path: 'privacy-policy', element: <LegalPage slug="privacy-policy" /> },
  { path: 'terms-and-conditions', element: <LegalPage slug="terms-and-conditions" /> },
  { path: 'payment/success', element: <PaymentSuccessPage /> },
  { path: 'payment/cancelled', element: <PaymentCancelledPage /> },
];

function DemoStorageSync() {
  useEffect(() => subscribeDemoStorage(() => { void queryClient.invalidateQueries(); }), []);
  return null;
}

function AdminFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#f4f7fb]">
      <div className="h-1 w-36 overflow-hidden rounded-full bg-[#e4ebf3]">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-orange" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DemoStorageSync />
      <BrowserRouter>
        <LocaleProvider>
          <Routes>
            <Route
              path="/admin/*"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <AdminApp />
                </Suspense>
              }
            />
            <Route element={<PublicLayout />}>
              {publicPages.map((page) => (
                <Route key={`en-${page.path}`} path={`/${page.path}`} element={page.element} />
              ))}
              {publicPages.map((page) => (
                <Route key={`fa-${page.path}`} path={`/fa/${page.path}`} element={page.element} />
              ))}
              <Route path="/fa" element={<HomePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </LocaleProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
