import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Camera, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

const EnviarDepoimento = () => {
  // Estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [regiao, setRegiao] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [foto, setFoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Estados de controle de envio
  const [enviando, setEnviando] = useState(false);
  const [statusEnvio, setStatusEnvio] = useState(null); // 'sucesso' ou 'erro'

  // Gerencia a seleção da foto e cria a pré-visualização
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setStatusEnvio(null);

    // Estrutura dos dados para enviar para sua API / Banco de dados futuramente
    const dadosDepoimento = {
      nome,
      regiao,
      mensagem,
      foto,
    };

    try {
      // Simulação de uma requisição de rede (substitua pelo seu fetch/axios se necessário)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setStatusEnvio("sucesso");
      // Limpa o formulário após o sucesso
      setNome("");
      setRegiao("");
      setMensagem("");
      setFoto(null);
      setPreviewUrl("");
    } catch (error) {
      setStatusEnvio("erro");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="testimonial-page-container">
      <div className="testimonial-form-card">
        <div className="testimonial-form-header">
          <h2>
            Sua <span>Opinião</span> importa!
          </h2>
          <p>
            Conte como foi a sua experiência com os serviços da Styllo Vidros.
          </p>
        </div>

        {/* Mensagens de Feedback */}
        {statusEnvio === "sucesso" && (
          <div
            className="form-message-success"
            style={{
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <CheckCircle2 color="#25d366" />
            Depoimento enviado com sucesso! Obrigado por fazer parte da nossa
            história.
          </div>
        )}

        {statusEnvio === "erro" && (
          <div
            className="form-message-error"
            style={{
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <AlertCircle color="#ff4d4d" />
            Houve um erro ao enviar seu depoimento. Tente novamente.
          </div>
        )}

        <form className="testimonial-form" onSubmit={handleSubmit}>
          {/* Campo Nome */}
          <div className="testimonial-input-group">
            <label htmlFor="nome">Seu Nome</label>
            <input
              id="nome"
              type="text"
              placeholder="Ex: Maria Silva"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              disabled={enviando}
            />
          </div>

          {/* Campo Cidade/Região */}
          <div className="testimonial-input-group">
            <label htmlFor="regiao">Sua Cidade / Região</label>
            <input
              id="regiao"
              type="text"
              placeholder="Ex: Vicente Pires - DF"
              value={regiao}
              onChange={(e) => setRegiao(e.target.value)}
              required
              disabled={enviando}
            />
          </div>

          {/* Campo Mensagem */}
          <div className="testimonial-input-group">
            <label htmlFor="mensagem">Sua Mensagem</label>
            <textarea
              id="mensagem"
              placeholder="Conte os detalhes do seu projeto (Box, Espelho, Cortina de Vidro...)"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              required
              disabled={enviando}
            ></textarea>
          </div>

          {/* Upload de Foto com Preview Dinâmico */}
          <div className="testimonial-input-group">
            <label>Sua Foto (Opcional)</label>

            {previewUrl && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "10px",
                }}
              >
                {/* Reutiliza o wrapper hexagonal do CSS para mostrar a foto cortada em tempo real */}
                <div
                  className="testimonial-avatar-wrapper"
                  style={{ margin: "0" }}
                >
                  <img
                    src={previewUrl}
                    alt="Preview do avatar"
                    className="testimonial-img"
                  />
                </div>
              </div>
            )}

            <div className="file-input-wrapper">
              <label htmlFor="user-photo" className="file-input-label">
                <Camera size={18} />
                {foto
                  ? "Alterar foto selecionada"
                  : "Escolher uma foto de perfil"}
              </label>
              <input
                id="user-photo"
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                disabled={enviando}
              />
            </div>
          </div>

          {/* Botão de Envio Dinâmico */}
          <button
            type="submit"
            className="btn-send-testimonial"
            disabled={enviando}
          >
            {enviando ? "Enviando avaliação..." : "Enviar Depoimento"}
          </button>
        </form>

        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
};

export default EnviarDepoimento;
