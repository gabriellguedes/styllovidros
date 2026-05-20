import React, { useEffect, useState } from "react";
import api from "../api";
import { Camera } from "lucide-react";

const Servicos = () => {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("servicos/")
      .then((response) => {
        setServicos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar serviços:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center">Carregando portfólio...</p>;

  return (
    <section className="section-services">
      <div>
        {servicos.map((item) => (
          <div className="material-card" key={item.id}>
            <img
              src={item.imagem} // URL vinda do Django
              alt={item.titulo}
            />
            <div>
              <h4 title={item.categoria}>{item.titulo}</h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Servicos;
