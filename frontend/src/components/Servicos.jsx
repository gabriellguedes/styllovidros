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
    <section
      style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}
    >
      <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Camera color="#8A2BE2" /> Nossos Trabalhos
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {servicos.map((item) => (
          <div
            key={item.id}
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              background: "#fff",
            }}
          >
            <img
              src={item.imagem} // URL vinda do Django
              alt={item.titulo}
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
            <div style={{ padding: "15px" }}>
              <span
                style={{
                  fontSize: "12px",
                  color: "#8A2BE2",
                  fontWeight: "bold",
                }}
              >
                {item.categoria}
              </span>
              <h3 style={{ margin: "5px 0" }}>{item.titulo}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Servicos;
