from django.contrib.auth.models import User
from rest_framework import viewsets
from .models import Servico, Depoimento, Contato, Video, RedesSociais
from .serializers import ServicoSerializer, RedesSociaisSerializer ,DepoimentoSerializer, ContatoSerializer, VideoSerializer, UserSerializer, RedesSociais
from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated

class ServicoViewSet(viewsets.ModelViewSet):
    queryset = Servico.objects.all().order_by('-criado_em')
    serializer_class = ServicoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class DepoimentoViewSet(viewsets.ModelViewSet):
    queryset = Depoimento.objects.all().order_by('-data_envio')
    serializer_class = DepoimentoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # Endpoint extra para pegar apenas os aprovados (usar no Frontend Home)
    def get_queryset(self):
        approved_only = self.request.query_params.get('approved')
        if approved_only:
            return Depoimento.objects.filter(exibir_no_site=True).order_by('-data_envio')
        return super().get_queryset()

class ContatoViewSet(viewsets.ModelViewSet):
    queryset = Contato.objects.all()
    serializer_class = ContatoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all().order_by('-criado_em')
    serializer_class = VideoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-id')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class RedesSociaisViewSet(viewsets.ModelViewSet):
    queryset = RedesSociais.objects.all()
    serializer_class = RedesSociaisSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    # Pequena melhoria lógica: se o frontend pedir dados e o banco estiver vazio, 
    # cria automaticamente o primeiro registro com campos vazios para evitar erros 404.
    def list(self, request, *args, **kwargs):
        if not RedesSociais.objects.exists():
            RedesSociais.objects.create(instagram="", facebook="", whatsapp="", youtube="", telefone="")
        return super().list(request, *args, **kwargs)