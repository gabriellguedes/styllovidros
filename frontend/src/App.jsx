import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importação dos Componentes/Páginas
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
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
          <Route path="/" element={<Home />} />
          <Route path="/avaliar" element={<EnviarDepoimento />} />
          <Route path="/login" element={<Login />} />

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

        <footer style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          © 2026 Styllo Vidros - Todos os direitos reservados.
        </footer>
      </div>
    </Router>
  );
}

export default App;
