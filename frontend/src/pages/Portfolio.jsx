import React, { useEffect, useState } from "react";
import api from "../api";
import {
  Folder,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import HeaderHome from "../components/HeaderHome";
import FooterHome from "../components/FooterHome";

const Portifolio = () => {
  const [albuns, setAlbuns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para controlar o Modal de visualização interna do álbum
  const [albumAtivo, setAlbumAtivo] = useState(null);
  const [fotoIndexAtiva, setFotoIndexAtiva] = useState(0);

  useEffect(() => {
    api
      .get("albuns/")
      .then((response) => {
        setAlbuns(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar o portfólio:", error);
        setLoading(false);
      });
  }, []);

  // Abrir o álbum na primeira foto
  const handleAbrirAlbum = (album) => {
    if (album.fotos && album.fotos.length > 0) {
      setAlbumAtivo(album);
      setFotoIndexAtiva(0);
    }
  };

  // Navegação do Modal (Foto Anterior)
  const handleFotoAnterior = (e) => {
    e.stopPropagation(); // Impede fechar o modal
    setFotoIndexAtiva((prev) =>
      prev === 0 ? albumAtivo.fotos.length - 1 : prev - 1,
    );
  };

  // Navegação do Modal (Próxima Foto)
  const handleProximaFoto = (e) => {
    e.stopPropagation();
    setFotoIndexAtiva((prev) =>
      prev === albumAtivo.fotos.length - 1 ? 0 : prev + 1,
    );
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
      <div className="portfolio-page-wrapper">
        {/* Cabeçalho da Página */}
        <header className="portfolio-header-section">
          <h1>
            Nosso <span>Portfólio</span>
          </h1>
          <p>
            Explore os álbuns de projetos e obras executadas pela Styllo Vidros.
          </p>
        </header>

        {/* Grid de Álbuns */}
        <main className="portfolio-grid-container">
          {albuns.length > 0 ? (
            albuns.map((album) => (
              <div
                key={album.id}
                className="album-card"
                onClick={() => handleAbrirAlbum(album)}
              >
                <div className="album-cover-wrapper">
                  {/* Exibe a foto definida como capa ou a primeira do álbum */}
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
                      {new Date(album.criado_em).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="portfolio-empty-state">
              <Folder size={48} />
              <p>Nenhum álbum de projeto foi publicado ainda.</p>
            </div>
          )}
        </main>

        {/* --- MODAL LIGHTBOX DE VISUALIZAÇÃO DO ÁLBUM --- */}
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
              {/* Área Principal da Imagem */}
              <div className="lightbox-image-viewer">
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

              {/* Rodapé Informativo do Modal */}
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
      <FooterHome />
    </>
  );
};

export default Portifolio;
