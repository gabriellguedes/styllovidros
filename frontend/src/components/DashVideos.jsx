import React, { useEffect, useState } from "react";
import api from "../api";
import { Video, Trash2, Link as LinkIcon } from "lucide-react";

const DashVideos = () => {
  const [videos, setVideos] = useState([]);
  const [novoVideo, setNovoVideo] = useState({ titulo: "", url_video: "" });

  const fetchVideos = async () => {
    const res = await api.get("videos/");
    setVideos(res.data);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("videos/", novoVideo);
    setNovoVideo({ titulo: "", url_video: "" });
    fetchVideos();
  };

  return (
    <div className="dash-section">
      <h3>
        <Video size={20} /> Gerenciar Vídeos
      </h3>
      <form onSubmit={handleSubmit} className="dash-form">
        <input
          type="text"
          placeholder="Título do Vídeo"
          value={novoVideo.titulo}
          onChange={(e) =>
            setNovoVideo({ ...novoVideo, titulo: e.target.value })
          }
          required
        />
        <input
          type="url"
          placeholder="URL do YouTube"
          value={novoVideo.url_video}
          onChange={(e) =>
            setNovoVideo({ ...novoVideo, url_video: e.target.value })
          }
          required
        />
        <button type="submit" className="btn-add">
          Adicionar Vídeo
        </button>
      </form>

      <div className="dash-list">
        {videos.map((v) => (
          <div key={v.id} className="dash-item">
            <span>{v.titulo}</span>
            <button
              onClick={async () => {
                await api.delete(`videos/${v.id}/`);
                fetchVideos();
              }}
              className="btn-del"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashVideos;
