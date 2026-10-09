import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
  User,
  Link2,
  BarChart3,
  MessageSquare,
  ClipboardList,
  Clock,
  SquarePlay,
  PiggyBank,
  Settings,
  ArrowLeft,
  ChevronDown,
  Images,
  FileText,
  Menu,
  LogOut,
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

  // Proteção de Rota e Verificação de Nível de Acesso
  useEffect(() => {
    const isAuth = localStorage.getItem("auth") === "true";
    if (!isAuth) {
      navigate("/");
    } else {
      fetchMetrics();
      const adminStatus = localStorage.getItem("is_admin");
      setIsAdmin(adminStatus === "true");
    }
  }, [navigate]);

  // Função para buscar os totais das tabelas
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

  // Função para gerenciar a troca de abas no mobile e desktop
  const handleSelectTab = (tabId) => {
    setLoading(true);
    setActiveTab(tabId);
    setMenuOpen(false); // Fecha o menu no celular após a seleção

    if (tabId === "resumo") {
      fetchMetrics();
    }

    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const toggleConfigDropdown = (e) => {
    e.stopPropagation();
    setConfigOpen((prev) => !prev);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("is_admin");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="dashboard-container">
      {/* --- SIDEBAR LATERAL / MENU PAINEL --- */}
      <aside className={`dashboard-sidebar ${menuOpen ? "open" : ""}`}>
        {/* Cabeçalho Fixo do Sidebar */}
        <div className="dashboard-brand">
          <div className="dashboard-brand-header">
            <button
              type="button"
              className="dashboard-mobile-toggle-btn"
              onClick={toggleMenu}
              aria-label="Alternar Menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h2 onClick={toggleMenu} className="brand-title">
              STYLLO <span>PAINEL</span>
            </h2>
          </div>
          <hr className="dropdown-divider" />
        </div>

        {/* Conteúdo do Menu (Corpo expansível no mobile) */}
        <div className="dashboard-menu-wrapper">
          <ul className="dashboard-menu">
            <li className={`dashboard-menu-item ${activeTab === "resumo" ? "active" : ""}`}>
              <button
                type="button"
                onClick={() => handleSelectTab("resumo")}
                className="dash-btn-action"
              >
                <BarChart3 size={18} />
                <span>Resumo</span>
              </button>
            </li>

            <li className={`dashboard-menu-item ${activeTab === "depoimentos" ? "active" : ""}`}>
              <button
                type="button"
                onClick={() => handleSelectTab("depoimentos")}
                className="dash-btn-action"
              >
                <MessageSquare size={18} />
                <span>Avaliações</span>
              </button>
            </li>

            <li className={`dashboard-menu-item ${activeTab === "orcamentos" ? "active" : ""}`}>
              <button
                type="button"
                onClick={() => handleSelectTab("orcamentos")}
                className="dash-btn-action"
              >
                <PiggyBank size={18} />
                <span>Mensagens</span>
              </button>
            </li>

            <li className={`dashboard-menu-item ${activeTab === "video_gallery" ? "active" : ""}`}>
              <button
                type="button"
                onClick={() => handleSelectTab("video_gallery")}
                className="dash-btn-action"
              >
                <SquarePlay size={18} />
                <span>Galeria de Vídeos</span>
              </button>
            </li>

            <li className={`dashboard-menu-item ${activeTab === "service" ? "active" : ""}`}>
              <button
                type="button"
                onClick={() => handleSelectTab("service")}
                className="dash-btn-action"
              >
                <ClipboardList size={18} />
                <span>Produtos e Serviços</span>
              </button>
            </li>

            <li className={`dashboard-menu-item ${activeTab === "portifolio" ? "active" : ""}`}>
              <button
                type="button"
                onClick={() => handleSelectTab("portifolio")}
                className="dash-btn-action"
              >
                <Images size={18} />
                <span>Gerenciar Portfólio</span>
              </button>
            </li>
          </ul>

          {/* Submenu de Configurações para Administradores */}
          <div className="dashboard-bottom-section">
            {isAdmin && (
              <div className={`dashboard-menu-item dropdown-parent ${configOpen ? "open" : ""}`}>
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

                <ul className="dashboard-submenu">
                  <li className={`dashboard-menu-item ${activeTab === "usuarios" ? "active" : ""}`}>
                    <button
                      type="button"
                      onClick={() => handleSelectTab("usuarios")}
                      className="dash-btn-action"
                    >
                      <User size={18} />
                      <span>Usuários</span>
                    </button>
                  </li>
                  <li className={`dashboard-menu-item ${activeTab === "redes" ? "active" : ""}`}>
                    <button
                      type="button"
                      onClick={() => handleSelectTab("redes")}
                      className="dash-btn-action"
                    >
                      <Link2 size={18} />
                      <span>Redes Sociais</span>
                    </button>
                  </li>
                  <li className={`dashboard-menu-item ${activeTab === "sobre" ? "active-sub" : ""}`}>
                    <button
                      type="button"
                      onClick={() => handleSelectTab("sobre")}
                      className="dash-btn-action"
                    >
                      <FileText size={18} />
                      <span>Sobre Nós</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}

            <button className="section-btn-bth" type="button">
              <a href="/" className="btn-bth">
                <ArrowLeft size={18} />
                <span>Voltar para o site</span>
              </a>
            </button>
            <button
              className="section-btn-bth btn-logout"
              type="button"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL DA DASHBOARD --- */}
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
            handleTabChange={(tab) => handleSelectTab(tab)}
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
                      type="button"
                      onClick={() => handleSelectTab("depoimentos")}
                      className="metric-btn-action"
                    >
                      <div className="metric-icon">
                        <MessageSquare size={22} />
                      </div>
                    </button>
                  </div>

                  <div className="metric-card">
                    <div className="metric-info">
                      <h3>Pedidos de Orçamento</h3>
                      <p>{qtdLeads}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectTab("orcamentos")}
                      className="metric-btn-action"
                    >
                      <div className="metric-icon">
                        <ClipboardList size={22} />
                      </div>
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

            {/* --- DEMAIS ABAS --- */}
            {activeTab === "depoimentos" && (
              <section className="dashboard-data-section">
                <DashDepoimentos />
              </section>
            )}

            {activeTab === "orcamentos" && (
              <section className="dashboard-data-section">
                <DashLeads />
              </section>
            )}

            {activeTab === "video_gallery" && (
              <section className="dashboard-data-section">
                <Video />
              </section>
            )}

            {activeTab === "service" && (
              <section className="dashboard-data-section">
                <DashServicos />
              </section>
            )}

            {activeTab === "change_password" && (
              <section className="dashboard-data-section">
                <ChangePassword />
              </section>
            )}

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