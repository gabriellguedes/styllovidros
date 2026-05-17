import React, { useState, useEffect } from "react";
import api from "../api";

import {
  PlusCircle,
  Trash2,
  Video,
  Link2,
  Film,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

// NOTA: Certifique-se de que a sua instância 'api' e 'toast' estão importadas corretamente aqui.
// Exemplo:
// import api from "../services/api";
// import { toast } from "react-toastify";

const DashVideo = () => {
  const [videos, setVideos] = useState([]);
  const [novoVideo, setNovoVideo] = useState({ titulo: "", url_video: "" });
  const [enviando, setEnviando] = useState(false);
  const [statusEnvio, setStatusEnvio] = useState(null); // 'sucesso' ou 'erro'

  const fetchVideos = async () => {
    try {
      const res = await api.get("videos/");
      setVideos(res.data);
    } catch (err) {
      console.error("Erro ao carregar vídeos:", err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleAddVideo = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setStatusEnvio(null);
    try {
      await api.post("videos/", novoVideo);

      // Se usar react-toastify, mantém-se ativo:
      if (typeof toast !== "undefined")
        toast.success("Vídeo adicionado à galeria!");

      setStatusEnvio("sucesso");
      setNovoVideo({ titulo: "", url_video: "" });
      fetchVideos();
    } catch (err) {
      if (typeof toast !== "undefined") toast.error("Erro ao salvar vídeo.");
      setStatusEnvio("erro");
    } finally {
      setEnviando(false);
    }
  };

  const handleDeleteVideo = async (id, titulo) => {
    if (
      window.confirm(`Tem a certeza que deseja remover o vídeo "${titulo}"?`)
    ) {
      try {
        await api.delete(`videos/${id}/`);
        if (typeof toast !== "undefined") toast.success("Vídeo removido.");
        fetchVideos();
      } catch (err) {
        if (typeof toast !== "undefined") toast.error("Erro ao remover vídeo.");
      }
    }
  };

  // Função auxiliar para extrair a imagem de capa se for link do YouTube (Melhoria visual)
  const getThumbnail = (url) => {
    return null;
  };

  return (
    <div className="dash-video-section">
      <div>
        <h2 className="section-header" style={{ marginBottom: "10px" }}>
          Gerir Galeria de Vídeos
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>
          Adicione ou remova os vídeos de demonstração de projetos que aparecem
          nos carrosséis da página principal.
        </p>
      </div>

      {/* Mensagens de Feedback */}
      {statusEnvio === "sucesso" && (
        <div
          className="form-message-success"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          <CheckCircle2 color="#25d366" size={18} />
          Novo vídeo adicionado e publicado com sucesso no carrossel!
        </div>
      )}

      {statusEnvio === "erro" && (
        <div
          className="form-message-error"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          <AlertCircle color="#ff4d4d" size={18} />
          Erro ao salvar o vídeo. Verifique os dados fornecidos e tente
          novamente.
        </div>
      )}

      {/* --- FORMULÁRIO COMPACTO PARA ADICIONAR VÍDEO --- */}
      <form className="video-upload-box" onSubmit={handleAddVideo}>
        <h3
          style={{
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Video size={18} color="var(--accent-purple)" /> Cadastrar Novo Vídeo
        </h3>

        <div className="video-inline-form">
          <div className="form-group">
            <label htmlFor="video-title">Título do Vídeo / Projeto</label>
            <input
              id="video-title"
              type="text"
              placeholder="Ex: Espelho Adnet Lapidado"
              value={novoVideo.titulo}
              onChange={(e) =>
                setNovoVideo({ ...novoVideo, titulo: e.target.value })
              }
              required
              disabled={enviando}
              style={{
                padding: "12px 14px",
                background: "rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                color: "#fff",
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="video-url">
              Link do Vídeo (YouTube, Vimeo ou MP4)
            </label>
            <input
              id="video-url"
              type="text"
              placeholder="https://youtube.com/... ou /videos/nome.mp4"
              value={novoVideo.url_video}
              onChange={(e) =>
                setNovoVideo({ ...novoVideo, url_video: e.target.value })
              }
              required
              disabled={enviando}
              style={{
                padding: "12px 14px",
                background: "rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                color: "#fff",
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-submit-form"
            disabled={enviando}
            style={{
              padding: "12px",
              margin: "0",
              display: "flex",
              gap: "8px",
              width: "100%",
              borderRadius: "6px",
            }}
          >
            <PlusCircle size={18} />
            {enviando ? "A salvar..." : "Adicionar"}
          </button>
        </div>
      </form>

      {/* --- LISTAGEM DE VÍDEOS EM CARDS --- */}
      <div className="videos-management-grid">
        {videos.map((video, index) => (
          <div className="video-manage-card" key={video.id || index}>
            {/* Preview do topo do Card */}
            <div className="video-card-preview">
              <span className="video-badge">Posição #{index + 1}</span>
              <Film size={40} color="rgba(255, 255, 255, 0.2)" />
            </div>

            {/* Corpo com Informações */}
            <div className="video-card-body">
              <h4 title={video.titulo}>{video.titulo}</h4>
              <p style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Link2 size={14} /> Link configurado
              </p>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.3)",
                  wordBreak: "break-all",
                }}
              >
                {video.url_video}
              </span>
            </div>

            {/* Ações Inferiores */}
            <div className="video-card-footer">
              <button
                className="btn-video-delete"
                onClick={() => handleDeleteVideo(video.id, video.titulo)}
              >
                <Trash2 size={14} /> Excluir
              </button>
            </div>
          </div>
        ))}

        {videos.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              padding: "40px",
              textAlign: "center",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            Nenhum vídeo cadastrado no momento. Preencha o formulário acima.
          </div>
        )}
      </div>
    </div>
  );
};

export default DashVideo;
