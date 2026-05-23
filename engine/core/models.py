from django.db import models

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

    def __str__(self):
        return f"{self.titulo} - {self.categoria.nome}"

class Depoimento(models.Model):
    nome_cliente = models.CharField(max_length=100)
    texto = models.TextField()
    estrelas = models.IntegerField(default=5)
    foto_cliente = models.ImageField(upload_to='depoimentos/', blank=True, null=True)
    exibir_no_site = models.BooleanField(default=False)
    data_envio = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.nome_cliente
    
class Contato(models.Model):
    nome = models.CharField(max_length=150)
    email = models.EmailField()
    whatsapp = models.CharField(max_length=20)
    mensagem = models.TextField()
    data_envio = models.DateTimeField(auto_now_add=True)
    lido = models.BooleanField(default=False)

    def __str__(self):
        return f"Contato de {self.nome}"
    
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