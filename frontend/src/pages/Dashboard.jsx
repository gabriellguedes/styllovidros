import React from "react";
import DashDepoimentos from "../components/DashDepoimentos"; // Mova a lógica antiga de depoimentos para este componente
import DashServicos from "../components/DashServicos";
import DashVideos from "../components/DashVideos";
import DashLeads from "../components/DashLeads";

const Dashboard = () => {
  return (
    <div className="section-container">
      <header className="dash-header">
        <h1>Painel Administrativo</h1>
        <p>Gerencie seu portfólio, depoimentos e vídeos aqui.</p>
      </header>

      <div className="dash-grid">
        <DashServicos />
        <DashVideos />
        <DashDepoimentos />
        <DashLeads />
      </div>
    </div>
  );
};

export default Dashboard;
