import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

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
      toast.success("Bem-vindo, Styllo Vidros!");
      // Salvamos o token e o status
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("auth", "true");

      navigate("/dashboard");
    } catch (error) {
      toast.error("Usuário ou senha inválidos!");
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-header">
          <h2>
            STYLLO <span>VIDROS</span>
          </h2>
          <p>Painel Administrativo</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-input-group">
            <label>Usuário</label>
            <input
              type="text"
              placeholder="seu@email.com"
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              required
            />
          </div>

          <div className="login-input-group">
            <label>Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
            />
          </div>

          <div className="login-actions">
            <label className="remember-me">
              <input type="checkbox" /> Lembrar de mim
            </label>
            <a href="#" className="forgot-password">
              Esqueceu a senha?
            </a>
          </div>

          <button type="submit" className="btn-login">
            Entrar
          </button>
        </form>

        <a href="/" className="back-to-home">
          ← Voltar para o site
        </a>
      </div>
    </div>
  );
};

export default Login;
