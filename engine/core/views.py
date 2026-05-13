from rest_framework import viewsets
from .models import Servico, Depoimento, Contato, Video
from .serializers import ServicoSerializer, DepoimentoSerializer, ContatoSerializer, VideoSerializer

class ServicoViewSet(viewsets.ModelViewSet):
    queryset = Servico.objects.all().order_by('-criado_em')
    serializer_class = ServicoSerializer

class DepoimentoViewSet(viewsets.ModelViewSet):
    queryset = Depoimento.objects.all().order_by('-data_envio')
    serializer_class = DepoimentoSerializer

    # Endpoint extra para pegar apenas os aprovados (usar no Frontend Home)
    def get_queryset(self):
        approved_only = self.request.query_params.get('approved')
        if approved_only:
            return Depoimento.objects.filter(exibir_no_site=True).order_by('-data_envio')
        return super().get_queryset()

class ContatoViewSet(viewsets.ModelViewSet):
    queryset = Contato.objects.all()
    serializer_class = ContatoSerializer

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all().order_by('-criado_em')
    serializer_class = VideoSerializer