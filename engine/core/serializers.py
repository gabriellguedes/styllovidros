from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Servico, Album, AlbumFoto, Categoria,Depoimento, Contato, Video, RedesSociais, AboutUs


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nome', 'slug']


class ServicoSerializer(serializers.ModelSerializer):
    categoria_detalhes = CategoriaSerializer(source='categoria', read_only=True)
    categoria = serializers.PrimaryKeyRelatedField(queryset=Categoria.objects.all())

    class Meta:
        model = Servico
        fields = ['id', 'titulo', 'categoria', 'categoria_detalhes', 'imagem', 'criado_em']

class DepoimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Depoimento
        fields = '__all__'

class ContatoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contato
        fields = '__all__'

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'

class RedesSociaisSerializer(serializers.ModelSerializer):
    class Meta:
        model = RedesSociais
        fields = ['id', 'instagram', 'facebook', 'whatsapp', 'youtube', 'telefone']

class AboutUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutUs
        fields = [
            'id',
            'titulo_rodape', 
            'descricao_rodape'
        ]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'is_active', 'username', 'email', 'password', 'is_staff']
        extra_kwargs = {
            'password': {'write_only': True}  # A senha nunca é retornada na API por segurança
        }

    def create(self, validated_data):
        # Cria o usuário criptografando a senha corretamente no banco
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        # Define se ele será Administrador Master (is_staff)
        user.is_staff = validated_data.get('is_staff', False)
        user.save()
        return user
    
class AlbumFotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlbumFoto
        fields = ['id', 'imagem', 'criado_em']


class AlbumSerializer(serializers.ModelSerializer):
    # Traz as fotos pertencentes ao álbum automaticamente (GET)
    fotos = AlbumFotoSerializer(many=True, read_only=True)
    categoria_detalhes = CategoriaSerializer(source='categoria', read_only=True)
    
    # Renderiza os dados da capa de forma amigável
    capa_url = serializers.SerializerMethodField()

    class Meta:
        model = Album
        fields = ['id', 'titulo', 'descricao', 'categoria', 'categoria_detalhes', 'capa', 'capa_url', 'fotos']

    def get_capa_url(self, obj):
        if obj.capa:
            return obj.capa.imagem.url
        # Se o usuário não escolheu uma capa, pega a primeira foto do álbum como padrão (Fallback)
        primeira_foto = obj.fotos.first()
        if primeira_foto:
            return primeira_foto.imagem.url
        return None