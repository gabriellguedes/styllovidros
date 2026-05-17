// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import ServicosHome from "../components/Servicos";
import DepoimentosHome from "../components/Depoimentos";
import VideosHome from "../components/VideoGallery";
import ContatoForm from "../components/ContatoForm";

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitora o scroll para alterar o Header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="app-wrapper">
      {/* 2. Container Principal com efeito Parallax */}
      <main className="main-parallax-container">
        {/* Div que carrega a imagem de fundo fixa */}
        <div className="parallax-background"></div>

        <div className="main-layout content-over-parallax">
          {/* Coluna da Esquerda (Conteúdo Principal) */}
          <div className="content-column">
            {/* Bloco de Materiais/Serviços */}
            <section className="section-block">
              <h2 className="section-header">Nossos Trabalhos</h2>
              <ServicosHome />
            </section>
          </div>

          {/* Coluna da Direita (Depoimentos - Sidebar) */}
          <aside className="testimonials-sidebar">
            <section className="section-block">
              <h2 className="section-header">Depoimentos</h2>
              <DepoimentosHome />
            </section>
          </aside>
          {/* Bloco de Orçamento */}
          <div>
            <section className="section-block">
              <h2 className="section-header">Solicite um Orçamento</h2>
              <ContatoForm />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
