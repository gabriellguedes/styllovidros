import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import { useLocation } from "react-router-dom";
import {
  Folder,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MessageCircle,
} from "lucide-react";
import SEO from "../components/SEO";
import HeaderHome from "../components/HeaderHome";
import FooterHome from "../components/FooterHome";

const Portifolio = () => {
  const [albuns, setAlbuns] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState("TODOS");
  const [loading, setLoading] = useState(true);
  const [redes, setRedes] = useState({});

  // Referência para a barra de filtros rolável
  const filterBarRef = useRef(null);

  // Estados para controlar o Modal Lightbox
  const [albumAtivo, setAlbumAtivo] = useState(null);
  const [fotoIndexAtiva, setFotoIndexAtiva] = useState(0);

  // Estados para controlar o gesto de swipe (touch) no celular
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const location = useLocation();

  useEffect(() => {
    Promise.all([
      api.get("albuns/"), 
      api.get("categorias/"),
      api.get("redes/").catch(() => ({ data: [] }))
    ])
      .then(([resAlbuns, resCategorias, resRedes]) => {
        setAlbuns(resAlbuns.data);
        setCategorias(resCategorias.data);
        if (resRedes.data.length > 0) {
          setRedes(resRedes.data[0]);
        }

        if (location.state && location.state.categoriaFiltroId) {
          setCategoriaAtiva(location.state.categoriaFiltroId);
          window.history.replaceState({}, document.title);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar dados do portfólio:", error);
        setLoading(false);
      });
  }, [location]);

  const whatsappNumber = redes.whatsapp ? redes.whatsapp.replace(/\D/g, "") : "";
const whatsappMessage = "Olá! Gostaria de um orçamento para um projeto estilo o: ";

  // Função para rolar a barra de filtros para os lados via botões
  const handleScrollFiltros = (direction) => {
    if (filterBarRef.current) {
      const scrollAmount = 250;
      filterBarRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleSelectCategoria = (e, catId) => {
    setCategoriaAtiva(catId);
    e.currentTarget.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  const albunsFiltrados =
    categoriaAtiva === "TODOS"
      ? albuns
      : albuns.filter((album) => {
          return (
            album.categoria === categoriaAtiva ||
            album.categoria_detalhes?.id === categoriaAtiva ||
            String(album.categoria_detalhes?.nome).toUpperCase() ===
              String(categoriaAtiva).toUpperCase()
          );
        });

  const handleAbrirAlbum = (album) => {
    if (album.fotos && album.fotos.length > 0) {
      setAlbumAtivo(album);
      setFotoIndexAtiva(0);
    }
  };

  const handleFotoAnterior = (e) => {
    if (e) e.stopPropagation();
    setFotoIndexAtiva((prev) =>
      prev === 0 ? albumAtivo.fotos.length - 1 : prev - 1
    );
  };

  const handleProximaFoto = (e) => {
    if (e) e.stopPropagation();
    setFotoIndexAtiva((prev) =>
      prev === albumAtivo.fotos.length - 1 ? 0 : prev + 1
    );
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(0);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      handleProximaFoto();
    } else if (distance < -minSwipeDistance) {
      handleFotoAnterior();
    }
  };

  if (loading) {
    return (
      <div className="portfolio-loading">
        <div className="spinner"></div>
        <p>Carregando projetos e álbuns...</p>
      </div>
    );
  }

  return (
    <>
    <SEO 
        title="Vidraçaria em Valparaíso de Goiás e DF"
        description="Especialistas em box de vidro, cortina de vidro e espelhos sob medida com atendimento rápido. Peça um orçamento!"
      />
      <HeaderHome />
      <main className="section-portfolio-home">
        <div className="portfolio-page-wrapper">
          <header className="portfolio-header-section">
            <h1>
              Nosso <span>Portfólio</span>
            </h1>
            <p>
              Explore os álbuns de projetos e obras executadas pela Styllo
              Vidros.
            </p>
          </header>

          {/* BARRA DE FILTROS COM SETAS LATERAIS */}
          <div className="portfolio-filter-wrapper">
            <button
              type="button"
              className="filter-arrow-btn filter-arrow-left"
              onClick={() => handleScrollFiltros("left")}
              aria-label="Rolar filtros para esquerda"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="portfolio-filter-bar" ref={filterBarRef}>
              <button
                type="button"
                className={`filter-btn ${categoriaAtiva === "TODOS" ? "active" : ""}`}
                onClick={(e) => handleSelectCategoria(e, "TODOS")}
              >
                Todos os Projetos
              </button>

              {categorias.map((cat) => (
                <button
                  key={cat.id || cat.valor}
                  type="button"
                  className={`filter-btn ${
                    String(categoriaAtiva) === String(cat.id || cat.valor)
                      ? "active"
                      : ""
                  }`}
                  onClick={(e) => handleSelectCategoria(e, cat.id || cat.valor)}
                >
                  {cat.nome || cat.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="filter-arrow-btn filter-arrow-right"
              onClick={() => handleScrollFiltros("right")}
              aria-label="Rolar filtros para direita"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Grid de Álbuns */}
          <div className="portfolio-grid-container">
            {albunsFiltrados.length > 0 ? (
              albunsFiltrados.map((album) => (
                <div
                  key={album.id}
                  className="album-card"
                  onClick={() => handleAbrirAlbum(album)}
                >
                  <div className="album-cover-wrapper">
                    <img
                      src={album.capa_url || album.fotos[0]?.imagem}
                      alt={album.titulo}
                      className="album-cover-img"
                    />
                    <span className="album-category-badge">
                      {album.categoria_detalhes?.nome || "Geral"}
                    </span>
                    <div className="album-photos-count">
                      <ImageIcon size={14} />
                      <span>{album.fotos?.length || 0} fotos</span>
                    </div>
                  </div>

                  <div className="album-info-content">
                    <h3>{album.titulo}</h3>
                    <p>
                      {album.descricao ||
                        "Clique para visualizar as fotos deste projeto."}
                    </p>
                    <div className="album-footer-meta">
                      <Calendar size={14} />
                      <span>
                        {album.criado_em && !isNaN(Date.parse(album.criado_em))
                          ? new Date(album.criado_em).toLocaleDateString(
                              "pt-BR"
                            )
                          : "Recente"}
                      </span>
                    </div>

                    {/* Botão Tenho Interesse via WhatsApp */}
                    {whatsappNumber && (
                      <a
                        href={`https://wa.me/55${whatsappNumber}?text=${whatsappMessage}${encodeURIComponent(album.titulo)}%20-%20${encodeURIComponent(album.categoria_detalhes?.nome || "Geral")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-card-whatsapp"
                        onClick={(e) => e.stopPropagation()} // Impede de abrir o modal ao clicar no botão
                      >
                        <MessageCircle size={18} /> Tenho interesse
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="portfolio-empty-state">
                <Folder size={48} />
                <p>Nenhum álbum encontrado para esta categoria.</p>
              </div>
            )}
          </div>

          {/* Lightbox Modal */}
          {albumAtivo && (
            <div
              className="portfolio-lightbox-overlay"
              onClick={() => setAlbumAtivo(null)}
            >
              <button
                className="lightbox-close-btn"
                onClick={() => setAlbumAtivo(null)}
              >
                <X size={24} />
              </button>

              <div
                className="lightbox-content-box"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="lightbox-image-viewer"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {albumAtivo.fotos.length > 1 && (
                    <button
                      className="nav-arrow-btn prev"
                      onClick={handleFotoAnterior}
                    >
                      <ChevronLeft size={28} />
                    </button>
                  )}

                  <img
                    src={albumAtivo.fotos[fotoIndexAtiva]?.imagem}
                    alt={`Foto ${fotoIndexAtiva + 1} do álbum ${albumAtivo.titulo}`}
                    className="lightbox-main-img"
                    style={{
                      touchAction: "pan-y",
                      userSelect: "none",
                      WebkitUserDrag: "none",
                    }}
                  />

                  {albumAtivo.fotos.length > 1 && (
                    <button
                      className="nav-arrow-btn next"
                      onClick={handleProximaFoto}
                    >
                      <ChevronRight size={28} />
                    </button>
                  )}
                </div>

                <div className="lightbox-info-panel">
                  <div>
                    <h2>{albumAtivo.titulo}</h2>
                    <p>{albumAtivo.descricao}</p>
                  </div>
                  <div className="lightbox-counter">
                    Foto {fotoIndexAtiva + 1} de {albumAtivo.fotos.length}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <FooterHome />
    </>
  );
};

export default Portifolio;