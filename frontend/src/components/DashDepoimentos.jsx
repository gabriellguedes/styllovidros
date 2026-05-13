import React, { useEffect, useState } from "react";
import api from "../api";
import {
  CheckCircle,
  XCircle,
  Trash2,
  Star,
  MessageSquare,
} from "lucide-react";

const DashDepoimentos = () => {
  const [depoimentos, setDepoimentos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDepoimentos = async () => {
    try {
      // Buscamos todos (sem o filtro de aprovados) para gestão
      const res = await api.get("depoimentos/");
      setDepoimentos(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao carregar depoimentos:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepoimentos();
  }, []);

  const toggleAprovacao = async (id, statusAtual) => {
    try {
      // Usamos PATCH para alterar apenas o campo de exibição
      await api.patch(`depoimentos/${id}/`, { exibir_no_site: !statusAtual });
      fetchDepoimentos(); // Recarrega a lista
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  const deleteDepoimento = async (id) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir este depoimento permanentemente?",
      )
    ) {
      try {
        await api.delete(`depoimentos/${id}/`);
        fetchDepoimentos();
      } catch (err) {
        console.error("Erro ao excluir depoimento:", err);
      }
    }
  };

  if (loading) return <p>Carregando gestão de depoimentos...</p>;

  return (
    <div className="dash-section">
      <div className="dash-section-header">
        <h3>
          <MessageSquare size={20} /> Gestão de Depoimentos
        </h3>
        <span className="badge-count">{depoimentos.length} total</span>
      </div>

      <div className="dash-table-container">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Avaliação</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {depoimentos.map((dep) => (
              <tr
                key={dep.id}
                className={!dep.exibir_no_site ? "row-pending" : ""}
              >
                <td>
                  <strong>{dep.nome_cliente}</strong>
                  <p className="dep-preview">{dep.texto.substring(0, 60)}...</p>
                </td>
                <td>
                  <div className="stars-display">
                    {dep.estrelas}{" "}
                    <Star size={14} fill="#FFD700" color="#FFD700" />
                  </div>
                </td>
                <td>
                  {dep.exibir_no_site ? (
                    <span className="status-pill published">Publicado</span>
                  ) : (
                    <span className="status-pill pending">Pendente</span>
                  )}
                </td>
                <td className="actions-cell">
                  <button
                    onClick={() => toggleAprovacao(dep.id, dep.exibir_no_site)}
                    className="btn-icon"
                    title={
                      dep.exibir_no_site
                        ? "Ocultar do site"
                        : "Publicar no site"
                    }
                  >
                    {dep.exibir_no_site ? (
                      <XCircle color="#orange" />
                    ) : (
                      <CheckCircle color="#2ecc71" />
                    )}
                  </button>

                  <button
                    onClick={() => deleteDepoimento(dep.id)}
                    className="btn-icon btn-danger"
                    title="Excluir permanentemente"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {depoimentos.length === 0 && (
          <p className="empty-msg">Nenhum depoimento recebido ainda.</p>
        )}
      </div>
    </div>
  );
};

export default DashDepoimentos;
