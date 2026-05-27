import React, { useEffect, useState } from "react";
import api from "../api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { UserCircle, Star } from "lucide-react";

// Importar estilos necessários do Swiper
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const DepoimentosHome = () => {
  const [depoimentos, setDepoimentos] = useState([]);

  useEffect(() => {
    const fetchDepoimentos = async () => {
      const res = await api.get("depoimentos/");
      // Filtra apenas os que o seu amigo aprovou no dashboard
      setDepoimentos(res.data.filter((d) => d.exibir_no_site === true));
    };
    fetchDepoimentos();
  }, []);

  return (
    <div className="testimonials-carousel">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect={"fade"} // Ativa o efeito de esmaecimento
        fadeEffect={{ crossFade: true }}
        slidesPerView={1} // No efeito Fade, o padrão ideal é 1 para suavidade
        loop={true}
        autoplay={{ delay: 4000000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="testimonial-swiper"
      >
        {depoimentos.map((d) => (
          <SwiperSlide key={d.id}>
            <div className="testimonial-item-card">
              <div className="testimonial-background"></div>
              <div className="testimonial-avatar-wrapper">
                {d.foto_cliente ? (
                  <img
                    src={d.foto_cliente}
                    alt={d.nome_cliente}
                    className="testimonial-img"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#333",
                    }}
                  />
                ) : (
                  <UserCircle className="testimonial-icon-avatar" />
                )}
              </div>
              <div className="testimonial-content">
                <label className="testimonial-author">{d.nome_cliente}</label>
                <p className="testimonial-text">"{d.texto}"</p>
                <div className="testimonial-stars-display">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <Star
                      key={index}
                      size={18}
                      // Se o índice for menor ou igual à nota salva (d.avaliacao), a estrela fica preenchida de roxo
                      fill={
                        index <= (d.avaliacao || 5)
                          ? "var(--accent-purple)"
                          : "none"
                      }
                      color={
                        index <= (d.avaliacao || 5)
                          ? "var(--accent-purple)"
                          : "#444"
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default DepoimentosHome;
