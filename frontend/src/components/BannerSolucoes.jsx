import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react"; // Um ícone sutil de link/ação
import backgroundImage from "../assets/background_banner.jpeg"; // Ajuste o caminho conforme sua pasta de imagens

const BannerSolucoes = () => {
  return (
    <div className="special-solutions-container">
      <Link
        to="/portfolio"
        className="special-solutions-banner"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Camada de degradê roxo/escuro para dar leitura ao texto branco */}
        <div className="banner-overlay-gradient"></div>

        {/* Conteúdo do Banner */}
        <div className="banner-content-wrapper">
          <div className="banner-text-side">
            <h3 className="banner-title">Soluções Especiais</h3>
            <p className="banner-subtitle">
              para arquitetos e projetos sob medida
            </p>
          </div>

          <div className="banner-icon-side">
            <div className="banner-action-circle">
              <ArrowUpRight size={22} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BannerSolucoes;
