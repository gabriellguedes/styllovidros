import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Video from "../components/DashVideos";
import api from "../api";
import {
  BarChart3,
  MessageSquare,
  ClipboardList,
  LogOut,
  Clock,
} from "lucide-react";
import DashServicos from "../components/DashServicos";
import DashDepoimentos from "../components/DashDepoimentos";
import DashLeads from "../components/DashLeads";

const Dashboard = () => {
  // Estado para controlar a aba ativa no painel administrativo
  const [activeTab, setActiveTab] = useState("resumo");
  const [loading, setLoading] = useState(false);

  // Estados para armazenar os dados das métricas em tempo real
  const [qtdLeads, setQtdLeads] = useState(0);
  const [depoimentosPendentes, setDepoimentosPendentes] = useState(0);

  const navigate = useNavigate();

  // 1. Proteção de Rota: Se não estiver autenticado, manda de volta para a Home/Login
  useEffect(() => {
    const isAuth = localStorage.getItem("auth") === "true";
    if (!isAuth) {
      navigate("/");
    } else {
      fetchMetrics();
    }
  }, [navigate]);

  // 2. Função para buscar os totais das tabelas e alimentar os Cards de Resumo
  const fetchMetrics = async () => {
    try {
      // Busca quantidade de contatos/leads
      const resContatos = await api.get("contatos/");
      setQtdLeads(resContatos.data.length);

      // Busca quantidade de depoimentos pendentes (exibir_no_site === false)
      const resDepoimentos = await api.get("depoimentos/");
      const pendentes = resDepoimentos.data.filter(
        (d) => !d.exibir_no_site,
      ).length;
      setDepoimentosPendentes(pendentes);
    } catch (err) {
      console.error("Erro ao carregar métricas do painel:", err);
    }
  };

  // 3. Função para gerenciar a troca de abas com efeito suave de carregamento
  const handleTabChange = (tabId) => {
    setLoading(true);
    setActiveTab(tabId);

    // Atualiza as métricas sempre que voltar para o resumo
    if (tabId === "resumo") {
      fetchMetrics();
    }

    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  // 4. Efetuar o logout do sistema
  const handleLogout = () => {
    if (window.confirm("Deseja realmente sair do painel administrativo?")) {
      localStorage.removeItem("auth");
      localStorage.removeItem("token");
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <div className="dashboard-container">
      {/* --- SIDEBAR LATERAL --- */}
      <aside className="dashboard-sidebar">
        <div>
          <div className="dashboard-brand">
            <h2>
              STYLLO <span>PAINEL</span>
            </h2>
          </div>
          <ul className="dashboard-menu">
            <li
              className={`dashboard-menu-item ${activeTab === "resumo" ? "active" : ""}`}
            >
              <button
                onClick={() => handleTabChange("resumo")}
                style={{
                  background: "none",
                  border: "none",
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer",
                }}
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
                style={{
                  background: "none",
                  border: "none",
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <a style={{ pointerEvents: "none" }}>
                  <MessageSquare size={18} /> Depoimentos
                </a>
              </button>
            </li>
            <li
              className={`dashboard-menu-item ${activeTab === "orcamentos" ? "active" : ""}`}
            >
              <button
                onClick={() => handleTabChange("orcamentos")}
                style={{
                  background: "none",
                  border: "none",
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <a style={{ pointerEvents: "none" }}>
                  <ClipboardList size={18} /> Orçamentos
                </a>
              </button>
            </li>
            <li
              className={`dashboard-menu-item ${activeTab === "video_gallery" ? "active" : ""}`}
            >
              <button
                onClick={() => handleTabChange("video_gallery")}
                style={{
                  background: "none",
                  border: "none",
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <a style={{ pointerEvents: "none" }}>
                  <ClipboardList size={18} /> Galeria Vídeos
                </a>
              </button>
            </li>
            {/* Lista de Trabalhos Feitos*/}
            <li
              className={`dashboard-menu-item ${activeTab === "service" ? "active" : ""}`}
            >
              <button
                onClick={() => handleTabChange("service")}
                style={{
                  background: "none",
                  border: "none",
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <a style={{ pointerEvents: "none" }}>
                  <ClipboardList size={18} /> Trabalhos
                </a>
              </button>
            </li>
          </ul>
        </div>

        <button className="btn-logout" onClick={handleLogout}>
          <LogOut size={18} /> Sair do Sistema
        </button>
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
                    <div className="metric-icon">
                      <MessageSquare size={22} />
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-info">
                      <h3>Pedidos de Orçamento</h3>
                      <p>{qtdLeads}</p>
                    </div>
                    <div className="metric-icon">
                      <ClipboardList size={22} />
                    </div>
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

            {/* --- VÍDEOS GALLERY --- */}
            {activeTab === "service" && (
              <section className="dashboard-data-section">
                <DashServicos />
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
