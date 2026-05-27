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
            spaceBetween={25} // Espaço entre os cards (em px)
            slidesPerView={1} // Quantidade padrão no mobile
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={true}
            // Responsividade: define quantos itens mostrar baseado na largura da tela
            breakpoints={{
              640: {
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
                  key={item.id}
                  onClick={() =>
                    handleCardClick(item.categoria_id || item.categoria)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={item.imagem} // URL vinda do Django
                    alt={item.titulo}
                  />
                  <div>
                    {/* Exibe o nome dinâmico da categoria ou fallback caso não exista */}
                    <h4 title={item.categoria_detalhes?.nome || "Serviço"}>
                      {item.titulo}
                    </h4>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-center">Nenhum serviço disponível no momento.</p>
        )}
      </div>
    </section>
  );
};

export default Servicos;
