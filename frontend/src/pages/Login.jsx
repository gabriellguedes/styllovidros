import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";
import {Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Obtém a baseURL configurada na instância da API
  const apiBaseUrl = api.defaults.baseURL || "http://localhost:8000";
  // Remove '/api/' ou barras no final, se existirem, para apontar para a raiz do servidor
  const serverBaseUrl = apiBaseUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
  const resetPasswordUrl = `${serverBaseUrl}/reset_password/`;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("login/", credentials);

      toast.success(
        `Bem-vindo, ${response.data.first_name || "Usuário"} ${response.data.last_name || " Lindo(a)"}!`,
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("auth", "true");
      const dadosDoUsuario = {
        username: credentials.username,
        first_name: response.data.first_name || "",
        last_name: response.data.last_name || "",
      };
      localStorage.setItem("auth_user", JSON.stringify(dadosDoUsuario));
      const statusAdmin =
        response.data.is_staff !== undefined ? response.data.is_staff : false;
      localStorage.setItem("is_admin", String(statusAdmin));

      navigate("/dashboard");
    } catch (error) {
      toast.error("Usuário ou senha inválidos!");
    }
  };

  return (
    <>
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
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                required
              />
            </div>

            <div className="login-input-group password-wrapper">
              <label>Senha</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  required
                  style={{ width: "100%", paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    color: "#666"
                  }}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="login-actions">
              <label className="remember-me">
                <input type="checkbox" /> Lembrar de mim
              </label>
              <a
                href={resetPasswordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="forgot-password"
              >
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
    </>
  );
};

export default Login;