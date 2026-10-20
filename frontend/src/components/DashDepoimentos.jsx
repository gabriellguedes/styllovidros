import React, { useEffect, useState } from "react";
import api from "../api";
import { Trash2, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const DashDepoimentos = () => {
  const [depoimentos, setDepoimentos] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState("pendentes");

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

  const handleToggleVisibilidade = async (id, statusAtual) => {
    try {
      await api.patch(`depoimentos/${id}/`, {
        exibir_no_site: !statusAtual,
      });
      toast.success(
        !statusAtual ? "Depoimento aprovado e publicado no site!" : "Depoimento ocultado."
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

  const depoimentosFiltrados = depoimentos.filter((dep) => {
    if (abaAtiva === "pendentes") return !dep.exibir_no_site;
    if (abaAtiva === "visiveis") return dep.exibir_no_site;
    return true;
  });

  const totalPendentes = depoimentos.filter((d) => !d.exibir_no_site).length;
  const totalVisiveis = depoimentos.filter((d) => d.exibir_no_site).length;

  return (
    <div className="dash-section dash-fixed-layout">
      {/* --- CABEÇALHO FIXO NO TOPO (Apenas em telas até 992px) --- */}
      <div className="dash-sticky-header">
        <div style={{ marginBottom: "15px" }}>
          <h2 style={{ color: "#fff", marginBottom: "5px" }}>
            Gerir Avaliações dos Clientes
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
            Modere as avaliações que aparecem no carrossel de feedback utilizando as abas abaixo.
          </p>
        </div>

        {/* --- SISTEMA DE ABAS --- */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => setAbaAtiva("pendentes")}
            style={{
              background: abaAtiva === "pendentes" ? "#8a2be2" : "rgba(255,255,255,0.05)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
          >
            Novos / Pendentes ({totalPendentes})
          </button>

          <button
            onClick={() => setAbaAtiva("visiveis")}
            style={{
              background: abaAtiva === "visiveis" ? "#8a2be2" : "rgba(255,255,255,0.05)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
          >
            Visíveis no Site ({totalVisiveis})
          </button>
        </div>
      </div>

      {/* --- ÁREA DE ROLAGEM APENAS DOS CARDS --- */}
      <div className="dash-scrollable-content">
        <div className="dash-cards-container-mobile" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {depoimentosFiltrados.map((dep) => (
            <div key={dep.id} className="dash-mobile-card">
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
                    {dep.exibir_no_site ? "Exibindo" : "Pendente"}
                  </span>
                </div>

                <div className="dash-card-stars" style={{ color: "#ffb703", margin: "6px 0" }}>
                  {"⭐".repeat(dep.estrelas || 5)} <span style={{ fontSize: "0.85rem", marginLeft: "4px" }}>({dep.estrelas || 5}/5)</span>
                </div>

                <p className="dash-card-text">"{dep.texto}"</p>
              </div>
            </div>
          ))}
        </div>

        {depoimentosFiltrados.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            Nenhum depoimento encontrado nesta categoria.
          </div>
        )}
      </div>
    </div>
  );
};

export default DashDepoimentos;