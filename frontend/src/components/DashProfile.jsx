import React, { useState, useEffect } from "react";
import api from "../api";
import { User, Mail, ShieldCheck, Edit3, Lock, Check, X } from "lucide-react";
import toast from "react-hot-toast";

const DashProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Controle de exibição dos formulários
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Formulários
  const [editFormData, setEditFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const [passwordFormData, setPasswordFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Busca os dados atualizados do usuário diretamente no banco de dados
  const fetchProfileData = async () => {
    setLoading(true);
    const storedAuth = localStorage.getItem("auth_user");

    let usernameTarget = "";
    let localData = null;

    if (storedAuth) {
      try {
        localData = JSON.parse(storedAuth);
        usernameTarget = localData.username || "";
      } catch (e) {
        usernameTarget = storedAuth;
      }
    }

    try {
      // 1. Tenta buscar a lista completa de usuários na API
      const res = await api.get("usuarios/");
      const usuarios = res.data || [];

      // Encontra o usuário logado correspondente pelo username ou ID
      let usuarioEncontrado = usuarios.find(
        (u) =>
          (usernameTarget && u.username === usernameTarget) ||
          (localData && localData.id && u.id === localData.id)
      );

      // Se não achar um exato, pega o primeiro da lista como fallback
      if (!usuarioEncontrado && usuarios.length > 0) {
        usuarioEncontrado = usuarios[0];
      }

      if (usuarioEncontrado) {
        setProfileData(usuarioEncontrado);
        setEditFormData({
          first_name: usuarioEncontrado.first_name || "",
          last_name: usuarioEncontrado.last_name || "",
          email: usuarioEncontrado.email || "",
        });

        // Atualiza o localStorage com o objeto completo e o ID correto
        localStorage.setItem("auth_user", JSON.stringify(usuarioEncontrado));
        if (usuarioEncontrado.is_staff !== undefined) {
          localStorage.setItem("is_admin", String(usuarioEncontrado.is_staff));
        }
      } else if (localData) {
        setProfileData(localData);
      }
    } catch (err) {
      console.error("Erro ao sincronizar dados com o servidor:", err);
      if (localData) {
        setProfileData(localData);
      } else {
        toast.error("Não foi possível carregar as informações do usuário.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Salvar Alteração de Dados Pessoais
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!profileData || !profileData.id) {
      toast.error("ID do usuário não foi identificado. Recarregue a página.");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Atualizando perfil...");

    try {
      const res = await api.patch(`usuarios/${profileData.id}/`, editFormData);

      // Sincroniza o objeto atualizado
      const usuarioAtualizado = {
        ...profileData,
        first_name: editFormData.first_name,
        last_name: editFormData.last_name,
        email: editFormData.email,
        ...(res.data || {}),
      };

      localStorage.setItem("auth_user", JSON.stringify(usuarioAtualizado));
      setProfileData(usuarioAtualizado);

      toast.success("Dados atualizados com sucesso!", { id: toastId });
      setShowEditProfile(false);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.detail || "Erro ao atualizar dados no servidor.",
        { id: toastId }
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Salvar Alteração de Senha
  const handleSavePassword = async (e) => {
    e.preventDefault();

    if (passwordFormData.new_password !== passwordFormData.confirm_password) {
      toast.error("A nova senha e a confirmação não coincidem.");
      return;
    }

    if (passwordFormData.new_password.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Alterando senha...");

    try {
      await api.post("change-password/", {
        old_password: passwordFormData.current_password,
        new_password: passwordFormData.new_password,
      });

      toast.success("Senha alterada com sucesso!", { id: toastId });
      setShowChangePassword(false);
      setPasswordFormData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.detail || "Erro ao alterar senha. Verifique a senha atual.",
        { id: toastId }
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ color: "#fff", padding: "20px" }}>
        Carregando informações do perfil...
      </div>
    );
  }

  return (
    <div className="dash-section">
      <div className="dash-section-header" style={{ marginBottom: "25px" }}>
        <h2>Meu Perfil</h2>
        <p>Visualize e gerencie suas informações de acesso no painel.</p>
      </div>

      {/* --- EXIBIÇÃO EM TEXTO DOS DADOS DO USUÁRIO LOGADO --- */}
      {profileData ? (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            padding: "24px",
            maxWidth: "600px",
            marginBottom: "25px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <User size={18} style={{ color: "var(--accent-purple, #8a2be2)" }} />
              <div>
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", display: "block" }}>
                  Nome Completo
                </span>
                <strong style={{ fontSize: "1.05rem", color: "#fff" }}>
                  {profileData.first_name || profileData.last_name
                    ? `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim()
                    : "Não informado"}
                </strong>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <User size={18} style={{ color: "rgba(255,255,255,0.4)" }} />
              <div>
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", display: "block" }}>
                  Nome de Usuário (Username)
                </span>
                <span style={{ color: "rgba(255,255,255,0.85)" }}>
                  @{profileData.username || "usuario"}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Mail size={18} style={{ color: "rgba(255,255,255,0.4)" }} />
              <div>
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", display: "block" }}>
                  E-mail
                </span>
                <span style={{ color: "rgba(255,255,255,0.85)" }}>
                  {profileData.email || "Não informado"}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <ShieldCheck size={18} style={{ color: "#25d366" }} />
              <div>
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", display: "block" }}>
                  Nível de Acesso
                </span>
                <span className="user-badge-staff">
                  {profileData.is_staff || profileData.is_superuser
                    ? "Administrador Master"
                    : "Staff / Editor"}
                </span>
              </div>
            </div>
          </div>

          {/* BARRA DE BOTÕES DE AÇÃO */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "25px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setShowEditProfile(!showEditProfile);
                setShowChangePassword(false);
              }}
              className="btn-add"
            >
              <Edit3 size={16} />
              <span style={{paddingLeft:"10px",}}>{showEditProfile ? "Cancelar Edição" : "Alterar Dados"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowChangePassword(!showChangePassword);
                setShowEditProfile(false);
              }}
              className="btn-add"
              style={{
                background: "#ffb74d",
              }}
            >
              <Lock size={16} />
              <span style={{paddingLeft:"10px",}}>{showChangePassword ? "Cancelar" : "Alterar Senha"}</span>
            </button>
          </div>
        </div>
      ) : (
        <div style={{ color: "rgba(255,255,255,0.5)" }}>
          Usuário não autenticado.
        </div>
      )}

      {/* --- FORMULÁRIO 1: ALTERAR DADOS --- */}
      {showEditProfile && (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(138, 43, 226, 0.3)",
            borderRadius: "12px",
            padding: "20px",
            maxWidth: "600px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ color: "#fff", marginBottom: "15px", fontSize: "1rem" }}>
            Editar Informações Pessoais
          </h3>
          <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                placeholder="Primeiro Nome"
                className="edit-inline-input"
                value={editFormData.first_name}
                onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })}
                required
                style={{ width: "100%", padding: "10px" }}
              />
              <input
                type="text"
                placeholder="Sobrenome"
                className="edit-inline-input"
                value={editFormData.last_name}
                onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })}
                required
                style={{ width: "100%", padding: "10px" }}
              />
            </div>

            <input
              type="email"
              placeholder="E-mail"
              className="edit-inline-input"
              value={editFormData.email}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              required
              style={{ padding: "10px" }}
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                type="submit"
                disabled={submitting}
                className="btn-card-action btn-publish"
                style={{ padding: "8px 16px", background: "rgba(255, 183, 77, 0.15)", color: "#ffb74d", borderColor: "rgba(255,183,77,0.4)" }}
              >
                <Check size={16} /> 
                <span style={{paddingLeft:"5px"}}>{submitting ? "Salvando..." : "Salvar Dados"}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowEditProfile(false)}
                className="btn-add"
                style={{ padding: "8px 16px", background: "rgba(255, 77, 77, 0.15)", color: "#ff4d4d", borderColor: "rgba(255, 77, 77, 0.2)" }}
              >
                <X size={16} /> 
                <span style={{paddingLeft:"5px"}}>Cancelar</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- FORMULÁRIO 2: ALTERAR SENHA --- */}
      {showChangePassword && (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 183, 77, 0.3)",
            borderRadius: "12px",
            padding: "20px",
            maxWidth: "600px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ color: "#fff", marginBottom: "15px", fontSize: "1rem" }}>
            Alterar Senha de Acesso
          </h3>
          <form onSubmit={handleSavePassword} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="password"
              placeholder="Senha Atual"
              className="edit-inline-input"
              value={passwordFormData.current_password}
              onChange={(e) =>
                setPasswordFormData({ ...passwordFormData, current_password: e.target.value })
              }
              required
              style={{ padding: "10px" }}
            />

            <input
              type="password"
              placeholder="Nova Senha (Mínimo 6 caracteres)"
              className="edit-inline-input"
              value={passwordFormData.new_password}
              onChange={(e) =>
                setPasswordFormData({ ...passwordFormData, new_password: e.target.value })
              }
              required
              style={{ padding: "10px" }}
            />

            <input
              type="password"
              placeholder="Confirmar Nova Senha"
              className="edit-inline-input"
              value={passwordFormData.confirm_password}
              onChange={(e) =>
                setPasswordFormData({ ...passwordFormData, confirm_password: e.target.value })
              }
              required
              style={{ padding: "10px" }}
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                type="submit"
                disabled={submitting}
                className="btn-add"
                style={{ padding: "8px 16px", background: "rgba(255, 183, 77, 0.15)", color: "#ffb74d", borderColor: "rgba(255,183,77,0.4)" }}
              >
                <Check size={16} />
                <span style={{paddingLeft:"5px"}}>{submitting ? "Alterando..." : "Confirmar Nova Senha"}</span> 
              </button>
              <button
                type="button"
                onClick={() => setShowChangePassword(false)}
                className="btn-add"
                style={{ padding: "8px 16px", background: "rgba(255, 77, 77, 0.15)", color: "#ff4d4d", borderColor: "rgba(255, 77, 77, 0.2)" }}
              >
                <X size={16} /> 
                <span style={{paddingLeft:"5px"}}>Cancelar</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DashProfile;