from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServicoViewSet, CategoriaViewSet, AboutUsViewSet, RedesSociaisViewSet, DepoimentoViewSet, ContatoViewSet, VideoViewSet, UsuarioViewSet


# O Router cria automaticamente as rotas GET, POST, PUT e DELETE
router = DefaultRouter()
router.register(r'servicos', ServicoViewSet)
router.register(r'categorias', CategoriaViewSet) 
router.register(r'depoimentos', DepoimentoViewSet)
router.register(r'contatos', ContatoViewSet)
router.register(r'videos', VideoViewSet)
router.register(r'redes', RedesSociaisViewSet, basename='redes')
router.register(r'usuarios', UsuarioViewSet, basename='usuarios')
router.register(r'aboutUs', AboutUsViewSet, basename='aboutUs')

urlpatterns = [
    path('', include(router.urls)),
]