import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
  User,
  Link2,
  BarChart3,
  MessageSquare,
  ClipboardList,
  LogOut,
  Clock,
  SquarePlay,
  PiggyBank,
  Settings,
  ArrowLeft,
  ChevronDown,
  Images,
  FileText,
  Menu,
  X,
} from "lucide-react";
// My components
import Video from "../components/DashVideos";
import DashServicos from "../components/DashServicos";
import DashDepoimentos from "../components/DashDepoimentos";
import DashLeads from "../components/DashLeads";
import DashUser from "../components/DashUser";
import DashRedes from "../components/DashRedes";
import DashAbout from "../components/DashAbout";
import NavbarUser from "../components/NavbarUser";
import DashPortifolio from "../components/DashPortifolio";
import ChangePassword from "../components/ChangePassword";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("resumo");
  const [loading, setLoading] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);

  // Estado para controlar a visibilidade do menu no Mobile
  const [menuOpen, setMenuOpen] = useState(false);

  // Estados para armazenar os dados das métricas em tempo real
  const [qtdLeads, setQtdLeads] = useState(0);
  const [depoimentosPendentes, setDepoimentosPendentes] = useState(0);

  // Nível de acesso: true = Admin Master, false = Staff/Editor
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  // 1. Proteção de Rota e Verificação de Nível de Acesso
  useEffect(() => {
    const isAuth = localStorage.getItem("auth") === "true";
    if (!isAuth) {
      navigate("/");
    } else {
      fetchMetrics();

      // Captura o nível de privilégio salvo no login
      const adminStatus = localStorage.getItem("is_admin");
      setIsAdmin(adminStatus === "true");
    }
  }, [navigate]);

  // 2. Função para buscar os totais das tabelas e alimentar os Cards de Resumo
  const fetchMetrics = async () => {
    try {
      const resContatos = await api.get("contatos/");
      setQtdLeads(resContatos.data.length);

      const resDepoimentos = await api.get("depoimentos/");
      const pendentes = resDepoimentos.data.filter(
        (d) => !d.exibir_no_site
      ).length;
      setDepoimentosPendentes(pendentes);
    } catch (err) {
      console.error("Erro ao carregar métricas do painel:", err);
    }
  };

  // 3. Função para gerenciar a troca de abas com fechamento automático no mobile
  const handleTabChange = (tabId) => {
    setLoading(true);
    setActiveTab(tabId);
    setMenuOpen(false); // Fecha o menu responsivo ao selecionar uma aba

    if (tabId === "resumo") {
      fetchMetrics();
    }

    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const toggleConfigDropdown = (e) => {
    e.stopPropagation();
    setConfigOpen(!configOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="dashboard-container">
      {/* Overlay transparente para fechar o menu no mobile ao clicar fora */}
      {menuOpen && (
        <div
          className="dashboard-sidebar-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* --- SIDEBAR LATERAL --- */}
      <aside className={`dashboard-sidebar ${menuOpen ? "open" : ""}`}>
        <div>
          {/* Topo do Menu - Clicável para abrir/fechar */}
          <div
            className="dashboard-brand"
            onClick={toggleMenu}
            style={{ cursor: "pointer" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
               <button
                className="dashboard-mobile-toggle-btn"
                aria-label="Alternar Menu"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h2>

                STYLLO <span>PAINEL</span>
              </h2>
             
            </div>
          </div>
                <hr className="dropdown-divider" />
          <ul className="dashboard-menu">
            <li
              className={`dashboard-menu-item ${activeTab === "resumo" ? "active" : ""}`}
            >
              <button
                onClick={() => handleTabChange("resumo")}
                className="dash-btn-action"
              >
                <a style={{ pointerEvents: "none" }}>
                  <BarChart3 size={18} /> Resumo
                </a>
              </button>
            </li>
            <li
              className={`dashboard-menu-item ${activeTab === "depoimentos" ? "active" : ""}`}
            >
              <button
                onClick={() => handleTabChange("depoimentos")}
                className="dash-btn-action"
              >
                <a style={{ pointerEvents: "none" }}>
                  <MessageSquare size={18} /> Avaliações
                </a>
              </button>
            </li>
            <li
              className={`dashboard-menu-item ${activeTab === "orcamentos" ? "active" : ""}`}
            >
              <button
                onClick={() => handleTabChange("orcamentos")}
                className="dash-btn-action"
              >
                <a style={{ pointerEvents: "none" }}>
                  <PiggyBank size={18} /> Mensagens
                </a>
              </button>
            </li>

            {/* Galeria de Vídeos */}
            <li
              className={`dashboard-menu-item ${activeTab === "video_gallery" ? "active" : ""}`}
            >
              <button
                onClick={() => handleTabChange("video_gallery")}
                className="dash-btn-action"
              >
                <a style={{ pointerEvents: "none" }}>
                  <SquarePlay size={18} /> Galeria de Vídeos
                </a>
              </button>
            </li>

            {/* Produtos e Serviços */}
            <li
              className={`dashboard-menu-item ${activeTab === "service" ? "active" : ""}`}
            >
              <button
                onClick={() => handleTabChange("service")}
                className="dash-btn-action"
              >
                <a style={{ pointerEvents: "none" }}>
                  <ClipboardList size={18} /> Produtos e Seviços
                </a>
              </button>
            </li>

            {/* Gerenciar Portfólio */}
            <li
              className={`dashboard-menu-item ${activeTab === "portifolio" ? "active" : ""}`}
            >
              <button
                className="dash-btn-action"
                onClick={() => handleTabChange("portifolio")}
              >
                <a style={{ pointerEvents: "none" }}>
                  <Images size={18} /> Gerenciar Portfólio
                </a>
              </button>
            </li>
          </ul>
        </div>

        {/* --- MENU DROPDOWN DE CONFIGURAÇÕES E SAÍDA --- */}
        <div>
          {/* 🔒 ITENS EXCLUSIVOS PARA ADMINISTRADORES */}
          {isAdmin && (
            <div
              className={`dashboard-menu-item dropdown-parent ${configOpen ? "open" : ""}`}
            >
              <button
                type="button"
                onClick={toggleConfigDropdown}
                className="dropdown-trigger-btn"
              >
                <div className="trigger-left-content">
                  <Settings size={18} />
                  <span>Configurações</span>
                </div>
                <ChevronDown size={16} className="chevron-icon" />
              </button>

              {/* Submenu de Configurações */}
              <ul className="dashboard-submenu">
                <li
                  className={`dashboard-menu-item ${activeTab === "usuarios" ? "active" : ""}`}
                >
                  <button
                    onClick={() => handleTabChange("usuarios")}
                    className="dash-btn-action"
                  >
                    <a style={{ pointerEvents: "none" }}>
                      <User size={18} /> Usuários
                    </a>
                  </button>
                </li>
                <li
                  className={`dashboard-menu-item ${activeTab === "redes" ? "active" : ""}`}
                >
                  <button
                    onClick={() => handleTabChange("redes")}
                    className="dash-btn-action"
                  >
                    <a style={{ pointerEvents: "none" }}>
                      <Link2 size={18} /> Redes Sociais
                    </a>
                  </button>
                </li>
                <li
                  className={`dashboard-menu-item ${activeTab === "sobre" ? "active-sub" : ""}`}
                >
                  <button
                    onClick={() => handleTabChange("sobre")}
                    className="dash-btn-action"
                  >
                    <a style={{ pointerEvents: "none" }}>
                      <FileText size={18} /> Sobre Nós
                    </a>
                  </button>
                </li>
              </ul>
            </div>
          )}

          <button className="section-btn-bth">
            <a href="/" className="btn-bth">
              <ArrowLeft size={18} />
              <span>Voltar para o site</span>
            </a>
          </button>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Painel de Controle</h1>
            <p>
              Gerencie as interações, pedidos de orçamento e depoimentos da
              Styllo Vidros.
            </p>
          </div>
          <NavbarUser
            activeTab={activeTab}
            handleTabChange={handleTabChange}
          />
        </div>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
              color: "var(--accent-purple)",
              fontSize: "1.2rem",
            }}
          >
            <Clock
              size={24}
              style={{
                marginRight: "10px",
                animation: "spin 1s linear infinite",
              }}
            />{" "}
            A atualizar informações...
          </div>
        ) : (
          <>
            {/* --- VISÃO: RESUMO GERAL --- */}
            {activeTab === "resumo" && (
              <div>
                <section className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-info">
                      <h3>Avaliações Pendentes</h3>
                      <p>{depoimentosPendentes}</p>
                    </div>
                    <button
                      onClick={() => handleTabChange("depoimentos")}
                      className="metric-btn-action"
                    >
                      <a style={{ pointerEvents: "none" }}>
                        <div className="metric-icon">
                          <MessageSquare size={22} />
                        </div>
                      </a>
                    </button>
                  </div>

                  <div className="metric-card">
                    <div className="metric-info">
                      <h3>Pedidos de Orçamento</h3>
                      <p>{qtdLeads}</p>
                    </div>
                    <button
                      onClick={() => handleTabChange("orcamentos")}
                      className="metric-btn-action"
                    >
                      <a style={{ pointerEvents: "none" }}>
                        <div className="metric-icon">
                          <ClipboardList size={22} />
                        </div>
                      </a>
                    </button>
                  </div>
                </section>

                <section className="dashboard-data-section">
                  <h2>Ações Rápidas Recomendadas</h2>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "0.95rem",
                      marginTop: "10px",
                    }}
                  >
                    {depoimentosPendentes > 0
                      ? `Você possui ${depoimentosPendentes} depoimento(s) aguardando moderação antes de ser(em) exibido(s) publicamente.`
                      : "Tudo em dia! Não há novos depoimentos para aprovação neste momento."}
                  </p>
                </section>
              </div>
            )}

            {/* --- VISÃO: GERENCIAR DEPOIMENTOS --- */}
            {activeTab === "depoimentos" && (
              <section className="dashboard-data-section">
                <DashDepoimentos />
              </section>
            )}

            {/* --- VISÃO: SOLICITAÇÕES DE ORÇAMENTO --- */}
            {activeTab === "orcamentos" && (
              <section className="dashboard-data-section">
                <DashLeads />
              </section>
            )}

            {/* --- VÍDEOS GALLERY --- */}
            {activeTab === "video_gallery" && (
              <section className="dashboard-data-section">
                <Video />
              </section>
            )}

            {/* --- PRODUTOS --- */}
            {activeTab === "service" && (
              <section className="dashboard-data-section">
                <DashServicos />
              </section>
            )}

            {/* --- VISÃO: MEU PERFIL --- */}
            {activeTab === "change_password" && (
              <section className="dashboard-data-section">
                <ChangePassword />
              </section>
            )}

            {/* --- TRAVA DE SEGURANÇA EXCLUSIVA NO CONTEÚDO DA TELA PRINCIPAL --- */}
            {activeTab === "usuarios" &&
              (isAdmin ? (
                <section className="dashboard-data-section">
                  <DashUser />
                </section>
              ) : (
                <div style={{ padding: "20px", color: "#ff4d4d" }}>
                  Acesso Restrito a Administradores.
                </div>
              ))}

            {activeTab === "redes" &&
              (isAdmin ? (
                <section className="dashboard-data-section">
                  <DashRedes />
                </section>
              ) : (
                <div style={{ padding: "20px", color: "#ff4d4d" }}>
                  Acesso Restrito a Administradores.
                </div>
              ))}

            {activeTab === "sobre" &&
              (isAdmin ? (
                <section className="dashboard-data-section">
                  <DashAbout />
                </section>
              ) : (
                <div style={{ padding: "20px", color: "#ff4d4d" }}>
                  Acesso Restrito a Administradores.
                </div>
              ))}

            {/* --- SEÇÃO: PORTFÓLIO EM ÁLBUNS --- */}
            {activeTab === "portifolio" && (
              <section className="dashboard-data-section">
                <DashPortifolio />
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;