import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavbarUser from "./NavbarUser";
import { MessageCircle } from "lucide-react";
import api from "../api";

const HeaderHome = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [redes, setRedes] = useState({});

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

  useEffect(() => {
    const fetchRedes = async () => {
      try {
        const resRedes = await api.get("redes/").catch(() => ({ data: [] }));
        if (resRedes.data.length > 0) {
          setRedes(resRedes.data[0]);
        }
      } catch (err) {
        console.error("Erro ao carregar dados do cabeçalho:", err);
      }
    };

    fetchRedes();
  }, []);

  const whatsappNumber = redes.whatsapp ? redes.whatsapp.replace(/\D/g, "") : "";

  return (
    <header className={`hero-banner ${isScrolled ? "scrolled" : ""}`}>
      <div className="hero-banner-container">
        
        

        {/* Bloco da Logo + Título (Desliza para a esquerda) */}
        <div className="hero-brand-wrapper">
          <Link to="/" className="hero-logo-link">
            <img src="/logo.png" alt="Styllo Vidros" className="nav_logo" onError={(e) => { e.target.style.display = 'none'; }} />
          </Link>

          <div className="hero-text-container">
            <h1>STYLLO <span>VIDROS</span></h1>
            <label className="hero-label-sub">Excelência em Vidraçaria e Design</label>
          </div>
        </div>
        
       {/* Primeira frase (some no scroll) */}
        <div className="hero-top-subtitle">
          <span>Especialistas em Vidros e Projetos Sob Medida</span>
        </div>

        {/* Navbar do Usuário */}
        <div className="container-navbar-user">
          <NavbarUser />
        </div>

      </div>
    </header>
  );
};

export default HeaderHome;