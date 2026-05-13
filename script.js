// Efeito de mudar o header ao rolar a página
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 0);
});

// Enviar formulário direto para o WhatsApp (Opcional, mas muito útil)
document.getElementById('lead-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = this.querySelectorAll('input')[0].value;
    const servico = this.querySelector('select').value;
    const whats = "5561992987278";
    
    const mensagem = `Olá! Meu nome é ${nome}. Gostaria de um orçamento para ${servico}.`;
    const url = `https://wa.me/${whats}?text=${encodeURIComponent(mensagem)}`;
    
    window.open(url, '_blank');
});