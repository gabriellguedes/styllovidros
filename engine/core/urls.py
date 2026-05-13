from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServicoViewSet, DepoimentoViewSet, ContatoViewSet, VideoViewSet

# O Router cria automaticamente as rotas GET, POST, PUT e DELETE
router = DefaultRouter()
router.register(r'servicos', ServicoViewSet)
router.register(r'depoimentos', DepoimentoViewSet)
router.register(r'contatos', ContatoViewSet)
router.register(r'videos', VideoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]