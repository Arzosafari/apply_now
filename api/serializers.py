from rest_framework import serializers
from .models import (
    Admin, Service, Destination, Package, Expert, ArticleCategory, Article,
    FAQ, Testimonial, Consultation, ConsultationNote, ContactMessage,
    Payment, SiteSetting, LegalPage, ActivityLog
)
import json


class AdminSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Admin
        fields = ['id', 'email', 'name', 'first_name', 'last_name', 'role', 'is_active', 'last_login_at']
        read_only_fields = ['id', 'last_login_at']

    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'


class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = '__all__'


class PackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = '__all__'


class ExpertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expert
        fields = '__all__'


class ArticleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleCategory
        fields = '__all__'


class ArticleSerializer(serializers.ModelSerializer):
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    category_name_en = serializers.CharField(source='category.name_en', read_only=True)
    category_name_fa = serializers.CharField(source='category.name_fa', read_only=True)

    class Meta:
        model = Article
        fields = '__all__'


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'


class ConsultationSerializer(serializers.ModelSerializer):
    service_title_en = serializers.CharField(source='service.title_en', read_only=True)
    service_title_fa = serializers.CharField(source='service.title_fa', read_only=True)
    destination_name_en = serializers.CharField(source='destination.name_en', read_only=True)
    destination_name_fa = serializers.CharField(source='destination.name_fa', read_only=True)

    class Meta:
        model = Consultation
        fields = '__all__'


class ConsultationNoteSerializer(serializers.ModelSerializer):
    admin_name = serializers.CharField(source='admin.first_name', read_only=True)

    class Meta:
        model = ConsultationNote
        fields = '__all__'


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    consultation_reference = serializers.CharField(source='consultation.reference', read_only=True)
    package_name_en = serializers.CharField(source='package.name_en', read_only=True)
    package_name_fa = serializers.CharField(source='package.name_fa', read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'


class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = '__all__'


class LegalPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegalPage
        fields = '__all__'


class ActivityLogSerializer(serializers.ModelSerializer):
    admin_name = serializers.CharField(source='admin.first_name', read_only=True)

    class Meta:
        model = ActivityLog
        fields = '__all__'


class ConsultationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = [
            'full_name', 'email', 'phone', 'contact_method',
            'service', 'destination', 'education_level', 'message',
            'preferred_date', 'privacy_consent'
        ]

    def validate(self, data):
        if data.get('preferred_date'):
            from datetime import date
            if data['preferred_date'] < date.today():
                raise serializers.ValidationError("Preferred date cannot be in the past")
        return data


class ContactMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'phone', 'subject', 'message']


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
