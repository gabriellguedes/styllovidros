import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

// Importa os componentes e módulos do Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Importa os estilos obrigatórios do Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Servicos = () => {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redes, setRedes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("servicos/")
      .then((response) => {
        setServicos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar serviços:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const fetchRedes = async () => {
      try {
        const resRedes = await api.get("redes/").catch(() => ({ data: [] }));
        if (resRedes.data.length > 0) {
          setRedes(resRedes.data[0]);
        }
      } catch (err) {
        console.error("Erro ao carregar dados das redes:", err);
      }
    };

    fetchRedes();
  }, []);

  const handleCardClick = (categoriaId) => {
    if (categoriaId) {
      navigate("/portfolio", { state: { categoriaFiltroId: categoriaId } });
    } else {
      navigate("/portfolio");
    }
  };

  if (loading) return <p className="text-center">Carregando portfólio...</p>;

  return (
    <section className="section-services">
      <div className="services-container-wrapper">
        {servicos.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={25}
            slidesPerView={1}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={true}
            breakpoints={{
              993: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 25,
              },
              1440: {
                slidesPerView: 4,
                spaceBetween: 25,
              },
            }}
            className="services-swiper"
          >
            {servicos.map((item) => (
              <SwiperSlide key={item.id}>
                <div
                  className="material-card"
                  onClick={() =>
                    handleCardClick(item.categoria_id || item.categoria)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={item.imagem}
                    alt={item.titulo}
                  />
                  <div>
                    <h4>{item.titulo}</h4>
                    <span>{item.subtitulo || "Ver Projetos"}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-center">Nenhum serviço cadastrado no momento.</p>
        )}
      </div>
    </section>
  );
};

export default Servicos;