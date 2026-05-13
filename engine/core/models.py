from django.db import models

class Servico(models.Model):
    CATEGORIAS = [
        ('BOX', 'Box de Banheiro'),
        ('SACADA', 'Fechamento de Sacada'),
        ('ESPELHO', 'Espelhos'),
        ('VIDRO', 'Vidro Temperado/Laminado'),
    ]
    titulo = models.CharField(max_length=100)
    categoria = models.CharField(max_length=10, choices=CATEGORIAS)
    imagem = models.ImageField(upload_to='portfolio/')
    video_url = models.URLField(blank=True, null=True) # Caso queira linkar do YouTube/Drive
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.titulo} - {self.categoria}"

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