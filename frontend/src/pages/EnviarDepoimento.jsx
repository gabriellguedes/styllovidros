import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Star,
  X,
} from "lucide-react";
import Cropper from "react-easy-crop"; // 🔥 Importa o recortador de imagem
import api from "../api";
import toast from "react-hot-toast";

const EnviarDepoimento = () => {
  const [nome, setNome] = useState("");
  const [avaliacao, setAvaliacao] = useState(5);
  const [hoverAvaliacao, setHoverAvaliacao] = useState(0);
  const [mensagem, setMensagem] = useState("");

  // Estados da imagem e corte
  const [fotoOriginalUrl, setFotoOriginalUrl] = useState(null); // Armazena a imagem crua carregada
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false); // Controla a exibição do modal de corte

  // Estados finais para envio
  const [fotoFinalBlob, setFotoFinalBlob] = useState(null); // O arquivo final cortado
  const [previewUrl, setPreviewUrl] = useState(""); // URL para mostrar no formulário

  const [enviando, setEnviando] = useState(false);
  const [statusEnvio, setStatusEnvio] = useState(null);

  // 1. Detecta a escolha do arquivo original
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFotoOriginalUrl(url);
      setIsCropping(true); // Abre o modal de ajuste automaticamente
    }
  };

  // 2. Salva os pixels da área recortada enquanto o usuário mexe na imagem
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
        croppedAreaPixels.height,
      );

      // Converte o canvas para um Blob binário (formato de arquivo de imagem)
      canvas.toBlob((blob) => {
        if (!blob) return;
        setFotoFinalBlob(blob);
        const finalUrl = URL.createObjectURL(blob);
        setPreviewUrl(finalUrl); // Atualiza o preview no formulário
        setIsCropping(false); // Fecha o modal de corte
      }, "image/jpeg");
    } catch (e) {
      console.error("Erro ao cortar a imagem:", e);
      toast.error("Erro ao processar o ajuste da imagem.");
    }
  };

  // 4. Envio dos dados para o Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setStatusEnvio(null);

    const toastId = toast.loading("Enviando o seu depoimento...");
    const formData = new FormData();
    formData.append("nome_cliente", nome);
    formData.append("avaliacao", avaliacao);
    formData.append("texto", mensagem);

    if (fotoFinalBlob) {
      // Enviamos o blob recortado simulando um arquivo chamado 'avatar.jpg'
      formData.append("foto_cliente", fotoFinalBlob, "avatar.jpg");
    }

    try {
      await api.post("depoimentos/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Depoimento enviado para moderação!", { id: toastId });
      setStatusEnvio("sucesso");

      // Reseta todos os campos
      setNome("");
      setAvaliacao(5);
      setMensagem("");
      setFotoFinalBlob(null);
      setPreviewUrl("");
      setFotoOriginalUrl(null);
    } catch (error) {
      console.error(error);
      toast.error("Houve um problema ao salvar seu depoimento.", {
        id: toastId,
      });
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
            Conte como foi a sua experiência com os serviços da{" "}
            <span className="name-testimonial">Styllo Vidros.</span>
          </p>
        </div>

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
            <CheckCircle2 color="#25d366" /> Depoimento enviado com sucesso!
            Obrigado por fazer parte da nossa história.
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
            <AlertCircle color="#ff4d4d" /> Houve um erro ao enviar seu
            depoimento. Tente novamente.
          </div>
        )}

        <form className="testimonial-form" onSubmit={handleSubmit}>
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

          <div className="testimonial-input-group">
            <label>Sua Nota para o Serviço</label>
            <div
              className="stars-rating-container"
              style={{
                display: "flex",
                gap: "6px",
                marginTop: "4px",
                marginBottom: "4px",
              }}
            >
              {[1, 2, 3, 4, 5].map((estrela) => {
                const ativa = estrela <= (hoverAvaliacao || avaliacao);
                return (
                  <button
                    key={estrela}
                    type="button"
                    disabled={enviando}
                    onClick={() => setAvaliacao(estrela)}
                    onMouseEnter={() => setHoverAvaliacao(estrela)}
                    onMouseLeave={() => setHoverAvaliacao(0)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: enviando ? "default" : "pointer",
                      padding: "4px",
                      transition: "transform 0.1s ease",
                      transform:
                        estrela <= hoverAvaliacao ? "scale(1.15)" : "scale(1)",
                    }}
                  >
                    <Star
                      size={28}
                      fill={ativa ? "var(--accent-purple)" : "none"}
                      color={ativa ? "var(--accent-purple)" : "#666"}
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="testimonial-input-group">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <label htmlFor="mensagem">Sua Mensagem</label>
              {/* 🔥 Contador de caracteres dinâmico */}
              <span
                style={{
                  fontSize: "0.8rem",
                  color: mensagem.length >= 150 ? "#ff4d4d" : "var(--white)",
                }}
              >
                {160 - mensagem.length} caracteres restantes
              </span>
            </div>

            <textarea
              id="mensagem"
              placeholder="Conte os detalhes do seu projeto (Box, Espelho, Cortina de Vidro...)"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              maxLength={160} // 🔥 Limita nativamente a digitação no teclado em 160 letras
              required
              disabled={enviando}
              rows={4}
            ></textarea>
          </div>
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
                <div
                  className="testimonial-avatar-wrapper"
                  style={{ margin: "0" }}
                >
                  <img
                    src={previewUrl}
                    alt="Preview cortado"
                    className="testimonial-img"
                  />
                </div>
              </div>
            )}

            <div className="file-input-wrapper">
              <label htmlFor="user-photo" className="file-input-label">
                <Camera size={18} />
                {fotoFinalBlob
                  ? "Alterar foto ajustada"
                  : "Escolher uma foto de perfil"}
              </label>
              <input
                id="user-photo"
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                disabled={enviando}
                onClick={(e) => (e.target.value = null)}
              />
            </div>
          </div>

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

      {/* 🔥 MODAL DE AJUSTE/CORTE DE IMAGEM */}
      {isCropping && fotoOriginalUrl && (
        <div className="crop-modal-overlay">
          <div className="crop-modal-content">
            <div className="crop-modal-header">
              <h3>Ajuste sua Foto</h3>
              <button
                type="button"
                onClick={() => setIsCropping(false)}
                className="close-crop-btn"
              >
                <X size={20} />
              </button>
            </div>

            {/* Container do Recortador */}
            <div className="crop-container-wrapper">
              <Cropper
                image={fotoOriginalUrl}
                crop={crop}
                zoom={zoom}
                aspect={1} // Força proporção quadrada (1:1)
                cropShape="round" // Desenha uma guia circular amigável na tela
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            {/* Controle de Zoom */}
            <div className="crop-controls-slider">
              <span>Zoom</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
            </div>

            <div className="crop-modal-actions">
              <button
                type="button"
                className="btn-crop-cancel"
                onClick={() => setIsCropping(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-crop-apply"
                onClick={gerarImagemCortada}
              >
                Confirmar Ajuste
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnviarDepoimento;
