import os
import django
import json

# 1. Configura a variável de ambiente das settings do Django
# (Ajuste 'engine.settings' caso o nome da sua pasta de configurações seja diferente)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'engine.settings')
django.setup()

from engine.core.models import Categoria

dados_json = """
[
  {"nome": "JANELA"},
  {"nome": "PORTA"},
  {"nome": "BOX PARA BANHEIRO"},
  {"nome": "ESPELHO"},
  {"nome": "CORTINA DE VIDRO"},
  {"nome": "GUARDA-CORPO"},
  {"nome": "COBERTURA DE VIDRO"},
  {"nome": "FACHADA / PELE DE VIDRO"},
  {"nome": "DIVISÓRIA"},
  {"nome": "PRATELEIRA E BANCADA"},
  {"nome": "TAMPOS DE MESA"},
  {"nome": "ENVAZAMENTO / FECHAMENTO DE SACADA"}
]
"""

categorias = json.loads(dados_json)

for cat in categorias:
    obj, created = Categoria.objects.get_or_create(nome=cat["nome"])
    if created:
        print(f"✅ Criada: {obj.nome}")
    else:
        print(f"⚠️ Já existia: {obj.nome}")
