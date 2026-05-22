from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token
from engine.core.views import CustomAuthToken

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('engine.core.urls')),
    path('api/login/', CustomAuthToken.as_view(), name='api_token_auth'), 
]

# Isso permite que o Django sirva as fotos do portfólio no ambiente de teste
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)