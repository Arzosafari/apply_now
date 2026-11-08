from django.contrib import admin
from .models import (
    Admin, AdminSession, Service, Destination, Package, Expert,
    ArticleCategory, Article, FAQ, Testimonial, Consultation,
    ConsultationNote, ContactMessage, Payment, SiteSetting,
    LegalPage, ActivityLog
)


@admin.register(Admin)
class AdminAdmin(admin.ModelAdmin):
    list_display = ['email', 'first_name', 'last_name', 'role', 'is_active', 'last_login_at', 'created_at']
    list_filter = ['role', 'is_active']
    search_fields = ['email', 'first_name', 'last_name']


@admin.register(AdminSession)
class AdminSessionAdmin(admin.ModelAdmin):
    list_display = ['admin', 'ip', 'expires_at', 'created_at']
    list_filter = ['expires_at']
    search_fields = ['admin__email', 'ip']


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['title_en', 'title_fa', 'category_en', 'published', 'featured', 'sort_order']
    list_filter = ['published', 'featured', 'category_en']
    search_fields = ['title_en', 'title_fa', 'slug']
    prepopulated_fields = {'slug': ('title_en',)}


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ['name_en', 'name_fa', 'country_code', 'published', 'featured', 'sort_order']
    list_filter = ['published', 'featured', 'country_code']
    search_fields = ['name_en', 'name_fa', 'slug']
    prepopulated_fields = {'slug': ('name_en',)}


@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ['name_en', 'name_fa', 'price_minor', 'currency', 'billing_type', 'visible', 'sort_order']
    list_filter = ['visible', 'billing_type', 'currency']
    search_fields = ['name_en', 'name_fa', 'slug']
    prepopulated_fields = {'slug': ('name_en',)}


@admin.register(Expert)
class ExpertAdmin(admin.ModelAdmin):
    list_display = ['name', 'role_en', 'published', 'is_demo', 'sort_order']
    list_filter = ['published', 'is_demo']
    search_fields = ['name', 'role_en', 'role_fa']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(ArticleCategory)
class ArticleCategoryAdmin(admin.ModelAdmin):
    list_display = ['name_en', 'name_fa', 'sort_order']
    search_fields = ['name_en', 'name_fa', 'slug']
    prepopulated_fields = {'slug': ('name_en',)}


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ['title_en', 'title_fa', 'status', 'featured', 'published_at', 'created_at']
    list_filter = ['status', 'featured', 'category']
    search_fields = ['title_en', 'title_fa', 'slug']
    prepopulated_fields = {'slug': ('title_en',)}
    date_hierarchy = 'published_at'


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question_en', 'category', 'published', 'sort_order']
    list_filter = ['category', 'published']
    search_fields = ['question_en', 'question_fa']


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['name', 'country', 'rating', 'published', 'is_demo', 'sort_order']
    list_filter = ['published', 'is_demo', 'rating']
    search_fields = ['name', 'country']


@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display = ['reference', 'full_name', 'email', 'status', 'contact_method', 'created_at']
    list_filter = ['status', 'contact_method', 'service', 'destination']
    search_fields = ['reference', 'full_name', 'email', 'phone']
    date_hierarchy = 'created_at'


@admin.register(ConsultationNote)
class ConsultationNoteAdmin(admin.ModelAdmin):
    list_display = ['consultation', 'admin', 'created_at']
    list_filter = ['consultation', 'admin']
    search_fields = ['note']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['name', 'email', 'subject', 'message']
    date_hierarchy = 'created_at'


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['reference', 'consultation', 'amount_minor', 'currency', 'status', 'created_at']
    list_filter = ['status', 'provider', 'currency']
    search_fields = ['reference', 'provider_checkout_id', 'customer_email']
    date_hierarchy = 'created_at'


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ['key', 'updated_at']
    search_fields = ['key']


@admin.register(LegalPage)
class LegalPageAdmin(admin.ModelAdmin):
    list_display = ['slug', 'title_en', 'title_fa', 'updated_at']
    search_fields = ['slug', 'title_en', 'title_fa']


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ['admin', 'action', 'entity_type', 'entity_id', 'created_at']
    list_filter = ['action', 'entity_type']
    search_fields = ['action', 'entity_type', 'admin__email']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at']
