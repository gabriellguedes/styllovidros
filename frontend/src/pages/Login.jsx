import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Chamada para o endpoint do Django
      const response = await api.post("login/", credentials);

      // Salvamos o token e o status
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("auth", "true");

      navigate("/dashboard");
    } catch (error) {
      alert("Usuário ou senha inválidos!");
      console.error(error);
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
        <h2 style={{ textAlign: "center" }}>Login Administrativo</h2>
        <form onSubmit={handleLogin} className="contact-form">
          <input
            type="text"
            placeholder="Usuário"
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Senha"
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            required
          />
          <button type="submit" className="btn-submit">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
