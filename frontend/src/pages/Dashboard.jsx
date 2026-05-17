import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  MessageSquare,
  ClipboardList,
  LogOut,
  Check,
  Trash2,
  Clock,
  User,
  MapPin,
} from "lucide-react";

const Dashboard = () => {
  // Estado para controlar a aba ativa no painel administrativo
  const [activeTab, setActiveTab] = useState("resumo");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const isAuth = localStorage.getItem("auth") === "true";

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  // Estados para simular os dados do banco de dados
  const [depoimentos, setDepoimentos] = useState([
    {
      id: 1,
      cliente: "Carlos Souza",
      regiao: "Águas Claras - DF",
      texto:
        "Excelente atendimento, a cortina de vidro ficou perfeita e o prazo foi cumprido à risca.",
      status: "pendente",
    },
    {
      id: 2,
      cliente: "Ana Beatriz",
      regiao: "Taguatinga - DF",
      texto:
        "O box de banheiro elegance mudou completamente o visual do meu quarto. Super recomendo!",
      status: "pendente",
    },
    {
      id: 3,
      cliente: "Marcos Paulo",
      regiao: "Asa Sul - DF",
      texto:
        "Equipe técnica extremamente profissional no reparo das minhas janelas.",
      status: "aprovado",
    },
  ]);

  const [orcamentos, setOrcamentos] = useState([
    {
      id: 101,
      cliente: "Roberto Alves",
      telefone: "(61) 98888-1122",
      servico: "Cortina de Vidro",
      data: "17/05/2026",
    },
    {
      id: 102,
      cliente: "Juliana Mendes",
      telefone: "(61) 99111-3344",
      servico: "Espelhos Canelados",
      data: "16/05/2026",
    },
    {
      id: 103,
      cliente: "Ricardo Frota",
      telefone: "(61) 98222-5566",
      servico: "Box de Banheiro",
      data: "15/05/2026",
    },
  ]);

  // Função para aprovar depoimento (Muda o status para aprovado e simula atualização)
  const handleApproveDepoimento = (id) => {
    setDepoimentos((prev) =>
      prev.map((dep) => (dep.id === id ? { ...dep, status: "aprovado" } : dep)),
    );
    alert(
      "Depoimento aprovado com sucesso! Ele agora aparecerá no carrossel do site.",
    );
  };

  // Função para excluir depoimento ou orçamento
  const handleDeleteItem = (id, tipo) => {
    if (window.confirm(`Tem certeza que deseja remover este ${tipo}?`)) {
      if (tipo === "depoimento") {
        setDepoimentos((prev) => prev.filter((dep) => dep.id !== id));
      } else {
        setOrcamentos((prev) => prev.filter((orc) => orc.id !== id));
      }
    }
  };

  // Simulação de efeito de transição de carregamento ao trocar de aba
  const handleTabChange = (tabId) => {
    setLoading(true);
    setActiveTab(tabId);
    setTimeout(() => {
      setLoading(false);
    }, 400);
  };

  // Filtragem rápida de métricas
  const depoimentosPendentes = depoimentos.filter(
    (d) => d.status === "pendente",
  ).length;
  const totalOrcamentos = orcamentos.length;

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
                <a>
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
                <a>
                  <MessageSquare size={18} /> Depoimentos (
                  {depoimentosPendentes})
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
                <a>
                  <ClipboardList size={18} /> Orçamentos
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
            Carregando informações...
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
                      <p>{totalOrcamentos}</p>
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
                <h2>Moderação de Depoimentos</h2>
                <div className="table-responsive">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>
                          <User size={14} style={{ marginRight: "5px" }} />{" "}
                          Cliente
                        </th>
                        <th>
                          <MapPin size={14} style={{ marginRight: "5px" }} />{" "}
                          Região
                        </th>
                        <th>Mensagem</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {depoimentos.map((dep) => (
                        <tr key={dep.id}>
                          <td>
                            <strong>{dep.cliente}</strong>
                          </td>
                          <td>{dep.regiao}</td>
                          <td>
                            <span
                              style={{
                                fontSize: "0.9rem",
                                fontStyle: "italic",
                              }}
                            >
                              "{dep.texto}"
                            </span>
                          </td>
                          <td>
                            <span
                              style={{
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "0.8rem",
                                fontWeight: "bold",
                                background:
                                  dep.status === "aprovado"
                                    ? "rgba(37,211,102,0.2)"
                                    : "rgba(255,193,7,0.2)",
                                color:
                                  dep.status === "aprovado"
                                    ? "#25d366"
                                    : "#ffc107",
                              }}
                            >
                              {dep.status.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              {dep.status === "pendente" && (
                                <button
                                  className="btn-action-approve"
                                  title="Aprovar Depoimento"
                                  onClick={() =>
                                    handleApproveDepoimento(dep.id)
                                  }
                                >
                                  <Check size={16} />
                                </button>
                              )}
                              <button
                                className="btn-action-delete"
                                title="Excluir Depoimento"
                                onClick={() =>
                                  handleDeleteItem(dep.id, "depoimento")
                                }
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* --- VISÃO: SOLICITAÇÕES DE ORÇAMENTO --- */}
            {activeTab === "orcamentos" && (
              <section className="dashboard-data-section">
                <h2>Lista de Orçamentos Recebidos</h2>
                <div className="table-responsive">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nome do Cliente</th>
                        <th>Contato WhatsApp</th>
                        <th>Tipo de Serviço</th>
                        <th>Data de Envio</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orcamentos.map((orc) => (
                        <tr key={orc.id}>
                          <td>#{orc.id}</td>
                          <td>
                            <strong>{orc.cliente}</strong>
                          </td>
                          <td>
                            <a
                              href={`https://wa.me/55${orc.telefone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                color: "#25d366",
                                textDecoration: "none",
                                fontWeight: "500",
                              }}
                            >
                              {orc.telefone} (Chamar)
                            </a>
                          </td>
                          <td>
                            <span
                              style={{
                                background: "rgba(138, 43, 226, 0.2)",
                                padding: "4px 10px",
                                borderRadius: "20px",
                                fontSize: "0.85rem",
                              }}
                            >
                              {orc.servico}
                            </span>
                          </td>
                          <td>{orc.data}</td>
                          <td>
                            <button
                              className="btn-action-delete"
                              title="Remover Registro de Orçamento"
                              onClick={() =>
                                handleDeleteItem(orc.id, "orçamento")
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
