import os
from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import AlbumFoto, Depoimento, Servico 

@receiver(post_delete, sender=AlbumFoto)
def deletar_arquivo_foto_album(sender, instance, **kwargs):
    """
    Remove o arquivo se ele estiver salvo localmente. 
    Se estiver no Cloudinary, evita o erro de acessar o atributo '.path'.
    """
    if instance.imagem:
        try:
            # 🔥 Correção: Só tenta apagar se o arquivo tiver um caminho local válido (.path)
            if hasattr(instance.imagem, 'path') and os.path.isfile(instance.imagem.path):
                os.remove(instance.imagem.path)
        except NotImplementedError:
            # Se cair aqui, significa que está na nuvem (Cloudinary), 
            # o armazenamento remoto cuida da remoção e evitamos o erro 500.
            pass


@receiver(post_delete, sender=Depoimento)
def deletar_foto_depoimento(sender, instance, **kwargs):
    if hasattr(instance, 'foto') and instance.foto: 
        try:
            if hasattr(instance.foto, 'path') and os.path.isfile(instance.foto.path):
                os.remove(instance.foto.path)
        except NotImplementedError:
            pass
    elif hasattr(instance, 'imagem') and instance.imagem:
        try:
            if hasattr(instance.imagem, 'path') and os.path.isfile(instance.imagem.path):
                os.remove(instance.imagem.path)
        except NotImplementedError:
            pass


@receiver(post_delete, sender=Servico)
def deletar_imagem_servico(sender, instance, **kwargs):
    """
    Sempre que um Serviço for excluído do banco de dados,
    este signal apaga o arquivo físico da imagem correspondente se for local.
    """
    if hasattr(instance, 'imagem') and instance.imagem:
        try:
            if hasattr(instance.imagem, 'path') and os.path.isfile(instance.imagem.path):
                os.remove(instance.imagem.path)
        except NotImplementedError:
            pass