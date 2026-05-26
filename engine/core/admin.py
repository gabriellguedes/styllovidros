from django.contrib import admin
from .models import Servico, Depoimento, Contato, Video, Album, AlbumFoto

@admin.register(Servico)
class ServicoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'categoria', 'criado_em')
    list_filter = ('categoria',)
    search_fields = ('titulo',)

@admin.register(Depoimento)
class DepoimentoAdmin(admin.ModelAdmin):
    list_display = ('nome_cliente', 'estrelas', 'exibir_no_site')
    list_editable = ('exibir_no_site',)
    list_filter = ('estrelas', 'exibir_no_site')
    search_fields = ('nome_cliente', 'texto')

@admin.register(Contato)
class ContatoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'email', 'whatsapp', 'mensagem', 'data_envio', 'lido')
    list_editable = ('lido',)
    list_filter = ('lido', 'data_envio')
    search_fields = ('nome', 'email', 'whatsapp')

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'url_video', 'criado_em')
    search_fields = ('titulo',)

@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display=('titulo', 'descricao', 'categoria', 'criado_em')
    search_fields=('titulo',)

@admin.register(AlbumFoto)
class AlbumFotoAdmin(admin.ModelAdmin):
    list_display=('id', 'album', 'imagem', 'criado_em')
    search_fields=('id',)
