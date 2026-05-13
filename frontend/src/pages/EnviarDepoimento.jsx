import React, { useState } from "react";
import api from "../api";

const EnviarDepoimento = () => {
  const [sent, setSent] = useState(false);
  const [data, setData] = useState({
    nome_cliente: "",
    texto: "",
    estrelas: 5,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("depoimentos/", data);
    setSent(true);
  };

  if (sent)
    return (
      <div className="section-container">
        <h2>Obrigado! Seu depoimento será analisado.</h2>
      </div>
    );

  return (
    <section className="section-container">
      <h2>Deixe sua avaliação</h2>
      <form
        onSubmit={handleSubmit}
        className="contact-form"
        style={{ background: "#fff", padding: "20px", borderRadius: "15px" }}
      >
        <input
          type="text"
          placeholder="Seu Nome"
          onChange={(e) => setData({ ...data, nome_cliente: e.target.value })}
          required
        />
        <textarea
          placeholder="Como foi sua experiência?"
          onChange={(e) => setData({ ...data, texto: e.target.value })}
          required
        />
        <select
          onChange={(e) =>
            setData({ ...data, estrelas: parseInt(e.target.value) })
          }
        >
          <option value="5">5 Estrelas (Excelente)</option>
          <option value="4">4 Estrelas (Muito Bom)</option>
          <option value="3">3 Estrelas (Bom)</option>
        </select>
        <button type="submit" className="btn-submit">
          Enviar Avaliação
        </button>
      </form>
    </section>
  );
};

export default EnviarDepoimento;
