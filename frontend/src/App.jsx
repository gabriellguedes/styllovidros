import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
// Importação dos Componentes/Páginas
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import EnviarDepoimento from "./pages/EnviarDepoimento";
import Dashboard from "./pages/Dashboard";
import ContatoForm from "./components/ContatoForm";
import HeaderHome from "./components/HeaderHome";
import FooterHome from "./components/FooterHome";
import "./style.css";

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
        <HeaderHome />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/avaliar" element={<EnviarDepoimento />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Contato" element={<ContatoForm />} />

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
        <FooterHome />
      </div>
    </Router>
  );
}

export default App;
