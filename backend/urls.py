"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse, FileResponse
from django.conf import settings
from django.conf.urls.static import static
import os

def api_root(request):
    return JsonResponse({
        'service': 'FaraTech API',
        'version': '1.0.0',
        'endpoints': {
            'public': '/api/public/',
            'admin': '/api/admin/',
            'services': '/api/services/',
            'destinations': '/api/destinations/',
            'admin_panel': '/admin/'
        }
    })

def serve_upload(request, filename):
    file_path = os.path.join(settings.BASE_DIR, 'public', 'uploads', filename)
    print(f"Serving file: {file_path}, exists: {os.path.exists(file_path)}")
    if os.path.exists(file_path):
        import mimetypes
        content_type, encoding = mimetypes.guess_type(file_path)
        print(f"Content-Type: {content_type}, Encoding: {encoding}")
        response = FileResponse(open(file_path, 'rb'), content_type=content_type or 'application/octet-stream')
        response['Content-Disposition'] = f'inline; filename="{filename}"'
        return response
    from django.http import Http404
    raise Http404

urlpatterns = [
    path('', api_root),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('uploads/<str:filename>', serve_upload, name='serve-upload'),
]

if settings.DEBUG:
    urlpatterns += static('uploads/', document_root='public/uploads')
    urlpatterns += static('images/', document_root='public/images')
