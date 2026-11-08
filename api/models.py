from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
import json


class AdminManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class Admin(AbstractUser):
    ROLE_CHOICES = [
        ('owner', 'Owner'),
        ('editor', 'Editor'),
        ('advisor', 'Advisor'),
    ]
    
    username = None  # Remove username field
    email = models.EmailField(unique=True)
    
    objects = AdminManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='owner')
    is_active = models.BooleanField(default=True)
    last_login_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'admins'
        verbose_name = 'Admin'
        verbose_name_plural = 'Admins'


class AdminSession(models.Model):
    token_hash = models.CharField(max_length=255, unique=True)
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE)
    csrf_token = models.CharField(max_length=255)
    ip = models.CharField(max_length=45, null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'admin_sessions'
        indexes = [
            models.Index(fields=['expires_at']),
            models.Index(fields=['admin']),
        ]


class Service(models.Model):
    slug = models.SlugField(unique=True)
    category_en = models.CharField(max_length=100, default='Immigration')
    category_fa = models.CharField(max_length=100, default='مهاجرت')
    icon = models.CharField(max_length=50, default='globe')
    image = models.TextField(null=True, blank=True)
    title_en = models.CharField(max_length=255)
    title_fa = models.CharField(max_length=255)
    short_en = models.TextField()
    short_fa = models.TextField()
    description_en = models.TextField(default='')
    description_fa = models.TextField(default='')
    eligibility_en = models.TextField(default='[]')
    eligibility_fa = models.TextField(default='[]')
    documents_en = models.TextField(default='[]')
    documents_fa = models.TextField(default='[]')
    process_en = models.TextField(default='[]')
    process_fa = models.TextField(default='[]')
    benefits_en = models.TextField(default='[]')
    benefits_fa = models.TextField(default='[]')
    faqs_en = models.TextField(default='[]')
    faqs_fa = models.TextField(default='[]')
    timeline_en = models.TextField(null=True, blank=True)
    timeline_fa = models.TextField(null=True, blank=True)
    seo_title_en = models.CharField(max_length=255, null=True, blank=True)
    seo_title_fa = models.CharField(max_length=255, null=True, blank=True)
    seo_description_en = models.TextField(null=True, blank=True)
    seo_description_fa = models.TextField(null=True, blank=True)
    featured = models.BooleanField(default=False)
    published = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'services'
        indexes = [
            models.Index(fields=['published', 'sort_order']),
            models.Index(fields=['category_en']),
        ]
        ordering = ['sort_order', 'id']


class Destination(models.Model):
    slug = models.SlugField(unique=True)
    country_code = models.CharField(max_length=10)
    flag = models.TextField(null=True, blank=True)
    image = models.TextField(null=True, blank=True)
    name_en = models.CharField(max_length=255)
    name_fa = models.CharField(max_length=255)
    tagline_en = models.CharField(max_length=255, default='')
    tagline_fa = models.CharField(max_length=255, default='')
    overview_en = models.TextField(default='')
    overview_fa = models.TextField(default='')
    education_en = models.TextField(default='')
    education_fa = models.TextField(default='')
    universities_en = models.TextField(default='[]')
    universities_fa = models.TextField(default='[]')
    study_pathways_en = models.TextField(default='[]')
    study_pathways_fa = models.TextField(default='[]')
    work_pathways_en = models.TextField(default='[]')
    work_pathways_fa = models.TextField(default='[]')
    pr_pathways_en = models.TextField(default='[]')
    pr_pathways_fa = models.TextField(default='[]')
    family_pathways_en = models.TextField(default='[]')
    family_pathways_fa = models.TextField(default='[]')
    investment_pathways_en = models.TextField(default='[]')
    investment_pathways_fa = models.TextField(default='[]')
    highlights_en = models.TextField(default='[]')
    highlights_fa = models.TextField(default='[]')
    eligibility_en = models.TextField(default='[]')
    eligibility_fa = models.TextField(default='[]')
    documents_en = models.TextField(default='[]')
    documents_fa = models.TextField(default='[]')
    process_en = models.TextField(default='[]')
    process_fa = models.TextField(default='[]')
    seo_title_en = models.CharField(max_length=255, null=True, blank=True)
    seo_title_fa = models.CharField(max_length=255, null=True, blank=True)
    seo_description_en = models.TextField(null=True, blank=True)
    seo_description_fa = models.TextField(null=True, blank=True)
    featured = models.BooleanField(default=False)
    published = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'destinations'
        indexes = [
            models.Index(fields=['published', 'sort_order']),
        ]
        ordering = ['sort_order', 'id']


class Package(models.Model):
    BILLING_TYPE_CHOICES = [
        ('one_time', 'One Time'),
        ('deposit', 'Deposit'),
        ('custom', 'Custom'),
    ]
    
    CTA_TYPE_CHOICES = [
        ('consultation', 'Consultation'),
        ('payment', 'Payment'),
    ]
    
    slug = models.SlugField(unique=True)
    name_en = models.CharField(max_length=255)
    name_fa = models.CharField(max_length=255)
    description_en = models.TextField(default='')
    description_fa = models.TextField(default='')
    price_minor = models.IntegerField(default=0)
    currency = models.CharField(max_length=10, default='USD')
    billing_type = models.CharField(max_length=20, choices=BILLING_TYPE_CHOICES, default='one_time')
    duration_en = models.TextField(null=True, blank=True)
    duration_fa = models.TextField(null=True, blank=True)
    features_en = models.TextField(default='[]')
    features_fa = models.TextField(default='[]')
    exclusions_en = models.TextField(default='[]')
    exclusions_fa = models.TextField(default='[]')
    cta_type = models.CharField(max_length=20, choices=CTA_TYPE_CHOICES, default='consultation')
    featured = models.BooleanField(default=False)
    visible = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'packages'
        indexes = [
            models.Index(fields=['visible', 'sort_order']),
        ]
        ordering = ['sort_order', 'id']


class Expert(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=255)
    role_en = models.CharField(max_length=255)
    role_fa = models.CharField(max_length=255)
    expertise_en = models.TextField(default='')
    expertise_fa = models.TextField(default='')
    bio_en = models.TextField(default='')
    bio_fa = models.TextField(default='')
    languages_en = models.TextField(default='[]')
    languages_fa = models.TextField(default='[]')
    photo = models.TextField(null=True, blank=True)
    linkedin_url = models.TextField(null=True, blank=True)
    years_experience = models.CharField(max_length=50, null=True, blank=True)
    is_demo = models.BooleanField(default=False)
    published = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'experts'
        ordering = ['sort_order', 'id']


class ArticleCategory(models.Model):
    slug = models.SlugField(unique=True)
    name_en = models.CharField(max_length=255)
    name_fa = models.CharField(max_length=255)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'article_categories'
        verbose_name_plural = 'Article Categories'
        ordering = ['sort_order', 'id']


class Article(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]
    
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(ArticleCategory, on_delete=models.SET_NULL, null=True, blank=True)
    author = models.CharField(max_length=255, default='FaraTech Editorial')
    image = models.TextField(null=True, blank=True)
    title_en = models.CharField(max_length=255)
    title_fa = models.CharField(max_length=255)
    excerpt_en = models.TextField(default='')
    excerpt_fa = models.TextField(default='')
    content_en = models.TextField(default='')
    content_fa = models.TextField(default='')
    reading_minutes = models.IntegerField(default=5)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    featured = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    seo_title_en = models.CharField(max_length=255, null=True, blank=True)
    seo_title_fa = models.CharField(max_length=255, null=True, blank=True)
    seo_description_en = models.TextField(null=True, blank=True)
    seo_description_fa = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'articles'
        indexes = [
            models.Index(fields=['status', '-published_at']),
            models.Index(fields=['category']),
        ]
        ordering = ['-published_at', '-id']


class FAQ(models.Model):
    CATEGORY_CHOICES = [
        ('general', 'General'),
        ('study', 'Study'),
        ('student-visa', 'Student Visa'),
        ('work-visa', 'Work Visa'),
        ('immigration', 'Immigration'),
        ('pricing', 'Pricing'),
        ('payments', 'Payments'),
    ]
    
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')
    question_en = models.TextField()
    question_fa = models.TextField()
    answer_en = models.TextField()
    answer_fa = models.TextField()
    published = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'faqs'
        indexes = [
            models.Index(fields=['published', 'sort_order']),
        ]
        ordering = ['sort_order', 'id']


class Testimonial(models.Model):
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=255, default='')
    service_en = models.CharField(max_length=255, default='')
    service_fa = models.CharField(max_length=255, default='')
    quote_en = models.TextField()
    quote_fa = models.TextField()
    photo = models.TextField(null=True, blank=True)
    rating = models.IntegerField(default=5)
    is_demo = models.BooleanField(default=True)
    published = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'testimonials'
        ordering = ['sort_order', 'id']


class Consultation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('under_review', 'Under Review'),
        ('contacted', 'Contacted'),
        ('in_progress', 'In Progress'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
    ]
    
    CONTACT_METHOD_CHOICES = [
        ('email', 'Email'),
        ('phone', 'Phone'),
        ('whatsapp', 'WhatsApp'),
    ]
    
    reference = models.CharField(max_length=50, unique=True)
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    contact_method = models.CharField(max_length=20, choices=CONTACT_METHOD_CHOICES, default='email')
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True)
    destination = models.ForeignKey(Destination, on_delete=models.SET_NULL, null=True, blank=True)
    education_level = models.CharField(max_length=255, null=True, blank=True)
    message = models.TextField(null=True, blank=True)
    preferred_date = models.DateField(null=True, blank=True)
    privacy_consent = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    source = models.CharField(max_length=50, default='website')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'consultations'
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['service']),
            models.Index(fields=['destination']),
            models.Index(fields=['email']),
            models.Index(fields=['-created_at']),
        ]
        ordering = ['-created_at']


class ConsultationNote(models.Model):
    consultation = models.ForeignKey(Consultation, on_delete=models.CASCADE)
    admin = models.ForeignKey(Admin, on_delete=models.SET_NULL, null=True, blank=True)
    note = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'consultation_notes'
        indexes = [
            models.Index(fields=['consultation', '-created_at']),
        ]
        ordering = ['-created_at']


class ContactMessage(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('read', 'Read'),
        ('replied', 'Replied'),
        ('archived', 'Archived'),
    ]
    
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50, null=True, blank=True)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'contact_messages'
        indexes = [
            models.Index(fields=['status', '-created_at']),
        ]
        ordering = ['-created_at']


class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('successful', 'Successful'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]
    
    reference = models.CharField(max_length=50, unique=True)
    consultation = models.ForeignKey(Consultation, on_delete=models.SET_NULL, null=True, blank=True)
    package = models.ForeignKey(Package, on_delete=models.SET_NULL, null=True, blank=True)
    provider = models.CharField(max_length=50, default='stripe')
    provider_checkout_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    provider_payment_id = models.CharField(max_length=255, null=True, blank=True)
    amount_minor = models.IntegerField()
    currency = models.CharField(max_length=10, default='USD')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    description = models.TextField(default='')
    customer_email = models.EmailField(null=True, blank=True)
    receipt_url = models.TextField(null=True, blank=True)
    metadata = models.TextField(default='{}')
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'payments'
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['consultation']),
            models.Index(fields=['-created_at']),
        ]
        ordering = ['-created_at']


class SiteSetting(models.Model):
    key = models.CharField(max_length=255, primary_key=True)
    value = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'site_settings'
        verbose_name = 'Site Setting'
        verbose_name_plural = 'Site Settings'


class LegalPage(models.Model):
    slug = models.SlugField(primary_key=True)
    title_en = models.CharField(max_length=255)
    title_fa = models.CharField(max_length=255)
    body_en = models.TextField()
    body_fa = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'legal_pages'
        verbose_name = 'Legal Page'
        verbose_name_plural = 'Legal Pages'


class ActivityLog(models.Model):
    admin = models.ForeignKey(Admin, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=100)
    entity_type = models.CharField(max_length=100)
    entity_id = models.CharField(max_length=100, null=True, blank=True)
    details = models.TextField(default='{}')
    ip = models.CharField(max_length=45, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'activity_logs'
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['entity_type', 'entity_id']),
        ]
        ordering = ['-created_at']
