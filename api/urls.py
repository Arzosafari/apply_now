from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from .views import (
    LoginView, LogoutView, SessionView, MeView, ChangePasswordView,
    ServiceViewSet, DestinationViewSet, PackageViewSet, ExpertViewSet,
    ArticleCategoryViewSet, ArticleViewSet, FAQViewSet, TestimonialViewSet,
    ConsultationViewSet, ConsultationPublicView, ContactMessageViewSet,
    ContactMessagePublicView, StatsView, SiteDataView, SettingsView,
    LegalDetailView, PaymentsViewSet, UploadView, ConsultationUpdateStatusView
)

urlpatterns = [
    # Public endpoints
    path('public/site', SiteDataView.as_view(), name='site-data'),
    path('public/consultations', csrf_exempt(ConsultationPublicView.as_view()), name='consultation-public'),
    path('public/contact', csrf_exempt(ContactMessagePublicView.as_view()), name='contact-public'),
    path('public/legal/<slug:slug>', LegalDetailView.as_view(), name='public-legal-detail'),
    path('public/services', ServiceViewSet.as_view({'get': 'list'}), name='public-services'),
    path('public/services/<slug:slug>', ServiceViewSet.as_view({'get': 'retrieve'}), name='public-service-detail'),
    path('public/destinations', DestinationViewSet.as_view({'get': 'list'}), name='public-destinations'),
    path('public/destinations/<slug:slug>', DestinationViewSet.as_view({'get': 'retrieve'}), name='public-destination-detail'),
    path('public/packages', PackageViewSet.as_view({'get': 'list'}), name='public-packages'),
    path('public/experts', ExpertViewSet.as_view({'get': 'list'}), name='public-experts'),
    path('public/experts/<slug:slug>', ExpertViewSet.as_view({'get': 'retrieve'}), name='public-expert-detail'),
    path('public/articles', ArticleViewSet.as_view({'get': 'list'}), name='public-articles'),
    path('public/articles/<slug:slug>', ArticleViewSet.as_view({'get': 'retrieve'}), name='public-article-detail'),
    path('public/faqs', FAQViewSet.as_view({'get': 'list'}), name='public-faqs'),
    path('public/testimonials', TestimonialViewSet.as_view({'get': 'list'}), name='public-testimonials'),

    # Admin endpoints
    path('admin/login', csrf_exempt(LoginView.as_view()), name='login'),
    path('admin/logout', csrf_exempt(LogoutView.as_view()), name='logout'),
    path('admin/session', csrf_exempt(SessionView.as_view()), name='session'),
    path('admin/me', csrf_exempt(MeView.as_view()), name='me'),
    path('admin/account/password', csrf_exempt(ChangePasswordView.as_view()), name='change-password'),
    path('admin/stats', csrf_exempt(StatsView.as_view()), name='stats'),
    path('admin/settings', csrf_exempt(SettingsView.as_view()), name='settings'),
    path('admin/legal', csrf_exempt(LegalDetailView.as_view()), name='legal-list'),
    path('admin/legal/<slug:slug>', csrf_exempt(LegalDetailView.as_view()), name='legal-detail'),
    path('admin/uploads', csrf_exempt(UploadView.as_view()), name='upload'),
    path('admin/consultations', csrf_exempt(ConsultationViewSet.as_view({'get': 'list', 'post': 'create'})), name='consultations'),
    path('admin/consultations/<int:pk>', csrf_exempt(ConsultationViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update'})), name='consultation-detail'),
    path('admin/consultations/<int:pk>/update_status', csrf_exempt(ConsultationUpdateStatusView.as_view()), name='consultation-update-status'),
    path('admin/consultations/<int:pk>/add_note', csrf_exempt(ConsultationViewSet.as_view({'post': 'add_note'})), name='consultation-add-note'),
    path('admin/contact-messages', csrf_exempt(ContactMessageViewSet.as_view({'get': 'list', 'post': 'create'})), name='contact-messages'),
    path('admin/contact-messages/<int:pk>', csrf_exempt(ContactMessageViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update'})), name='contact-message-detail'),
    path('admin/payments', csrf_exempt(PaymentsViewSet.as_view({'get': 'list'})), name='payments'),
    path('admin/payments/<int:pk>', csrf_exempt(PaymentsViewSet.as_view({'get': 'retrieve'})), name='payment-detail'),

    # Admin CRUD endpoints
    path('admin/services', csrf_exempt(ServiceViewSet.as_view({'get': 'list', 'post': 'create'})), name='admin-services'),
    path('admin/services/<int:pk>', csrf_exempt(ServiceViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy'})), name='admin-service-detail'),
    path('admin/destinations', csrf_exempt(DestinationViewSet.as_view({'get': 'list', 'post': 'create'})), name='admin-destinations'),
    path('admin/destinations/<int:pk>', csrf_exempt(DestinationViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy'})), name='admin-destination-detail'),
    path('admin/packages', csrf_exempt(PackageViewSet.as_view({'get': 'list', 'post': 'create'})), name='admin-packages'),
    path('admin/packages/<int:pk>', csrf_exempt(PackageViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy'})), name='admin-package-detail'),
    path('admin/experts', csrf_exempt(ExpertViewSet.as_view({'get': 'list', 'post': 'create'})), name='admin-experts'),
    path('admin/experts/<int:pk>', csrf_exempt(ExpertViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy'})), name='admin-expert-detail'),
    path('admin/categories', csrf_exempt(ArticleCategoryViewSet.as_view({'get': 'list', 'post': 'create'})), name='admin-categories'),
    path('admin/categories/<int:pk>', csrf_exempt(ArticleCategoryViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy'})), name='admin-category-detail'),
    path('admin/articles', csrf_exempt(ArticleViewSet.as_view({'get': 'list', 'post': 'create'})), name='admin-articles'),
    path('admin/articles/<int:pk>', csrf_exempt(ArticleViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy'})), name='admin-article-detail'),
    path('admin/faqs', csrf_exempt(FAQViewSet.as_view({'get': 'list', 'post': 'create'})), name='admin-faqs'),
    path('admin/faqs/<int:pk>', csrf_exempt(FAQViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy'})), name='admin-faq-detail'),
    path('admin/testimonials', csrf_exempt(TestimonialViewSet.as_view({'get': 'list', 'post': 'create'})), name='admin-testimonials'),
    path('admin/testimonials/<int:pk>', csrf_exempt(TestimonialViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy'})), name='admin-testimonial-detail'),
]
