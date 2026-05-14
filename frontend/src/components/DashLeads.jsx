import React, { useEffect, useState } from "react";
import api from "../api";
import { Mail, Phone, Calendar, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const DashLeads = () => {
  const [leads, setLeads] = useState([]);

  const fetchLeads = async () => {
    const res = await api.get("contatos/");
    setLeads(res.data);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const deleteLead = async (id) => {
    if (window.confirm("Excluir esta mensagem?")) {
      await api.delete(`contatos/${id}/`);
      toast.success("Mensagem removida");
      fetchLeads();
    }
  };

  return (
    <div className="dash-section">
      <h3>
        <Mail size={20} /> Mensagens de Clientes (Leads)
      </h3>
      <div className="leads-list">
        {leads.map((lead) => (
          <div key={lead.id} className="lead-card">
            <div className="lead-header">
              <strong>{lead.nome}</strong>
              <span className="lead-date">
                <Calendar size={14} />{" "}
                {new Date(lead.data_envio).toLocaleDateString()}
              </span>
            </div>
            <p className="lead-msg">"{lead.mensagem}"</p>
            <div className="lead-footer">
              <a href={`tel:${lead.telefone}`} className="contact-link">
                <Phone size={14} /> {lead.telefone}
              </a>
              <span className="lead-email">{lead.email}</span>
              <button onClick={() => deleteLead(lead.id)} className="btn-del">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {leads.length === 0 && <p>Nenhuma mensagem recebida.</p>}
      </div>
    </div>
  );
};

export default DashLeads;
