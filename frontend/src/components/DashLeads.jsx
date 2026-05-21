import React, { useEffect, useState } from "react";
import api from "../api";
import { Mail, Phone, Calendar, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const DashLeads = () => {
  const [leads, setLeads] = useState([]);

  const fetchLeads = async () => {
    try {
      const res = await api.get("contatos/");
      setLeads(res.data);
    } catch (err) {
      console.error("Erro ao buscar contatos:", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const deleteLead = async (id) => {
    if (window.confirm("Tem a certeza que deseja excluir esta mensagem?")) {
      try {
        await api.delete(`contatos/${id}/`);
        toast.success("Mensagem removida com sucesso!");
        fetchLeads();
      } catch (err) {
        toast.error("Erro ao remover mensagem.");
      }
    }
  };

  return (
    <div className="dash-section">
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ color: "#fff", marginBottom: "5px" }}>
          Mensagens e Orçamentos Recebidos
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
          Abaixo estão os contatos enviados pelos clientes através do formulário
          do site.
        </p>
      </div>

      <div className="dash-table-container">
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
              <th style={{ padding: "12px" }}>ID</th>
              <th style={{ padding: "12px" }}>Nome do Cliente</th>
              <th style={{ padding: "12px" }}>Contato WhatsApp</th>
              <th style={{ padding: "12px" }}>Tipo de Serviço</th>
              <th style={{ padding: "12px" }}>Mensagem / Detalhes</th>
              <th style={{ padding: "12px" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                <td style={{ padding: "12px" }}>#{lead.id}</td>
                <td style={{ padding: "12px" }}>
                  <strong>{lead.nome || lead.cliente}</strong>
                </td>
                <td style={{ padding: "12px" }}>
                  <a
                    href={`https://wa.me/55${(lead.whatsapp || "").replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#25d366",
                      textDecoration: "none",
                      fontWeight: "500",
                    }}
                  >
                    {lead.whatsapp} (Chamar)
                  </a>
                </td>
                <td style={{ padding: "12px" }}>
                  <span
                    style={{
                      background: "rgba(138, 43, 226, 0.2)",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                    }}
                  >
                    {lead.servico || "Geral"}
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px",
                    fontSize: "0.9rem",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {lead.mensagem || "Sem mensagem informada."}
                </td>
                <td style={{ padding: "12px" }}>
                  <button
                    className="btn-action-delete"
                    title="Remover Registro"
                    onClick={() => deleteLead(lead.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ff4d4d",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {leads.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          Nenhum lead ou pedido de orçamento recebido até ao momento.
        </div>
      )}
    </div>
  );
};

export default DashLeads;
