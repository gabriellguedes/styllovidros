// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { MessageCircle, ShieldCheck, Clock, Award } from "lucide-react";
import { Link } from "react-router-dom";
import ServicosHome from "../components/Servicos";
import DepoimentosHome from "../components/Depoimentos";
import VideosHome from "../components/VideoGallery";
import ContatoForm from "../components/ContatoForm";
import HeaderHome from "../components/HeaderHome";
import FooterHome from "../components/FooterHome";
import BannerSolucoes from "../components/BannerSolucoes";

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
      <HeaderHome />
      {/* 2. Container Principal com efeito Parallax */}
      
      <main className="main-parallax-container">
        {/* --- DIFERENCIAIS --- */}
        <section id="wrapper-diferenciais">
          <div className="diferenciais-section" >
            <div className="diferenciais-card" >
              <div className="diferenciais-card-header">
                <ShieldCheck size={32} />
                <h3>Segurança e Qualidade</h3>
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>Utilizamos materiais certificados que seguem rigorosamente as normas técnicas de segurança.</p>
            </div>

            <div className="diferenciais-card">
              <div className="diferenciais-card-header">
                <Award size={32} />
                <h3>Projetos Exclusivos</h3>
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>Soluções sob medida desenhadas perfeitamente para otimizar e valorizar o seu espaço.</p>
            </div>

            <div className="diferenciais-card">
              <div className="diferenciais-card-header">
                <Clock size={32} />
                <h3>Pontualidade na Entrega</h3>
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>Compromisso com prazos estipulados, desde a fabricação até a instalação final.</p>
            </div>
          </div>
        </section>
        {/* Div que carrega a imagem de fundo fixa */}
        <div className="parallax-background"></div>

        <div className="section-services-container">
          <section className="section-services-content">
            <h2 className="section-header">Nossos Produtos</h2>
            <p className="section-services-text-main">
              Confira nossa variedade de produtos.
            </p>
            <ServicosHome />
            <p className="section-services-text">
              Não encontrou o que procura?
              <Link to="/fale-conosco"> Entre em contato conosco</Link>
            </p>
          </section>
        </div>
        <BannerSolucoes />
        <div className="main-layout content-over-parallax">
          
          <aside className="testimonials-sidebar">
            <section className="section-block" name="depoimentos">
            <h2 className="section-header" name="title-depoimentos">Opinião dos Clientes</h2>
              <DepoimentosHome />
            </section>
          </aside>

          <div className="content-column">
            <section className="section-block">
              <h2 className="section-header">Fale Conosco</h2>
              <ContatoForm />
            </section>
          </div>
        </div>
      </main>
      <FooterHome />
    </div>
  );
};

export default Home;
