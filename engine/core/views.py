from django.contrib.auth.models import User
from rest_framework import viewsets
from .models import Servico, AlbumFoto, Album, Categoria, Depoimento, Contato, Video, RedesSociais, AboutUs
from .serializers import ServicoSerializer, AlbumFotoSerializer,AlbumSerializer, CategoriaSerializer, AboutUsSerializer, RedesSociaisSerializer ,DepoimentoSerializer, ContatoSerializer, VideoSerializer, UserSerializer, RedesSociais
from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        # É AQUI que enviamos os dados para o React
        return Response({
            'token': token.key,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_staff': user.is_staff  # Retorna True ou False
        })
class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all().order_by('nome')
    serializer_class = CategoriaSerializer
    
    # Define as permissões: Qualquer um pode ver (GET), mas apenas usuários
    # autenticados/administradores podem cadastrar, editar ou apagar.
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticatedOrReadOnly]
        else:
            permission_classes = [IsAdminUser] # Apenas admin gerencia
        return [permission() for permission in permission_classes]   
class ServicoViewSet(viewsets.ModelViewSet):
    queryset = Servico.objects.all().order_by('-criado_em')
    serializer_class = ServicoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

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

class AboutUsViewSet(viewsets.ModelViewSet):
    queryset = AboutUs.objects.all()
    serializer_class = AboutUsSerializer

    def list(self, request, *args, **kwargs):
        # Garante que um registo inicial padrão exista se o banco de dados estiver limpo
        if not AboutUs.objects.exists():
            AboutUs.objects.create(
                titulo_rodape="STYLLO VIDROS",
                descricao_rodape="Com anos de experiência no mercado, a Styllo Vidros é especialista em transformar ambientes através do vidro. Unimos técnica, segurança e design para entregar projetos sob medida que elevam o padrão da sua residência ou empresa. Nossa missão é a transparência em cada detalhe e a satisfação total de nossos clientes." 
            )
        return super().list(request, *args, **kwargs)

class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all().order_by('-criado_em')
    serializer_class = AlbumSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class AlbumFotoViewSet(viewsets.ModelViewSet):
    queryset = AlbumFoto.objects.all()
    serializer_class = AlbumFotoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]