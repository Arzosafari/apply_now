from rest_framework import serializers
from .models import (
    Admin, Service, Destination, Package, Expert, ArticleCategory, Article,
    FAQ, Testimonial, Consultation, ConsultationNote, ContactMessage,
    Payment, SiteSetting, LegalPage, ActivityLog
)
import json


def parse_json_field(value):
    """Parse JSON field if it's a string, otherwise return as-is"""
    if isinstance(value, str):
        try:
            return json.loads(value)
        except (json.JSONDecodeError, TypeError):
            return []
    return value if value else []


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

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Parse JSON fields
        json_fields = ['eligibility_en', 'eligibility_fa', 'documents_en', 'documents_fa', 
                       'process_en', 'process_fa', 'benefits_en', 'benefits_fa', 
                       'faqs_en', 'faqs_fa']
        for field in json_fields:
            if field in data:
                data[field] = parse_json_field(data[field])
        return data


class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Parse JSON fields
        json_fields = ['universities_en', 'universities_fa', 'study_pathways_en', 'study_pathways_fa',
                       'work_pathways_en', 'work_pathways_fa', 'pr_pathways_en', 'pr_pathways_fa',
                       'family_pathways_en', 'family_pathways_fa', 'investment_pathways_en', 'investment_pathways_fa',
                       'highlights_en', 'highlights_fa', 'eligibility_en', 'eligibility_fa',
                       'documents_en', 'documents_fa', 'process_en', 'process_fa']
        for field in json_fields:
            if field in data:
                data[field] = parse_json_field(data[field])
        return data


class PackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        json_fields = ['features_en', 'features_fa', 'exclusions_en', 'exclusions_fa']
        for field in json_fields:
            if field in data:
                data[field] = parse_json_field(data[field])
        return data


class ExpertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expert
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        json_fields = ['languages_en', 'languages_fa']
        for field in json_fields:
            if field in data:
                data[field] = parse_json_field(data[field])
        return data


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

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Parse content from Markdown string if needed
        # For now, content_en and content_fa are plain text
        return data


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
    # Add camelCase aliases
    fullName = serializers.CharField(source='full_name', required=True)
    contactMethod = serializers.CharField(source='contact_method', required=False)
    serviceId = serializers.PrimaryKeyRelatedField(source='service', queryset=Service.objects.all(), required=False, allow_null=True)
    destinationId = serializers.PrimaryKeyRelatedField(source='destination', queryset=Destination.objects.all(), required=False, allow_null=True)
    educationLevel = serializers.CharField(source='education_level', required=False, allow_null=True)
    preferredDate = serializers.DateField(source='preferred_date', required=False, allow_null=True)
    privacyConsent = serializers.BooleanField(source='privacy_consent', required=False)

    class Meta:
        model = Consultation
        fields = [
            'full_name', 'email', 'phone', 'contact_method',
            'service', 'destination', 'education_level', 'message',
            'preferred_date', 'privacy_consent',
            'fullName', 'contactMethod', 'serviceId', 'destinationId',
            'educationLevel', 'preferredDate', 'privacyConsent'
        ]
        extra_kwargs = {
            'full_name': {'required': False},  # Will use fullName instead
            'preferred_date': {'required': False, 'allow_null': True},
            'privacy_consent': {'required': False},
            'service': {'required': False, 'allow_null': True},
            'destination': {'required': False, 'allow_null': True},
            'education_level': {'required': False, 'allow_null': True},
            'message': {'required': False, 'allow_null': True}
        }

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
