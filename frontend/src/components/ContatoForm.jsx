import React, { useState } from "react";
import api from "../api";
import { Send, Phone } from "lucide-react";

const ContatoForm = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    whatsapp: "",
    mensagem: "",
  });
  const [status, setStatus] = useState(null); // 'success' ou 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("contatos/", formData);
      setStatus("success");
      setFormData({ nome: "", email: "", whatsapp: "", mensagem: "" });
    } catch (error) {
      console.error("Erro ao enviar contato:", error);
      setStatus("error");
    }
  };

  return (
    <section className="section-container">
      <div className="contact-card">
        <form onSubmit={handleSubmit} className="contact-form">
          <input
            type="text"
            name="nome"
            placeholder="Seu Nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="whatsapp"
            placeholder="WhatsApp (DDD)"
            value={formData.whatsapp}
            onChange={handleChange}
            required
          />
          <textarea
            name="mensagem"
            placeholder="Como podemos te ajudar?"
            value={formData.mensagem}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit" className="btn-submit-form">
            <Send size={18} /> Enviar Mensagem
          </button>

          {status === "success" && (
            <p className="msg-success">
              Mensagem enviada com sucesso! Logo entraremos em contato.
            </p>
          )}
          {status === "error" && (
            <p className="msg-error">
              Ocorreu um erro. Tente novamente ou use o WhatsApp.
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContatoForm;
