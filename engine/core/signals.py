import os
from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import AlbumFoto, Depoimento, Servico 


@receiver(post_delete, sender=AlbumFoto)
def deletar_arquivo_foto_album(sender, instance, **kwargs):
    
    if instance.imagem:
        if os.path.isfile(instance.imagem.path):
            os.remove(instance.imagem.path)


@receiver(post_delete, sender=Depoimento)
def deletar_foto_depoimento(sender, instance, **kwargs):
        
    if hasattr(instance, 'foto') and instance.foto: 
        if os.path.isfile(instance.foto.path):
            os.remove(instance.foto.path)
    elif hasattr(instance, 'imagem') and instance.imagem:
        if os.path.isfile(instance.imagem.path):
            os.remove(instance.imagem.path)

@receiver(post_delete, sender=Servico)
def deletar_imagem_servico(sender, instance, **kwargs):
    """
    Sempre que um Serviço for excluído do banco de dados,
    este signal apaga o arquivo físico da imagem correspondente no servidor.
    """
    
    if hasattr(instance, 'imagem') and instance.imagem:
        if os.path.isfile(instance.imagem.path):
            os.remove(instance.imagem.path)