import React, { useEffect, useState } from "react";
import api from "../api";
import { PlayCircle } from "lucide-react";

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    api
      .get("videos/")
      .then((res) => setVideos(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Função para transformar link normal do YouTube em link de incorporação (embed)
  const getEmbedUrl = (url) => {
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "youtube.com/embed/");
    }
    return url;
  };

  if (videos.length === 0) return null;

  return (
    <section className="section-container">
      <h2 className="section-title">
        <PlayCircle /> Nossas Instalações em Vídeo
      </h2>
      <div className="video-grid">
        {videos.map((video) => (
          <div key={video.id} className="video-card">
            <iframe
              width="100%"
              height="215"
              src={getEmbedUrl(video.url_video)}
              title={video.titulo}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <h3 className="video-label">{video.titulo}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VideoGallery;
