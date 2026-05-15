import React, { useEffect, useState } from "react";
import api from "../api";
import { Star, MessageSquare } from "lucide-react";

// Adicione 'props' aqui como parâmetro da função
const Depoimentos = (props) => {
  const [depoimentos, setDepoimentos] = useState([]);

  useEffect(() => {
    // Agora 'props.type' funcionará corretamente
    const url =
      props.type === "approved" ? "depoimentos/?approved=true" : "depoimentos/";

    api
      .get(url)
      .then((response) => setDepoimentos(response.data))
      .catch((error) => console.error(error));
  }, [props.type]);

  const renderEstrelas = (quantidade) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < quantidade ? "#FFD700" : "none"}
        color="#FFD700"
      />
    ));
  };

  return (
    <section className="section-container">
      <h2 className="section-title">
        <MessageSquare /> O que dizem nossos clientes
      </h2>
      <div className="testimonial-item">
        {depoimentos.map((dep) => (
          <div key={dep.id} className="testimonial-card">
            <div className="stars-row">{renderEstrelas(dep.estrelas)}</div>
            <p className="testimonial-text">"{dep.texto}"</p>
            <div className="testimonial-author">
              {dep.foto_cliente && (
                <img src={dep.foto_cliente} alt={dep.nome_cliente} />
              )}
              <span>{dep.nome_cliente}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Depoimentos;
