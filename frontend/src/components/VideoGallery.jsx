import React, { useEffect, useState } from "react";
import api from "../api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { PlayCircle } from "lucide-react";
import toast from "react-hot-toast";

// Estilos do Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.get("videos/");
        setVideos(res.data);
      } catch (err) {
        console.error("Erro ao carregar vídeos", err);
      }
    };
    fetchVideos();
  }, []);

  // Função para extrair ID do vídeo do YouTube para a capa (Thumbnail)
  const getYouTubeId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <div className="video-carousel-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        className="mySwiper"
      >
        {videos.map((video) => (
          <SwiperSlide key={video.id}>
            <div className="video-card">
              <div className="video-thumbnail-wrapper">
                <img
                  src={`https://img.youtube.com/vi/${getYouTubeId(video.url_video)}/maxresdefault.jpg`}
                  alt={video.titulo}
                  className="video-thumb"
                />
                <a
                  href={video.url_video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="play-overlay"
                >
                  <PlayCircle size={50} color="white" />
                </a>
              </div>
              {/*
              <div className="video-info">
                <h4>{video.titulo}</h4>
              </div> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default VideoGallery;
