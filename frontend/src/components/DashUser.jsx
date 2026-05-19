import React, { useEffect, useState } from "react";
import api from "../api";
import {
  UserPlus,
  Trash2,
  Shield,
  User,
  Mail,
  Edit2,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

const DashUser = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [novoUsuario, setNovoUsuario] = useState({
    username: "",
    email: "",
    password: "",
    is_staff: false,
  });
  const [loading, setLoading] = useState(false);

  // Estados para controle de edição inline
  const [editandoId, setEditandoId] = useState(null);
  const [dadosEditados, setDadosEditados] = useState({
    username: "",
    email: "",
    is_staff: false,
  });

  const fetchUsuarios = async () => {
    try {
      const res = await api.get("usuarios/");
      setUsuarios(res.data);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
      toast.error("Não foi possível carregar a lista de usuários.");
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // 1. ROTA DE CRIAÇÃO (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Cadastrando novo usuário...");

    try {
      await api.post("usuarios/", novoUsuario);
      toast.success("Usuário cadastrado com sucesso!", { id: toastId });
      setNovoUsuario({
        username: "",
        email: "",
        password: "",
        is_staff: false,
      });
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      toast.error(
        "Erro ao cadastrar usuário. Verifique se o username já existe.",
        { id: toastId },
      );
    } finally {
      setLoading(false);
    }
  };

  // 2. ROTA DE EXCLUSÃO (DELETE)
  const handleDeleteUsuario = async (id, username) => {
    if (
      window.confirm(
        `Tem a certeza que deseja remover o acesso de "${username}"?`,
      )
    ) {
      try {
        await api.delete(`usuarios/${id}/`);
        toast.success("Usuário removido do sistema.");
        fetchUsuarios();
      } catch (err) {
        toast.error("Erro ao remover o usuário.");
      }
    }
  };

  // Ativa o modo de edição na linha da tabela
  const iniciarEdicao = (user) => {
    setEditandoId(user.id);
    setDadosEditados({
      username: user.username,
      email: user.email,
      is_staff: user.is_staff,
    });
  };

  // 3. ROTA DE EDIÇÃO/ATUALIZAÇÃO (PUT ou PATCH)
  const handleSalvarEdicao = async (id) => {
    const toastId = toast.loading("Atualizando dados...");
    try {
      // Faz o envio das alterações parciais para o backend
      await api.patch(`usuarios/${id}/`, dadosEditados);
      toast.success("Usuário atualizado com sucesso!", { id: toastId });
      setEditandoId(null); // Desativa o modo de edição
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar dados do usuário.", { id: toastId });
    }
  };

  return (
    <div className="dash-section">
      <div className="dash-section-header">
        <h2>Gerenciar Usuários Administrativos</h2>
        <p>
          Adicione, modifique ou remova contas com permissão de acesso à Styllo
          Vidros.
        </p>
      </div>

      {/* --- FORMULÁRIO DE CADASTRO --- */}
      <h3 className="dash-section-title">
        <UserPlus size={20} /> Cadastrar Novo Administrador
      </h3>
      <form onSubmit={handleSubmit} className="dash-form">
        <input
          type="text"
          placeholder="Nome de Usuário"
          value={novoUsuario.username}
          onChange={(e) =>
            setNovoUsuario({ ...novoUsuario, username: e.target.value })
          }
          required
          disabled={loading}
        />
        <input
          type="email"
          placeholder="E-mail"
          value={novoUsuario.email}
          onChange={(e) =>
            setNovoUsuario({ ...novoUsuario, email: e.target.value })
          }
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Senha"
          value={novoUsuario.password}
          onChange={(e) =>
            setNovoUsuario({ ...novoUsuario, password: e.target.value })
          }
          required
          disabled={loading}
        />
        <select
          value={novoUsuario.is_staff}
          onChange={(e) =>
            setNovoUsuario({
              ...novoUsuario,
              is_staff: e.target.value === "true",
            })
          }
          disabled={loading}
        >
          <option value="false">Staff / Editor</option>
          <option value="true">Administrador Master</option>
        </select>
        <button type="submit" disabled={loading} className="btn-add">
          {loading ? "Processando..." : "Salvar Usuário"}
        </button>
      </form>

      {/* --- LISTAGEM EM TABELA COM EDIÇÃO INLINE --- */}
      <div className="dash-table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>E-mail</th>
              <th>Nível de Acesso</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id}>
                {/* Coluna do Nome */}
                <td className="table-cell-user">
                  <User size={16} className="icon-user-accent" />
                  {editandoId === user.id ? (
                    <input
                      type="text"
                      className="edit-inline-input"
                      value={dadosEditados.username}
                      onChange={(e) =>
                        setDadosEditados({
                          ...dadosEditados,
                          username: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <strong>{user.username}</strong>
                  )}
                </td>

                {/* Coluna do E-mail */}
                <td>
                  <span className="table-cell-email">
                    <Mail size={14} />
                    {editandoId === user.id ? (
                      <input
                        type="email"
                        className="edit-inline-input"
                        value={dadosEditados.email}
                        onChange={(e) =>
                          setDadosEditados({
                            ...dadosEditados,
                            email: e.target.value,
                          })
                        }
                      />
                    ) : (
                      user.email
                    )}
                  </span>
                </td>

                {/* Coluna do Nível de Acesso */}
                <td>
                  {editandoId === user.id ? (
                    <select
                      className="edit-inline-input"
                      value={dadosEditados.is_staff}
                      onChange={(e) =>
                        setDadosEditados({
                          ...dadosEditados,
                          is_staff: e.target.value === "true",
                        })
                      }
                    >
                      <option value="false">Staff / Editor</option>
                      <option value="true">Administrador Master</option>
                    </select>
                  ) : (
                    <span className="user-badge-staff">
                      <Shield size={12} />{" "}
                      {user.is_staff
                        ? "Administrador Master"
                        : "Staff / Editor"}
                    </span>
                  )}
                </td>

                {/* Coluna de Ações Compartilhadas */}
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {editandoId === user.id ? (
                      <button
                        onClick={() => handleSalvarEdicao(user.id)}
                        title="Salvar Alterações"
                        className="btn-action-save-user"
                        style={{
                          color: "#25d366",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <Check size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => iniciarEdicao(user)}
                        title="Editar Usuário"
                        className="btn-action-edit-user"
                        style={{
                          color: "#ffb74d",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handleDeleteUsuario(user.id, user.username)
                      }
                      title="Remover Acesso"
                      className="btn-action-delete-user"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {usuarios.length === 0 && (
        <div className="table-empty-message">
          Nenhum usuário cadastrado no sistema.
        </div>
      )}
    </div>
  );
};

export default DashUser;
