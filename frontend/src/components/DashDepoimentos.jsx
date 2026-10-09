import React, { useEffect, useState } from "react";
import api from "../api";
import { Trash2, CheckCircle, XCircle, Star } from "lucide-react";
import toast from "react-hot-toast";

const DashDepoimentos = () => {
  const [depoimentos, setDepoimentos] = useState([]);

  const fetchDepoimentos = async () => {
    try {
      const res = await api.get("depoimentos/");
      setDepoimentos(res.data);
    } catch (err) {
      console.error("Erro ao carregar depoimentos:", err);
    }
  };

  useEffect(() => {
    fetchDepoimentos();
  }, []);

  // Alterna a visibilidade do depoimento na Home
  const handleToggleVisibilidade = async (id, statusAtual) => {
    try {
      await api.patch(`depoimentos/${id}/`, {
        exibir_no_site: !statusAtual,
      });
      toast.success(
        !statusAtual ? "Depoimento aprovado no site!" : "Depoimento ocultado."
      );
      fetchDepoimentos();
    } catch (err) {
      toast.error("Erro ao atualizar o status do depoimento.");
    }
  };

  const handleDeleteDepoimento = async (id, autor) => {
    if (
      window.confirm(
        `Tem a certeza que deseja eliminar o depoimento de "${autor}"?`
      )
    ) {
      try {
        await api.delete(`depoimentos/${id}/`);
        toast.success("Depoimento removido definitivamente.");
        fetchDepoimentos();
      } catch (err) {
        toast.error("Erro ao remover o depoimento.");
      }
    }
  };

  return (
    <div className="dash-section">
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ color: "#fff", marginBottom: "5px" }}>
          Gerir Avaliações dos Clientes
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
          Modere as avaliações que aparecem no carrossel de feedback da Styllo Vidros.
        </p>
      </div>

      {/* --- VISUALIZAÇÃO DESKTOP: TABELA --- */}
      <div className="dash-table-container desktop-only-view">
        <table
          className="dashboard-table"
          style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}
        >
          <thead>
            <tr
              style={{
                textAlign: "left",
                borderBottom: "2px solid rgba(255,255,255,0.1)",
              }}
            >
              <th style={{ padding: "12px" }}>Cliente</th>
              <th style={{ padding: "12px" }}>Avaliação (Texto)</th>
              <th style={{ padding: "12px" }}>Estrelas / Nota</th>
              <th style={{ padding: "12px" }}>Status no Site</th>
              <th style={{ padding: "12px" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {depoimentos.map((dep) => (
              <tr
                key={dep.id}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                <td style={{ padding: "12px" }}>
                  <strong>{dep.nome_cliente}</strong>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    ID: #{dep.id}
                  </div>
                </td>
                <td
                  style={{
                    padding: "12px",
                    fontStyle: "italic",
                    color: "rgba(255,255,255,0.8)",
                    maxWidth: "400px",
                  }}
                >
                  "{dep.texto}"
                </td>
                <td style={{ padding: "12px", color: "#ffb703" }}>
                  {dep.estrelas || "⭐⭐⭐⭐⭐"}
                </td>
                <td style={{ padding: "12px" }}>
                  <span
                    className={`status-pill ${dep.exibir_no_site ? "published" : "pending"}`}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      background: dep.exibir_no_site
                        ? "rgba(46, 125, 50, 0.2)"
                        : "rgba(239, 108, 0, 0.2)",
                      color: dep.exibir_no_site ? "#81c784" : "#ffb74d",
                    }}
                  >
                    {dep.exibir_no_site ? "Exibindo" : "Oculto"}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={() =>
                        handleToggleVisibilidade(dep.id, dep.exibir_no_site)
                      }
                      title={
                        dep.exibir_no_site
                          ? "Ocultar do Site"
                          : "Publicar no Site"
                      }
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: dep.exibir_no_site ? "#ffb74d" : "#81c784",
                      }}
                    >
                      {dep.exibir_no_site ? (
                        <XCircle size={18} />
                      ) : (
                        <CheckCircle size={18} />
                      )}
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteDepoimento(dep.id, dep.nome_cliente)
                      }
                      title="Excluir Permanente"
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ff4d4d",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- VISUALIZAÇÃO MOBILE: CARDS (Estilo Portfólio) --- */}
      <div className="dash-cards-container-mobile mobile-only-view">
        {depoimentos.map((dep) => (
          <div key={dep.id} className="dash-mobile-card">
            {/* Topo do Card: Ações + ID */}
            <div className="dash-card-header">
              <span className="dash-card-id">#{dep.id}</span>
              <div className="dash-card-actions">
                <button
                  type="button"
                  onClick={() =>
                    handleToggleVisibilidade(dep.id, dep.exibir_no_site)
                  }
                  className={`btn-card-action ${dep.exibir_no_site ? "btn-hide" : "btn-publish"}`}
                >
                  {dep.exibir_no_site ? (
                    <>
                      <XCircle size={15} /> Ocultar
                    </>
                  ) : (
                    <>
                      <CheckCircle size={15} /> Publicar
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDeleteDepoimento(dep.id, dep.nome_cliente)
                  }
                  className="btn-card-action btn-delete"
                  title="Excluir"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Corpo do Card: Informações */}
            <div className="dash-card-body">
              <div className="dash-card-title-row">
                <h3>{dep.nome_cliente}</h3>
                <span
                  className="status-pill"
                  style={{
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    background: dep.exibir_no_site
                      ? "rgba(46, 125, 50, 0.2)"
                      : "rgba(239, 108, 0, 0.2)",
                    color: dep.exibir_no_site ? "#81c784" : "#ffb74d",
                  }}
                >
                  {dep.exibir_no_site ? "Exibindo" : "Oculto"}
                </span>
              </div>

              <div className="dash-card-stars" style={{ color: "#ffb703", margin: "4px 0" }}>
                {dep.estrelas || "⭐⭐⭐⭐⭐"} <span>Estrelas</span>
              </div>

              <p className="dash-card-text">"{dep.texto}"</p>
            </div>
          </div>
        ))}
      </div>

      {depoimentos.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          Nenhum depoimento cadastrado no banco de dados.
        </div>
      )}
    </div>
  );
};

export default DashDepoimentos;