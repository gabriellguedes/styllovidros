import React, { useState } from "react";
import api from "../api";
import { MessageSquare, Star, ArrowLeft, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const EnviarDepoimento = () => {
  const [formData, setFormData] = useState({
    nome: "",
    cidade: "",
    comentario: "",
    nota: 5,
  });
  
  // Estado auxiliar para o efeito dinâmico do hover nas estrelas
  const [hoverNota, setHoverNota] = useState(0);
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const MAX_CHAR = 160;

  const handleComentarioChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_CHAR) {
      setFormData({ ...formData, comentario: text });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome.trim() || !formData.comentario.trim()) {
      toast.error("Por favor, preencha o seu nome e a sua mensagem.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Enviando seu depoimento...");

    try {
      // CORREÇÃO: Enviando "estrelas" para bater exatamente com o campo do models.py do Django
      await api.post("depoimentos/", {
        nome_cliente: formData.nome,
        texto: formData.comentario,
        estrelas: Number(formData.nota),
        exibir_no_site: false, // Fica pendente de aprovação no painel administrativo
      });

      toast.success("Depoimento enviado com sucesso! Obrigado pelo feedback.", {
        id: toastId,
      });
      setEnviado(true);
      setFormData({ nome: "", cidade: "", comentario: "", nota: 5 });
    } catch (err) {
      console.error("Erro ao enviar depoimento:", err);
      toast.error("Erro ao enviar o depoimento. Tente novamente.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="testimonial-page-container">
      <div className="testimonial-form-card">
        
        {/* Cabeçalho */}
        <div className="testimonial-form-header">
          <h2>Sua <span>Opinião</span> importa!</h2>
          <p>
            Conte como foi a sua experiência com os serviços da <strong>Styllo Vidros</strong>.
          </p>
        </div>

        {enviado ? (
          <div
            style={{
              textAlign: "center",
              padding: "20px 0",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div
              style={{
                background: "rgba(138, 43, 226, 0.15)",
                border: "1px solid rgba(138, 43, 226, 0.3)",
                color: "#fff",
                padding: "20px",
                borderRadius: "12px",
              }}
            >
              <h3 style={{ marginBottom: "6px", color: "#a04ef6" }}>Mensagem Recebida!</h3>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.85)" }}>
                O seu depoimento foi enviado com sucesso e passará por uma breve validação antes de aparecer na nossa página.
              </p>
            </div>

            <button
              onClick={() => setEnviado(false)}
              className="btn-send-testimonial"
              style={{ width: "100%" }}
            >
              Enviar Outro Depoimento
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="testimonial-form">
            
            {/* Nome */}
            <div className="testimonial-input-group">
              <label>Seu Nome *</label>
              <input
                type="text"
                placeholder="Ex: Maria Silva"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>

            {/* Avaliação em Estrelas Dinâmicas e Interativas */}
            <div className="testimonial-input-group">
              <label>Sua Nota para o Serviço ({formData.nota} {formData.nota === 1 ? "estrela" : "estrelas"})</label>
              <div 
                style={{ display: "flex", gap: "10px", padding: "6px 0", alignItems: "center" }}
                onMouseLeave={() => setHoverNota(0)}
              >
                {[1, 2, 3, 4, 5].map((estrela) => {
                  const ativa = estrela <= (hoverNota || formData.nota);
                  return (
                    <Star
                      key={estrela}
                      size={30}
                      onClick={() => setFormData({ ...formData, nota: estrela })}
                      onMouseEnter={() => setHoverNota(estrela)}
                      style={{
                        cursor: "pointer",
                        fill: ativa ? "#a04ef6" : "transparent",
                        color: ativa ? "#a04ef6" : "rgba(255, 255, 255, 0.3)",
                        transition: "transform 0.15s ease, color 0.15s ease",
                        transform: hoverNota === estrela ? "scale(1.15)" : "scale(1)",
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Mensagem e Contador */}
            <div className="testimonial-input-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label>Sua Mensagem *</label>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>
                  {MAX_CHAR - formData.comentario.length} caracteres restantes
                </span>
              </div>
              <textarea
                placeholder="Conte os detalhes do seu projeto (Box, Espelho, Cortina de Vidro...)"
                rows={4}
                value={formData.comentario}
                onChange={handleComentarioChange}
                required
              />
            </div>

            {/* Upload de Foto (Opcional) */}
            <div className="testimonial-input-group">
              <label>Sua Foto (Opcional)</label>
              <div className="file-input-wrapper">
                <label className="file-input-label">
                  <Camera size={18} />
                  <span>Escolher uma foto de perfil</span>
                  <input type="file" accept="image/*" disabled />
                </label>
              </div>
            </div>

            {/* Botão de Envio */}
            <button
              type="submit"
              disabled={loading}
              className="btn-send-testimonial"
            >
              {loading ? "Enviando..." : "Enviar Depoimento"}
            </button>
          </form>
        )}

        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Voltar para a página inicial
        </Link>

      </div>
    </div>
  );
};

export default EnviarDepoimento;