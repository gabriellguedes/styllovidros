// src/pages/Home.jsx
import React from "react";
import { Play, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Camera } from "lucide-react";
import Navbar from "../components/Navbar";
import ServicosHome from "../components/Servicos";
import DepoimentosHome from "../components/Depoimentos";
import VideosHome from "../components/VideoGallery";
import ContatoHome from "../components/ContatoForm";
import ContatoForm from "../components/ContatoForm";

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
        <section className="hero-video-section responsive_view">
          <VideosHome />
        </section>
      </header>

      {/* 2. Grid Principal (2 colunas no Desktop) */}
      <main className="main-layout">
        {/* Coluna da Esquerda (Conteúdo Principal) */}
        <div className="content-column">
          {/* Bloco de Materiais/Serviços */}
          <section className="section-block">
            <h2 className="section-header">Nossos Trabalhos</h2>
            <ServicosHome />
          </section>

          {/* Bloco de Especialistas/Vídeo */}
          <section className="section-block">
            <h2 className="section-header">Solicite um Orçamento</h2>

            <ContatoForm />
          </section>
        </div>

        {/* Coluna da Direita (Depoimentos - Sidebar) */}
        <aside className="testimonials-sidebar">
          <section className="section-block">
            <h2 className="section-header">Depoimentos</h2>
            <DepoimentosHome />
          </section>
        </aside>
      </main>
    </div>
  );
};

export default Home;
