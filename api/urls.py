from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from rest_framework.routers import DefaultRouter
from .views import (
    LoginView, LogoutView, SessionView, MeView, ChangePasswordView,
    ServiceViewSet, DestinationViewSet, PackageViewSet, ExpertViewSet,
    ArticleCategoryViewSet, ArticleViewSet, FAQViewSet, TestimonialViewSet,
    ConsultationViewSet, ConsultationPublicView, ContactMessageViewSet,
    ContactMessagePublicView, StatsView, SiteDataView, SettingsView,
    LegalDetailView, PaymentsViewSet, UploadView
)

router = DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'destinations', DestinationViewSet, basename='destination')
router.register(r'packages', PackageViewSet, basename='package')
router.register(r'experts', ExpertViewSet, basename='expert')
router.register(r'article-categories', ArticleCategoryViewSet, basename='articlecategory')
router.register(r'articles', ArticleViewSet, basename='article')
router.register(r'faqs', FAQViewSet, basename='faq')
router.register(r'testimonials', TestimonialViewSet, basename='testimonial')
router.register(r'payments', PaymentsViewSet, basename='payment')

urlpatterns = [
    # Public endpoints
    path('public/site', SiteDataView.as_view(), name='site-data'),
    path('public/consultations', csrf_exempt(ConsultationPublicView.as_view()), name='consultation-public'),
    path('public/contact', csrf_exempt(ContactMessagePublicView.as_view()), name='contact-public'),

    # Admin endpoints
    path('admin/login', csrf_exempt(LoginView.as_view()), name='login'),
    path('admin/logout', LogoutView.as_view(), name='logout'),
    path('admin/session', SessionView.as_view(), name='session'),
    path('admin/me', MeView.as_view(), name='me'),
    path('admin/account/password', ChangePasswordView.as_view(), name='change-password'),
    path('admin/stats', StatsView.as_view(), name='stats'),
    path('admin/settings', SettingsView.as_view(), name='settings'),
    path('admin/legal/<slug:slug>', LegalDetailView.as_view(), name='legal-detail'),
    path('admin/uploads', UploadView.as_view(), name='upload'),
    path('admin/consultations', ConsultationViewSet.as_view({'get': 'list', 'post': 'create'}), name='consultations'),
    path('admin/consultations/<int:pk>', ConsultationViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update'}), name='consultation-detail'),
    path('admin/consultations/<int:pk>/update_status', ConsultationViewSet.as_view({'patch': 'update_status'}), name='consultation-update-status'),
    path('admin/consultations/<int:pk>/add_note', ConsultationViewSet.as_view({'post': 'add_note'}), name='consultation-add-note'),
    path('admin/contact-messages', ContactMessageViewSet.as_view({'get': 'list', 'post': 'create'}), name='contact-messages'),
    path('admin/contact-messages/<int:pk>', ContactMessageViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update'}), name='contact-message-detail'),

    # Admin CRUD endpoints
    path('admin/services', ServiceViewSet.as_view({'get': 'list', 'post': 'create'}), name='admin-services'),
    path('admin/services/<int:pk>', ServiceViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy'}), name='admin-service-detail'),
    path('admin/destinations', DestinationViewSet.as_view({'get': 'list', 'post': 'create'}), name='admin-destinations'),
    path('admin/destinations/<int:pk>', DestinationViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy'}), name='admin-destination-detail'),
    path('admin/packages', PackageViewSet.as_view({'get': 'list', 'post': 'create'}), name='admin-packages'),
    path('admin/packages/<int:pk>', PackageViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy'}), name='admin-package-detail'),
    path('admin/experts', ExpertViewSet.as_view({'get': 'list', 'post': 'create'}), name='admin-experts'),
    path('admin/experts/<int:pk>', ExpertViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy'}), name='admin-expert-detail'),
    path('admin/categories', ArticleCategoryViewSet.as_view({'get': 'list', 'post': 'create'}), name='admin-categories'),
    path('admin/categories/<int:pk>', ArticleCategoryViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy'}), name='admin-category-detail'),
    path('admin/articles', ArticleViewSet.as_view({'get': 'list', 'post': 'create'}), name='admin-articles'),
    path('admin/articles/<int:pk>', ArticleViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy'}), name='admin-article-detail'),
    path('admin/faqs', FAQViewSet.as_view({'get': 'list', 'post': 'create'}), name='admin-faqs'),
    path('admin/faqs/<int:pk>', FAQViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy'}), name='admin-faq-detail'),
    path('admin/testimonials', TestimonialViewSet.as_view({'get': 'list', 'post': 'create'}), name='admin-testimonials'),
    path('admin/testimonials/<int:pk>', TestimonialViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy'}), name='admin-testimonial-detail'),

    # Router URLs (public access)
    path('', include(router.urls)),
]
