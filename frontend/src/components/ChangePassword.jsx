import React, { useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import {Eye, EyeOff } from "lucide-react";

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwords.new_password !== passwords.confirm_password) {
      toast.error("A nova senha e a confirmação não coincidem!");
      return;
    }

    if (passwords.new_password.length < 6) {
      toast.error("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      // Como o usuário está logado, o token de autenticação deve ir no header via interceptor do Axios no api.js
      await api.post("change-password/", {
        old_password: passwords.old_password,
        new_password: passwords.new_password,
      });

      toast.success("Senha alterada com sucesso!");
      setPasswords({ old_password: "", new_password: "", confirm_password: "" });
    } catch (error) {
      const msg = error.response?.data?.error || "Erro ao alterar a senha.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);    

  return (
    <div className="change-password-container" style={{ maxWidth: "400px", margin: "2rem auto", padding: "1.5rem" }}>
      <h2>Alterar Senha</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Senha Atual</label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <input
            type={showPassword ? "text" : "password"}
            name="old_password"
            value={passwords.old_password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
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

        <div style={{ marginBottom: "1rem" }}>
          <label>Nova Senha</label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              type={showNewPassword ? "text" : "password"}
              name="new_password"
              value={passwords.new_password}
              onChange={handleChange}
              required
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
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
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
            </div>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Confirmar Nova Senha</label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirm_password"
              value={passwords.confirm_password}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            />
            <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "10px",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "0.9rem",
                              color: "#666"
                            }}
                            tabIndex="-1"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-add"
        >
          {loading ? "Salvando..." : "Atualizar Senha"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;