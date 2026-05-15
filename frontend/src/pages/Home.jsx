// src/pages/Home.jsx
import React from "react";
import { Play, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ServicosHome from "../components/Servicos";
import DepoimentosHome from "../components/Depoimentos";
import VideosHome from "../components/VideoGallery";
import ContatoHome from "../components/ContatoForm";

const Home = () => {
  return (
    <div className="app-wrapper">
      {/* 1. Hero Section com Gradiente */}
      <header className="hero-banner">
        {/* Seção da Logo e Títulos */}
        <section className="hero-brand-section">
          <Link to="/" className="hero-logo-link">
            <img
              className="nav_logo"
              src="/logo.png"
              alt="Logo Styllo Vidros"
            />
            <div className="hero-text-container">
              <h1>
                STYLLO <span>VIDROS</span>
              </h1>
              <label>Excelência em Vidraçaria e Design</label>
            </div>
          </Link>
        </section>

        {/* Seção do Carrossel de Vídeos */}
        <section className="hero-video-section">
          <VideosHome />
        </section>
      </header>

      {/* 2. Grid Principal (2 colunas no Desktop) */}
      <main className="main-layout">
        {/* Coluna da Esquerda (Conteúdo Principal) */}
        <div className="content-column">
          {/* Bloco de Materiais/Serviços */}
          <section className="section-block">
            <h2 className="section-header">Nossos Materiais</h2>
            <ServicosHome />
          </section>

          {/* Bloco de Especialistas/Vídeo */}
          <section className="section-block">
            <h2 className="section-header">Nossos Especialistas</h2>
            <div className="video-feature">
              <div className="video-overlay">
                <div className="play-button">
                  <Play size={32} fill="white" />
                </div>
                <h3>Soluções Especiais para Arquitetos</h3>
                <p>Projetos sob medida / Suporte técnico</p>
              </div>
            </div>
          </section>
        </div>

        {/* Coluna da Direita (Depoimentos - Sidebar) */}
        <aside className="testimonials-sidebar">
          <h2 className="section-header">Depoimentos</h2>
          <DepoimentosHome />
        </aside>
      </main>

      {/* 3. Rodapé com Botão de Consultor */}
      <footer className="cta-footer">
        <p className="footer-brand">
          STYLLO VIDROS: Referência em vidraçaria em geral.
        </p>
        <p className="footer-contact">
          Atendimento: (61) 99298-7278 / (61) 99394-2936
        </p>
        <a href="https://wa.me/seunumeroaqui" className="btn-consultor">
          Falar com um consultor técnico
        </a>
      </footer>

      {/* WhatsApp Flutuante */}
      <a href="https://wa.me/seunumeroaqui" className="whatsapp-float">
        <MessageCircle size={30} color="white" />
      </a>
    </div>
  );
};

export default Home;
