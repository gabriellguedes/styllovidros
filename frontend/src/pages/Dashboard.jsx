import React, { useEffect, useState } from "react";
import api from "../api";
import { Check, Trash2, Clock } from "lucide-react";

const Dashboard = () => {
  const [depoimentos, setDepoimentos] = useState([]);

  const fetchAll = async () => {
    const res = await api.get("depoimentos/");
    setDepoimentos(res.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    await api.patch(`depoimentos/${id}/`, { exibir_no_site: !currentStatus });
    fetchAll(); // Atualiza a lista
  };

  const deleteDepoimento = async (id) => {
    if (window.confirm("Deseja apagar este depoimento?")) {
      await api.delete(`depoimentos/${id}/`);
      fetchAll();
    }
  };

  return (
    <div className="section-container">
      <h1>Painel Styllo Vidros</h1>
      <div style={{ marginTop: "30px" }}>
        <h3>Gerenciar Depoimentos</h3>
        <table
          style={{
            width: "100%",
            background: "#fff",
            borderCollapse: "collapse",
            marginTop: "10px",
          }}
        >
          <thead>
            <tr
              style={{
                textAlign: "left",
                borderBottom: "2px solid var(--primary)",
              }}
            >
              <th style={{ padding: "10px" }}>Cliente</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {depoimentos.map((d) => (
              <tr key={d.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "10px" }}>
                  <strong>{d.nome_cliente}</strong>
                  <br />
                  <small>{d.texto.substring(0, 50)}...</small>
                </td>
                <td>
                  {d.exibir_no_site ? (
                    <span style={{ color: "green" }}>● Publicado</span>
                  ) : (
                    <span style={{ color: "orange" }}>● Pendente</span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => toggleStatus(d.id, d.exibir_no_site)}
                    style={{
                      marginRight: "10px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <Check color={d.exibir_no_site ? "gray" : "green"} />
                  </button>
                  <button
                    onClick={() => deleteDepoimento(d.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 color="red" size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
