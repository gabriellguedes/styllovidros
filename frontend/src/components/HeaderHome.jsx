import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HeaderHome = () => {
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
    <header className={`hero-banner ${isScrolled ? "scrolled" : ""}`}>
      {/* Seção da Logo e Títulos */}
      <section className={`hero-brand-section ${isScrolled ? "scrolled" : ""}`}>
        <Link to="/" className="hero-logo-link">
          <img className="nav_logo" src="/logo.png" alt="Logo Styllo Vidros" />
          <div className="hero-text-container">
            <h1>
              STYLLO <span>VIDROS</span>
            </h1>
            <label>Excelência em Vidraçaria e Design</label>
          </div>
        </Link>
      </section>
    </header>
  );
};
export default HeaderHome;
