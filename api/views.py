from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login, logout
from django.utils import timezone
from django.db.models import Q, Count, Sum
from datetime import datetime, timedelta
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import secrets
import hashlib

from .models import (
    Admin, AdminSession, Service, Destination, Package, Expert, ArticleCategory, Article,
    FAQ, Testimonial, Consultation, ConsultationNote, ContactMessage,
    Payment, SiteSetting, LegalPage, ActivityLog
)
from .serializers import (
    AdminSerializer, ServiceSerializer, DestinationSerializer, PackageSerializer,
    ExpertSerializer, ArticleCategorySerializer, ArticleSerializer, FAQSerializer,
    TestimonialSerializer, ConsultationSerializer, ConsultationNoteSerializer,
    ContactMessageSerializer, PaymentSerializer, SiteSettingSerializer,
    LegalPageSerializer, ActivityLogSerializer, ConsultationCreateSerializer,
    ContactMessageCreateSerializer, LoginSerializer
)


@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            user = authenticate(request, username=email, password=password)
            if user and user.is_active:
                login(request, user)
                user.last_login_at = timezone.now()
                user.save()
                
                # Create session token
                token = secrets.token_urlsafe(32)
                token_hash = hashlib.sha256(token.encode()).hexdigest()
                csrf_token = secrets.token_urlsafe(32)
                
                session = AdminSession.objects.create(
                    token_hash=token_hash,
                    admin=user,
                    csrf_token=csrf_token,
                    ip=self.get_client_ip(request),
                    user_agent=request.META.get('HTTP_USER_AGENT', ''),
                    expires_at=timezone.now() + timedelta(hours=12)
                )
                
                # Log activity
                ActivityLog.objects.create(
                    admin=user,
                    action='login',
                    entity_type='admin',
                    entity_id=str(user.id),
                    ip=self.get_client_ip(request)
                )
                
                return Response({
                    'admin': AdminSerializer(user).data,
                    'token': token,
                    'csrfToken': csrf_token,
                    'expiresAt': session.expires_at.isoformat()
                })
            
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Log activity
        ActivityLog.objects.create(
            admin=request.user,
            action='logout',
            entity_type='admin',
            entity_id=str(request.user.id),
            ip=self.get_client_ip(request)
        )
        
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class SessionView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response({
                'admin': AdminSerializer(request.user).data,
                'csrfToken': None,
                'expiresAt': None
            })
        return Response({
            'admin': None,
            'csrfToken': None,
            'expiresAt': None
        })


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'admin': AdminSerializer(request.user).data,
            'csrfToken': None,
            'expiresAt': None
        })


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        current_password = request.data.get('currentPassword')
        new_password = request.data.get('newPassword')

        if not current_password or not new_password:
            return Response(
                {'error': 'Current password and new password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(new_password) < 12:
            return Response(
                {'error': 'New password must be at least 12 characters'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not request.user.check_password(current_password):
            return Response(
                {'error': 'Current password is incorrect'},
                status=status.HTTP_400_BAD_REQUEST
            )

        request.user.set_password(new_password)
        request.user.save()

        return Response({'ok': True})


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        published = self.request.query_params.get('published')
        featured = self.request.query_params.get('featured')
        category = self.request.query_params.get('category')

        if published == '1':
            queryset = queryset.filter(published=True)
        if featured == '1':
            queryset = queryset.filter(featured=True)
        if category:
            queryset = queryset.filter(category_en__iexact=category)

        return queryset.order_by('sort_order', 'id')

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'item': serializer.data}, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({'item': serializer.data})


class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        published = self.request.query_params.get('published')
        featured = self.request.query_params.get('featured')
        search = self.request.query_params.get('search', '')

        if published == '1':
            queryset = queryset.filter(published=True)
        if featured == '1':
            queryset = queryset.filter(featured=True)
        if search:
            queryset = queryset.filter(
                Q(name_en__icontains=search) |
                Q(name_fa__icontains=search) |
                Q(tagline_en__icontains=search) |
                Q(tagline_fa__icontains=search)
            )

        return queryset.order_by('sort_order', 'id')

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'item': serializer.data}, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({'item': serializer.data})


class PackageViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        visible = self.request.query_params.get('visible')

        if visible == '1':
            queryset = queryset.filter(visible=True)

        return queryset.order_by('sort_order', 'id')

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'item': serializer.data}, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({'item': serializer.data})


class ExpertViewSet(viewsets.ModelViewSet):
    queryset = Expert.objects.all()
    serializer_class = ExpertSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        published = self.request.query_params.get('published')

        if published == '1':
            queryset = queryset.filter(published=True)

        return queryset.order_by('sort_order', 'id')

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'item': serializer.data}, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({'item': serializer.data})


class ArticleCategoryViewSet(viewsets.ModelViewSet):
    queryset = ArticleCategory.objects.all()
    serializer_class = ArticleCategorySerializer
    permission_classes = [AllowAny]
    ordering = ['sort_order', 'id']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'item': serializer.data}, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({'item': serializer.data})


class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        status_filter = self.request.query_params.get('status')
        featured = self.request.query_params.get('featured')
        search = self.request.query_params.get('search', '')
        category = self.request.query_params.get('category')

        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if featured == '1':
            queryset = queryset.filter(featured=True)
        if search:
            queryset = queryset.filter(
                Q(title_en__icontains=search) |
                Q(title_fa__icontains=search) |
                Q(excerpt_en__icontains=search) |
                Q(excerpt_fa__icontains=search)
            )
        if category:
            queryset = queryset.filter(category__slug=category)

        return queryset.order_by('-published_at', '-id')

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'item': serializer.data}, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({'item': serializer.data})


class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        published = self.request.query_params.get('published')

        if published == '1':
            queryset = queryset.filter(published=True)

        return queryset.order_by('sort_order', 'id')

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'item': serializer.data}, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({'item': serializer.data})


class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        published = self.request.query_params.get('published')

        if published == '1':
            queryset = queryset.filter(published=True)

        return queryset.order_by('sort_order', 'id')

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'item': serializer.data}, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({'item': serializer.data})


class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.select_related('service', 'destination').all()
    serializer_class = ConsultationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        status_filter = self.request.query_params.get('status')
        service_id = self.request.query_params.get('serviceId')
        destination_id = self.request.query_params.get('destinationId')
        search = self.request.query_params.get('search', '')

        if status_filter and status_filter != 'all':
            queryset = queryset.filter(status=status_filter)
        if service_id:
            queryset = queryset.filter(service_id=service_id)
        if destination_id:
            queryset = queryset.filter(destination_id=destination_id)
        if search:
            queryset = queryset.filter(
                Q(reference__icontains=search) |
                Q(full_name__icontains=search) |
                Q(email__icontains=search) |
                Q(phone__icontains=search)
            )

        return queryset.order_by('-created_at')

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response({'items': serializer.data})

    def create(self, request):
        serializer = ConsultationCreateSerializer(data=request.data)
        if serializer.is_valid():
            import secrets
            year = datetime.now().year
            suffix = secrets.token_hex(3).upper()[:6]
            reference = f'FT-{year}-{suffix}'

            consultation = serializer.save(
                reference=reference,
                status='pending',
                source='website'
            )

            return Response(
                ConsultationSerializer(consultation).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        consultation = self.get_object()
        new_status = request.data.get('status')

        if new_status in dict(Consultation.STATUS_CHOICES):
            old_status = consultation.status
            consultation.status = new_status
            consultation.save()

            ActivityLog.objects.create(
                admin=request.user,
                action='status_change',
                entity_type='consultation',
                entity_id=str(consultation.id),
                details={'reference': consultation.reference, 'from': old_status, 'to': new_status},
                ip=self.get_client_ip(request)
            )

            return Response({'ok': True, 'status': new_status})

        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def add_note(self, request, pk=None):
        consultation = self.get_object()
        note = request.data.get('note')

        if note:
            consultation_note = ConsultationNote.objects.create(
                consultation=consultation,
                admin=request.user,
                note=note
            )

            ActivityLog.objects.create(
                admin=request.user,
                action='note_added',
                entity_type='consultation',
                entity_id=str(consultation.id),
                details={'note_id': consultation_note.id},
                ip=self.get_client_ip(request)
            )

            return Response(
                ConsultationNoteSerializer(consultation_note).data,
                status=status.HTTP_201_CREATED
            )

        return Response({'error': 'Note is required'}, status=status.HTTP_400_BAD_REQUEST)

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


@method_decorator(csrf_exempt, name='dispatch')
class ConsultationPublicView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ConsultationCreateSerializer(data=request.data)
        if serializer.is_valid():
            import secrets
            year = datetime.now().year
            suffix = secrets.token_hex(3).upper()[:6]
            reference = f'FT-{year}-{suffix}'
            
            consultation = serializer.save(
                reference=reference,
                status='pending',
                source='website'
            )
            
            return Response({
                'reference': reference,
                'status': 'pending',
                'message': 'Your consultation request has been received.'
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        status_filter = self.request.query_params.get('status')
        search = self.request.query_params.get('search', '')

        if status_filter and status_filter != 'all':
            queryset = queryset.filter(status=status_filter)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(email__icontains=search) |
                Q(subject__icontains=search)
            )

        return queryset.order_by('-created_at')

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response({'items': serializer.data})

    def create(self, request):
        serializer = ContactMessageCreateSerializer(data=request.data)
        if serializer.is_valid():
            message = serializer.save(status='new')
            return Response(
                ContactMessageSerializer(message).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        message = self.get_object()
        status = request.data.get('status')
        if status:
            message.status = status
            message.save()
        return Response(ContactMessageSerializer(message).data)


@method_decorator(csrf_exempt, name='dispatch')
class ContactMessagePublicView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContactMessageCreateSerializer(data=request.data)
        if serializer.is_valid():
            message = serializer.save(status='new')
            return Response({
                'message': 'Your message has been received.'
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Consultation stats
        consultation_stats = Consultation.objects.values('status').annotate(
            count=Count('id')
        )
        consultations_by_status = {item['status']: item['count'] for item in consultation_stats}
        total_consultations = sum(consultations_by_status.values())

        # Content counts
        content_stats = {
            'services': Service.objects.count(),
            'destinations': Destination.objects.count(),
            'articles_published': Article.objects.filter(status='published').count(),
            'articles_draft': Article.objects.filter(status='draft').count(),
            'packages': Package.objects.count(),
            'experts': Expert.objects.count(),
            'faqs': FAQ.objects.count(),
        }

        # Payment stats
        payment_stats = Payment.objects.filter(status='successful').aggregate(
            successful_amount=Sum('amount_minor'),
            successful_count=Count('id')
        )
        pending_payments = Payment.objects.filter(status='pending').count()
        failed_payments = Payment.objects.filter(status='failed').count()

        # Unread messages
        unread_messages = ContactMessage.objects.filter(status='new').count()

        # Recent consultations
        recent_consultations = Consultation.objects.select_related(
            'service', 'destination'
        ).order_by('-created_at')[:8]

        # Recent activity
        recent_activity = ActivityLog.objects.select_related(
            'admin'
        ).order_by('-created_at')[:8]

        # Consultations by day (last 14 days)
        consultations_by_day = []
        for i in range(14):
            date = timezone.now() - timedelta(days=13-i)
            count = Consultation.objects.filter(
                created_at__date=date.date()
            ).count()
            consultations_by_day.append({
                'date': date.date().isoformat(),
                'count': count
            })

        return Response({
            'consultations': {
                'total': total_consultations,
                'pending': consultations_by_status.get('pending', 0),
                'under_review': consultations_by_status.get('under_review', 0),
                'contacted': consultations_by_status.get('contacted', 0),
                'in_progress': consultations_by_status.get('in_progress', 0),
                'approved': consultations_by_status.get('approved', 0),
                'rejected': consultations_by_status.get('rejected', 0),
                'completed': consultations_by_status.get('completed', 0),
            },
            'content': content_stats,
            'payments': {
                'successfulAmountMinor': payment_stats['successful_amount'] or 0,
                'successfulCount': payment_stats['successful_count'] or 0,
                'pendingCount': pending_payments,
                'failedCount': failed_payments,
                'currency': 'USD',
            },
            'unreadMessages': unread_messages,
            'recentConsultations': ConsultationSerializer(recent_consultations, many=True).data,
            'recentActivity': ActivityLogSerializer(recent_activity, many=True).data,
            'consultationsByDay': consultations_by_day,
        })


class SiteDataView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        settings_dict = {setting.key: setting.value for setting in SiteSetting.objects.all()}

        return Response({
            'settings': settings_dict,
            'services': ServiceSerializer(Service.objects.filter(published=True).order_by('sort_order', 'id'), many=True).data,
            'destinations': DestinationSerializer(Destination.objects.filter(published=True).order_by('sort_order', 'id'), many=True).data,
            'packages': PackageSerializer(Package.objects.filter(visible=True).order_by('sort_order', 'id'), many=True).data,
            'experts': ExpertSerializer(Expert.objects.filter(published=True).order_by('sort_order', 'id'), many=True).data,
            'faqs': FAQSerializer(FAQ.objects.filter(published=True).order_by('sort_order', 'id'), many=True).data,
            'testimonials': TestimonialSerializer(Testimonial.objects.filter(published=True).order_by('sort_order', 'id'), many=True).data,
            'categories': ArticleCategorySerializer(ArticleCategory.objects.all().order_by('sort_order', 'id'), many=True).data,
            'articles': ArticleSerializer(Article.objects.filter(status='published').order_by('-published_at', '-id')[:6], many=True).data,
            'contentVerified': False,
            'payment': {
                'enabled': False,
                'provider': 'stripe',
                'currency': 'USD',
            },
        })


class SettingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        settings_dict = {setting.key: setting.value for setting in SiteSetting.objects.all()}
        legal_pages = LegalPage.objects.all()

        return Response({
            'settings': settings_dict,
            'legal': LegalPageSerializer(legal_pages, many=True).data
        })

    def put(self, request):
        settings = request.data.get('settings', {})
        for key, value in settings.items():
            SiteSetting.objects.update_or_create(
                key=key,
                defaults={'value': str(value)}
            )
        return Response({'ok': True})


class LegalDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, slug):
        try:
            page = LegalPage.objects.get(slug=slug)
            page.title_en = request.data.get('title_en', page.title_en)
            page.title_fa = request.data.get('title_fa', page.title_fa)
            page.body_en = request.data.get('body_en', page.body_en)
            page.body_fa = request.data.get('body_fa', page.body_fa)
            page.save()
            return Response({'ok': True})
        except LegalPage.DoesNotExist:
            return Response({'error': 'Page not found'}, status=status.HTTP_404_NOT_FOUND)


class PaymentsViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.select_related('consultation', 'package').all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        status_filter = self.request.query_params.get('status')
        search = self.request.query_params.get('search', '')

        if status_filter and status_filter != 'all':
            queryset = queryset.filter(status=status_filter)
        if search:
            queryset = queryset.filter(
                Q(reference__icontains=search) |
                Q(provider_checkout_id__icontains=search) |
                Q(consultation__reference__icontains=search)
            )

        return queryset.order_by('-created_at')

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response({'items': serializer.data})


class UploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if 'image' not in request.FILES:
            return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)

        image = request.FILES['image']
        
        # Simple implementation - save to public/uploads
        import os
        from django.conf import settings
        
        upload_dir = os.path.join(settings.BASE_DIR, 'public', 'uploads')
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        import uuid
        ext = os.path.splitext(image.name)[1]
        filename = f"{uuid.uuid4()}{ext}"
        filepath = os.path.join(upload_dir, filename)
        
        with open(filepath, 'wb+') as destination:
            for chunk in image.chunks():
                destination.write(chunk)
        
        url = f"/uploads/{filename}"
        return Response({'url': url})
