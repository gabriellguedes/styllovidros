import React, { useEffect, useState } from "react";
import api from "../api";
import { Phone, Trash2, CheckSquare, Square } from "lucide-react";
import toast from "react-hot-toast";

const DashLeads = () => {
  const [leads, setLeads] = useState([]);
  const [categorias, setCategorias] = useState([]); // 🔥 NOVO: Estado para armazenar as categorias do banco

  const fetchDados = async () => {
    try {
      // 1. Carrega as categorias do banco de dados primeiro
      const resCategorias = await api.get("categorias/");
      setCategorias(resCategorias.data);

      // 2. Carrega os leads/mensagens
      const resLeads = await api.get("contatos/");
      
      const dadosTratados = resLeads.data.map(lead => ({
        ...lead,
        lido: lead.lido || false
      }));
      setLeads(dadosTratados);
    } catch (err) {
      console.error("Erro ao buscar dados do servidor:", err);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  // 🔥 Função auxiliar para traduzir o ID numérico no Nome da Categoria
  const obterNomeCategoria = (servicoId) => {
    if (!servicoId) return "Geral";
    // Tenta encontrar a categoria pelo ID numérico
    const categoriaEncontrada = categorias.find((cat) => cat.id === Number(servicoId));
    // Se encontrar retorna o nome, se não (ou se já for texto antigo), exibe o próprio valor
    return categoriaEncontrada ? categoriaEncontrada.nome : servicoId;
  };

  const toggleLido = async (id, statusAtual) => {
    try {
      // Se a sua API Django aceitar atualizações parciais, pode descomentar a linha abaixo:
      // await api.patch(`contatos/${id}/`, { lido: !statusAtual });
      
      setLeads(leads.map(lead => lead.id === id ? { ...lead, lido: !statusAtual } : lead));
      if (!statusAtual) {
        toast.success("Mensagem marcada como lida!");
      }
    } catch (err) {
      console.error("Erro ao atualizar status da mensagem:", err);
    }
  };

  const deleteLead = async (id) => {
    if (window.confirm("Tem a certeza que deseja excluir esta mensagem?")) {
      const toastId = toast.loading("Removendo...");
      try {
        await api.delete(`contatos/${id}/`);
        toast.success("Mensagem removida com sucesso!", { id: toastId });
        fetchDados(); // Recarrega a tabela atualizada
      } catch (err) {
        toast.error("Erro ao remover mensagem.", { id: toastId });
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
          Gerencie os pedidos enviados via formulário. Mensagens esmaecidas indicam que já foram lidas.
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
                background: "rgba(255,255,255,0.02)"
              }}
            >
              <th style={{ padding: "12px 8px", width: "60px", textAlign: "center" }}>Status</th>
              <th style={{ padding: "12px" }}>ID</th>
              <th style={{ padding: "12px" }}>Nome do Cliente</th>
              <th style={{ padding: "12px" }}>Contato WhatsApp</th>
              <th style={{ padding: "12px" }}>Categoria de Interesse</th>
              <th style={{ padding: "12px" }}>Mensagem / Detalhes (Região)</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  background: lead.lido ? "rgba(0, 0, 0, 0.15)" : "transparent",
                  opacity: lead.lido ? 0.55 : 1,
                  transition: "all 0.2s ease"
                }}
              >
                <td style={{ padding: "12px 8px", textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={() => toggleLido(lead.id, lead.lido)}
                    style={{
                      background: "none",
                      border: "none",
                      color: lead.lido ? "var(--accent-purple, #8a2be2)" : "rgba(255,255,255,0.3)",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    title={lead.lido ? "Marcar como Não Lido" : "Marcar como Lido"}
                  >
                    {lead.lido ? <CheckSquare size={19} /> : <Square size={19} />}
                  </button>
                </td>

                <td style={{ padding: "12px", color: "rgba(255,255,255,0.5)" }}>#{lead.id}</td>
                
                <td style={{ padding: "12px" }}>
                  <strong style={{ textDecoration: lead.lido ? "line-through" : "none" }}>
                    {lead.nome}
                  </strong>
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
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <Phone size={14} /> {lead.whatsapp}
                  </a>
                </td>
                
                {/* 🎯 CAMPO CORRIGIDO: Agora usa a função obterNomeCategoria() */}
                <td style={{ padding: "12px" }}>
                  <span
                    style={{
                      background: lead.lido ? "rgba(255,255,255,0.05)" : "rgba(138, 43, 226, 0.2)",
                      border: lead.lido ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(138, 43, 226, 0.3)",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      color: lead.lido ? "rgba(255,255,255,0.5)" : "#fff"
                    }}
                  >
                    {obterNomeCategoria(lead.servico)}
                  </span>
                </td>
                
                <td
                  style={{
                    padding: "12px",
                    fontSize: "0.9rem",
                    color: lead.lido ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.85)",
                    maxWidth: "350px",
                    wordBreak: "break-word"
                  }}
                >
                  {lead.mensagem || "Sem detalhes informados."}
                </td>
                
                <td style={{ padding: "12px", textAlign: "center" }}>
                  <button
                    className="btn-action-delete"
                    title="Excluir Permanentemente"
                    onClick={() => deleteLead(lead.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ff4d4d",
                      cursor: "pointer",
                      padding: "4px"
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
        <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.4)" }}>
          Nenhum lead ou pedido de orçamento recebido até ao momento.
        </div>
      )}
    </div>
  );
};

export default DashLeads;