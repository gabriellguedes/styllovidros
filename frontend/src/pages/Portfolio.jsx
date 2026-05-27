import React, { useEffect, useState } from "react";
import api from "../api";
import { useLocation } from "react-router-dom"; // 🔥 Importado para capturar o filtro vindo de Serviços
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
  const [categorias, setCategorias] = useState([]); // 🔥 Estado para armazenar a lista de categorias para a barra de filtros
  const [categoriaAtiva, setCategoriaAtiva] = useState("TODOS"); // 🔥 Controla qual filtro está selecionado por padrão
  const [loading, setLoading] = useState(true);

  // Estados para controlar o Modal de visualização interna do álbum
  const [albumAtivo, setAlbumAtivo] = useState(null);
  const [fotoIndexAtiva, setFotoIndexAtiva] = useState(0);

  const location = useLocation(); // 🔥 Captura o estado passado pelo navigate da página anterior

  useEffect(() => {
    // 🔥 Buscamos tanto os álbuns quanto as categorias cadastradas no backend
    Promise.all([api.get("albuns/"), api.get("categorias/")])
      .then(([resAlbuns, resCategorias]) => {
        setAlbuns(resAlbuns.data);
        setCategorias(resCategorias.data);

        // 🔥 Verifica se o usuário veio redirecionado da página de Serviços com um filtro ativo
        if (location.state && location.state.categoriaFiltroId) {
          setCategoriaAtiva(location.state.categoriaFiltroId);

          // Limpa o estado do histórico para evitar que o filtro fique preso se ele atualizar (F5) a página
          window.history.replaceState({}, document.title);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar dados do portfólio:", error);
        setLoading(false);
      });
  }, [location]);

  // 🔥 FILTRAGEM DINÂMICA: Filtra a lista de álbuns no frontend com base no botão ou serviço selecionado
  const albunsFiltrados =
    categoriaAtiva === "TODOS"
      ? albuns
      : albuns.filter((album) => {
          // Verifica compatibilidade tanto se o campo salvar o ID numérico quanto se salvar o texto/slug da categoria
          return (
            album.categoria === categoriaAtiva ||
            album.categoria_detalhes?.id === categoriaAtiva ||
            String(album.categoria_detalhes?.nome).toUpperCase() ===
              String(categoriaAtiva).toUpperCase()
          );
        });

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
    e.stopPropagation(); // Impede fechar o modal
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
      <HeaderHome />
      <main className="section-portfolio-home">
        <div className="portfolio-page-wrapper">
          {/* Cabeçalho da Página */}
          <header className="portfolio-header-section">
            <h1>
              Nosso <span>Portfólio</span>
            </h1>
            <p>
              Explore os álbuns de projetos e obras executadas pela Styllo
              Vidros.
            </p>
          </header>

          {/* 🔥 BARRA DE FILTROS DINÂMICA (Renderiza botões para alternar as categorias) */}
          <div className="portfolio-filter-bar">
            <button
              className={`filter-btn ${categoriaAtiva === "TODOS" ? "active" : ""}`}
              onClick={() => setCategoriaAtiva("TODOS")}
            >
              Todos os Projetos
            </button>

            {categorias.map((cat) => (
              <button
                key={cat.id || cat.valor}
                className={`filter-btn ${String(categoriaAtiva) === String(cat.id || cat.valor) ? "active" : ""}`}
                // Se o backend usar o ID na FK usa cat.id, se for texto estático usa cat.valor
                onClick={() => setCategoriaAtiva(cat.id || cat.valor)}
              >
                {cat.nome || cat.label}
              </button>
            ))}
          </div>

          {/* Grid de Álbuns (Usa a lista que passou pela filtragem) */}
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
                              "pt-BR",
                            )
                          : "Recente"}
                      </span>
                    </div>
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
      </main>
      <FooterHome />
    </>
  );
};

export default Portifolio;
