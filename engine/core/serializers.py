from rest_framework import serializers
from .models import Servico, Depoimento, Contato, Video

class ServicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servico
        fields = '__all__'

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
