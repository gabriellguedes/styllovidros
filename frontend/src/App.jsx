import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
// Importação dos Componentes/Páginas
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import NewHome from "./pages/New_Home";
import EnviarDepoimento from "./pages/EnviarDepoimento";
import Dashboard from "./pages/Dashboard";
import ContatoForm from "./components/ContatoForm";
import Portfolio from "./pages/Portfolio";
import Contato from "./pages/Contato";
import "./style.css";
import "./responsive.css";

function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "10px",
          },
          success: {
            duration: 3000,
            theme: { primary: "#4B0082" },
          },
        }}
      />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fale-conosco" element={<Contato />} />
          <Route path="/avaliar" element={<EnviarDepoimento />} />
          <Route path="/login" element={<Login />} />
          <Route path="/portfolio" element={<Portfolio />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {" "}
                <Dashboard />{" "}
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
