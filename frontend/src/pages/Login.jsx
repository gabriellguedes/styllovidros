import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const Login = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Defina uma senha simples para o seu amigo (ou integre com o Django depois)
    if (password === "styllo123") {
      localStorage.setItem("auth", "true");
      navigate("/dashboard");
    } else {
      alert("Senha incorreta!");
    }
  };

  return (
    <div
      className="section-container"
      style={{ maxWidth: "400px", marginTop: "100px" }}
    >
      <div
        className="contact-card"
        style={{ display: "block", padding: "40px" }}
      >
        <h2 style={{ textAlign: "center" }}>
          <Lock /> Acesso Restrito
        </h2>
        <form onSubmit={handleLogin} className="contact-form">
          <input
            type="password"
            placeholder="Digite a senha mestre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn-submit">
            Entrar no Painel
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
