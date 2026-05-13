import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importação dos Componentes/Páginas
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import EnviarDepoimento from "./pages/EnviarDepoimento";
import Dashboard from "./pages/Dashboard";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* Rota Principal (Landing Page) */}
          <Route path="/" element={<Home />} />

          {/* Rota para o Cliente avaliar */}
          <Route path="/avaliar" element={<EnviarDepoimento />} />

          {/* Rota do Administrador (Amigo Vidraceiro) */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>

        <footer style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          © 2026 Styllo Vidros - Todos os direitos reservados.
        </footer>
      </div>
    </Router>
  );
}

export default App;
