import React, { useState, useCallback } from "react";
import api from "../api";
import Cropper from "react-easy-crop";
import { MessageSquare, Star, ArrowLeft, Camera, Check, Crop, X } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const EnviarDepoimento = () => {
  const [formData, setFormData] = useState({
    nome: "",
    cidade: "",
    comentario: "",
    nota: 5,
  });

  // Estados para o corte de imagem (Crop)
  const [fotoOriginalUrl, setFotoOriginalUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fotoFinalBlob, setFotoFinalBlob] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

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

  // 1. Quando o usuário escolhe um arquivo do computador/celular
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const urlTemp = URL.createObjectURL(file);
      setFotoOriginalUrl(urlTemp);
      setIsCropping(true); // Abre o modal de recorte
    }
  };

  // 2. Callback disparado pelo Cropper ao movimentar/zoom na foto
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // 3. Função auxiliar para desenhar o corte num Canvas e gerar o arquivo final
  const gerarImagemCortada = async () => {
    try {
      const image = new Image();
      image.src = fotoOriginalUrl;
      await new Promise((resolve) => (image.onload = resolve));

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Define o tamanho final baseado no corte feito pelo usuário
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      // Converte o canvas para um Blob binário (formato de arquivo de imagem)
      canvas.toBlob((blob) => {
        if (!blob) return;
        setFotoFinalBlob(blob);
        const finalUrl = URL.createObjectURL(blob);
        setPreviewUrl(finalUrl); // Atualiza o preview no formulário
        setIsCropping(false); // Fecha o modal de corte
      }, "image/jpeg", 0.9);
    } catch (e) {
      console.error("Erro ao cortar a imagem:", e);
      toast.error("Erro ao processar o ajuste da imagem.");
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
      const data = new FormData();
      data.append("nome_cliente", formData.nome);
      data.append("texto", formData.comentario);
      data.append("estrelas", Number(formData.nota));
      data.append("exibir_no_site", false);

      // Se houver a imagem cortada via canvas, envia no FormData
      if (fotoFinalBlob) {
        data.append("foto_cliente", fotoFinalBlob, "perfil.jpg");
      }

      await api.post("depoimentos/", data);

      toast.success("Depoimento enviado com sucesso! Obrigado pelo feedback.", {
        id: toastId,
      });
      setEnviado(true);
      setFormData({ nome: "", cidade: "", comentario: "", nota: 5 });
      setFotoFinalBlob(null);
      setPreviewUrl(null);
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

            {/* Avaliação em Estrelas Dinâmicas */}
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

            {/* Upload e Recorte de Foto */}
            <div className="testimonial-input-group">
              <label>Sua Foto de Perfil (Opcional)</label>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                {previewUrl ? (
                  <div style={{ position: "relative", width: "60px", height: "60px" }}>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2px solid #a04ef6" }}
                    />
                    <button
                      type="button"
                      onClick={() => setIsCropping(true)}
                      title="Editar corte"
                      style={{ position: "absolute", bottom: "-4px", right: "-4px", background: "#8a2be2", border: "none", color: "#fff", borderRadius: "50%", padding: "4px", cursor: "pointer" }}
                    >
                      <Crop size={12} />
                    </button>
                  </div>
                ) : null}

                <label className="file-input-label" style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "rgba(0,0,0,0.3)", border: "1px dashed rgba(255,255,255,0.2)", borderRadius: "8px", color: "rgba(255,255,255,0.8)" }}>
                  {previewUrl ? <Check size={18} color="#81c784" /> : <Camera size={18} color="#a04ef6" />}
                  <span style={{ fontSize: "0.85rem" }}>
                    {previewUrl ? "Alterar foto selecionada" : "Escolher foto de perfil"}
                  </span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    style={{ display: "none" }} 
                  />
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

      {/* --- MODAL PARA CORTE DE FOTO --- */}
      {isCropping && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ position: "relative", width: "100%", maxWidth: "450px", height: "320px", background: "#1a1a1a", borderRadius: "12px", overflow: "hidden" }}>
            <Cropper
              image={fotoOriginalUrl}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          {/* Controles de Zoom e Confirmação */}
          <div style={{ width: "100%", maxWidth: "450px", marginTop: "15px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => setZoom(e.target.value)}
              style={{ width: "100%", accentColor: "#a04ef6" }}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setIsCropping(false)}
                style={{ flex: 1, padding: "10px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={gerarImagemCortada}
                style={{ flex: 1, padding: "10px", background: "#8a2be2", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
              >
                Confirmar Corte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnviarDepoimento;