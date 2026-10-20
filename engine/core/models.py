import os
from io import BytesIO
from PIL import Image
from django.core.files.base import ContentFile
from django.db import models

def converter_para_webp(imagem, max_width=1200, qualidade=80):
    """
    Redimensiona e converte qualquer imagem enviada (JPG, PNG) para WebP comprimido.
    """
    if not imagem:
        return imagem

    img = Image.open(imagem)

    # Converte imagens RGBA/P para RGB se necessário
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")

    # Redimensiona mantendo a proporção caso seja muito grande
    if img.width > max_width:
        proporcao = max_width / float(img.width)
        altura_proporcional = int((float(img.height) * float(proporcao)))
        img = img.resize((max_width, altura_proporcional), Image.Resampling.LANCZOS)

    output = BytesIO()
    img.save(output, format='WEBP', quality=qualidade, optimize=True)
    output.seek(0)

    # Altera a extensão do arquivo para .webp
    nome_sem_extensao = os.path.splitext(imagem.name)[0]
    novo_nome = f"{nome_sem_extensao}.webp"

    return ContentFile(output.read(), name=novo_nome)

class Categoria(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    # Slug opcional para ajudar na organização de URLs ou filtros no frontend
    slug = models.SlugField(max_length=100, unique=True, blank=True, null=True)

    def __str__(self):
        return self.nome

    def save(self, *args, **kwargs):
        # Transforma o nome em caixa alta automaticamente para manter o padrão que você já usava
        self.nome = self.nome.upper()
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.nome)
        super().save(*args, **kwargs)

class Servico(models.Model):
    titulo = models.CharField(max_length=100)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='servicos')
    imagem = models.ImageField(upload_to='portfolio/')
    video_url = models.URLField(blank=True, null=True) # Caso queira linkar do YouTube/Drive
    criado_em = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        # Converte para WebP apenas se houver um novo arquivo de imagem sendo salvo
        if self.imagem and (not self.pk or 'imagem' in kwargs.get('update_fields', [])):
            self.imagem = converter_para_webp(self.imagem)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.titulo} - {self.categoria.nome}"

class Depoimento(models.Model):
    nome_cliente = models.CharField(max_length=100)
    texto = models.TextField()
    estrelas = models.IntegerField(default=5)
    foto_cliente = models.ImageField(upload_to='depoimentos/', blank=True, null=True)
    exibir_no_site = models.BooleanField(default=False)
    data_envio = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        if self.foto_cliente:
            self.foto_cliente = converter_para_webp(self.foto_cliente)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nome_cliente
 
class Contato(models.Model):
    nome = models.CharField(max_length=150)
    whatsapp = models.CharField(max_length=25)    
    servico = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='contatos')    
    mensagem = models.TextField()    
    lido = models.BooleanField(default=False)    
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome} - {self.servico}"
    
    class Meta:
        ordering = ['-criado_em'] # Organiza para as mensagens mais novas aparecerem primeiro 
    
class Video(models.Model):
    titulo = models.CharField(max_length=150)
    url_video = models.URLField(help_text="Insira o link do YouTube ou Vimeo")
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo    
    


class RedesSociais(models.Model):
    instagram = models.URLField(max_length=255, blank=True, null=True)
    facebook = models.URLField(max_length=255, blank=True, null=True)
    youtube = models.URLField(max_length=255, blank=True, null=True)
    whatsapp = models.URLField(max_length=255, blank=True, null=True)
    telefone = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        verbose_name = "Rede Social"
        verbose_name_plural = "Redes Sociais"

    def __str__(self):
        return "Configuração de Links do Rodapé"
    
class AboutUs(models.Model):
    titulo_rodape = models.CharField(max_length=100, blank=True, null=True, default="STYLLO VIDROS")
    descricao_rodape = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Configuração do Rodapé"
        verbose_name_plural = "Configurações do Rodapé"

    def __str__(self):
        return "Configurações Gerais do Rodapé"
    
class Album(models.Model):
    titulo = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='albuns')
    criado_em = models.DateTimeField(auto_now_add=True)
    visivel = models.BooleanField(default=True)
    
    # Campo que vai guardar a Chave Estrangeira para a FOTO escolhida como capa
    # null=True e blank=True são necessários porque quando criamos o álbum, ele ainda não tem fotos cadastradas
    capa = models.ForeignKey(
        'AlbumFoto', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='e_capa_de'
    )

    def __str__(self):
        return self.titulo


class AlbumFoto(models.Model):
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='fotos')
    imagem = models.ImageField(upload_to='portfoli_albuns/')
    criado_em = models.DateTimeField(auto_now_add=True)
    def save(self, *args, **kwargs):
        if self.imagem:
            self.imagem = converter_para_webp(self.imagem)
        super().save(*args, **kwargs)
    def __str__(self):
        return f"Foto de {self.album.titulo} ({self.id})"   
