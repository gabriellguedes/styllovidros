import React from "react";
import Servicos from "../components/Servicos";
import VideoGallery from "../components/VideoGallery";
import ContatoForm from "../components/ContatoForm";
import Depoimentos from "../components/Depoimentos";

const Home = () => {
  return (
    <>
      <header
        style={{
          background: "linear-gradient(135deg, #4B0082, #8A2BE2)",
          color: "white",
          padding: "80px 20px",
          textAlign: "center",
        }}
      >
        <h2>Excelência em Vidraçaria e Design</h2>
      </header>

      <main>
        <Servicos />
        <VideoGallery />
        <ContatoForm />
        {/* Aqui passamos o parâmetro 'approved' para mostrar só os aceitos */}
        <Depoimentos type="approved" />
      </main>
    </>
  );
};

export default Home;
