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
  UserCheck,
  UserX,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const DashUser = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [novoUsuario, setNovoUsuario] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    is_staff: false,
    is_active: true,
  });
  const [loading, setLoading] = useState(false);

  // Estados para controle de edição inline
  const [editandoId, setEditandoId] = useState(null);
  const [dadosEditados, setDadosEditados] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    is_staff: false,
    is_active: true,
  });

  // FUNÇÃO AUXILIAR: Remove acentos, une primeiro e último nome com ponto e limpa espaços
  const gerarUsername = (firstName, lastName) => {
    const limpar = (texto) =>
      texto
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "");

    const pNome = limpar(firstName);
    const uNome = limpar(lastName);

    if (pNome && uNome) return `${pNome}.${uNome}`;
    return pNome || uNome || "";
  };

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

  // Handlers para o formulário de cadastro
  const handleFirstNameChange = (e) => {
    const valor = e.target.value;
    setNovoUsuario((prev) => ({
      ...prev,
      first_name: valor,
      username: gerarUsername(valor, prev.last_name),
    }));
  };

  const handleLastNameChange = (e) => {
    const valor = e.target.value;
    setNovoUsuario((prev) => ({
      ...prev,
      last_name: valor,
      username: gerarUsername(prev.first_name, valor),
    }));
  };

  // Handlers para a edição inline
  const handleEditFirstNameChange = (e) => {
    const valor = e.target.value;
    setDadosEditados((prev) => ({
      ...prev,
      first_name: valor,
      username: gerarUsername(valor, prev.last_name),
    }));
  };

  const handleEditLastNameChange = (e) => {
    const valor = e.target.value;
    setDadosEditados((prev) => ({
      ...prev,
      last_name: valor,
      username: gerarUsername(prev.first_name, valor),
    }));
  };

  // ROTA DE CRIAÇÃO (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Cadastrando novo usuário...");

    try {
      await api.post("usuarios/", novoUsuario);
      toast.success("Usuário cadastrado com sucesso!", { id: toastId });
      setNovoUsuario({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        is_staff: false,
        is_active: true,
      });
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar usuário. Verifique os dados.", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  // ROTA DE EXCLUSÃO (DELETE)
  const handleDeleteUsuario = async (id, username) => {
    if (
      window.confirm(
        `Tem a certeza que deseja remover o acesso de "${username}" definitivamente?`
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

  // Alterna rapidamente o status Ativo/Inativo na API (PATCH)
  const handleToggleStatus = async (user) => {
    const novoStatus = !user.is_active;
    const mensagem = novoStatus
      ? `Deseja ativar a conta de ${user.username}?`
      : `Deseja suspender/desativar a conta de ${user.username}?`;

    if (window.confirm(mensagem)) {
      const toastId = toast.loading("Atualizando status da conta...");
      try {
        await api.patch(`usuarios/${user.id}/`, { is_active: novoStatus });
        toast.success(
          novoStatus ? "Conta ativada!" : "Conta desativada/suspensa!",
          { id: toastId }
        );
        fetchUsuarios();
      } catch (err) {
        console.error(err);
        toast.error("Erro ao alterar o status do usuário.", { id: toastId });
      }
    }
  };

  // Ativa o modo de edição na linha da tabela ou card
  const iniciarEdicao = (user) => {
    setEditandoId(user.id);
    setDadosEditados({
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      is_staff: user.is_staff,
      is_active: user.is_active,
    });
  };

  // ROTA DE EDIÇÃO/ATUALIZAÇÃO (PATCH)
  const handleSalvarEdicao = async (id) => {
    const toastId = toast.loading("Atualizando dados...");
    try {
      await api.patch(`usuarios/${id}/`, dadosEditados);
      toast.success("Usuário atualizado com sucesso!", { id: toastId });
      setEditandoId(null);
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
          Adicione, modifique ou bloqueie contas com permissão de acesso à
          Styllo Vidros.
        </p>
      </div>

      {/* --- FORMULÁRIO DE CADASTRO --- */}
      <h3 className="dash-section-title">
        <UserPlus size={20} /> Cadastrar Novo Usuário
      </h3>
      <form onSubmit={handleSubmit} className="dash-form">
        <div className="dash-form-container">
          <div className="dash-form-column">
            <input
              type="text"
              placeholder="Primeiro Nome"
              value={novoUsuario.first_name}
              onChange={handleFirstNameChange}
              required
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Último Sobrenome"
              value={novoUsuario.last_name}
              onChange={handleLastNameChange}
              required
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Username"
              value={novoUsuario.username}
              readOnly
              required
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
              <option value="true">Administrador</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-add">
            {loading ? "Processando..." : "Salvar Usuário"}
          </button>
        </div>
      </form>

      {/* --- VISUALIZAÇÃO DESKTOP: TABELA --- */}
      <div className="dash-table-container desktop-only-view">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Usuário</th>
              <th>E-mail</th>
              <th>Nível de Acesso</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id} style={{ opacity: user.is_active ? 1 : 0.65 }}>
                {/* Coluna do Nome */}
                <td className="table-cell-name">
                  <User size={16} className="icon-user-accent" />
                  {editandoId === user.id ? (
                    <div style={{ display: "flex", gap: "5px" }}>
                      <input
                        type="text"
                        className="edit-inline-input"
                        value={dadosEditados.first_name}
                        onChange={handleEditFirstNameChange}
                      />
                      <input
                        type="text"
                        className="edit-inline-input"
                        value={dadosEditados.last_name}
                        onChange={handleEditLastNameChange}
                      />
                    </div>
                  ) : (
                    <>
                      <strong>{user.first_name} </strong>
                      <strong>{user.last_name}</strong>
                    </>
                  )}
                </td>

                {/* Coluna do Usuário */}
                <td className="table-cell-user">
                  {editandoId === user.id ? (
                    <input
                      type="text"
                      className="edit-inline-input"
                      value={dadosEditados.username}
                      readOnly
                      style={{ opacity: 0.6, cursor: "not-allowed" }}
                    />
                  ) : (
                    user.username
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

                {/* Coluna de Status da Conta */}
                <td>
                  {editandoId === user.id ? (
                    <select
                      className="edit-inline-input"
                      value={dadosEditados.is_active}
                      onChange={(e) =>
                        setDadosEditados({
                          ...dadosEditados,
                          is_active: e.target.value === "true",
                        })
                      }
                    >
                      <option value="true">Ativo</option>
                      <option value="false">Inativo / Bloqueado</option>
                    </select>
                  ) : (
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        background: user.is_active
                          ? "rgba(37, 211, 102, 0.1)"
                          : "rgba(255, 77, 77, 0.1)",
                        color: user.is_active ? "#25d366" : "#ff4d4d",
                        border: `1px solid ${
                          user.is_active
                            ? "rgba(37, 211, 102, 0.2)"
                            : "rgba(255, 77, 77, 0.2)"
                        }`,
                      }}
                    >
                      {user.is_active ? "Ativo" : "Inativo"}
                    </span>
                  )}
                </td>

                {/* Coluna de Ações */}
                <td>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    {editandoId === user.id ? (
                      <>
                        <button
                          onClick={() => handleSalvarEdicao(user.id)}
                          title="Salvar Alterações"
                          style={{
                            color: "#25d366",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => setEditandoId(null)}
                          title="Cancelar Edição"
                          style={{
                            color: "#ff4d4d",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => iniciarEdicao(user)}
                          title="Editar Usuário"
                          style={{
                            color: "#ffb74d",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user)}
                          title={
                            user.is_active ? "Desativar Conta" : "Ativar Conta"
                          }
                          style={{
                            color: user.is_active ? "#ff4d4d" : "#25d366",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {user.is_active ? (
                            <UserX size={16} />
                          ) : (
                            <UserCheck size={16} />
                          )}
                        </button>
                      </>
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

      {/* --- VISUALIZAÇÃO MOBILE: CARDS (Estilo Portfólio) --- */}
      <div className="dash-cards-container-mobile mobile-only-view">
        {usuarios.map((user) => (
          <div
            key={user.id}
            className={`dash-mobile-card ${!user.is_active ? "is-read" : ""}`}
          >
            {/* Topo do Card: Ações + ID */}
            <div className="dash-card-header">
              <span className="dash-card-id">ID: #{user.id}</span>
              <div className="dash-card-actions">
                {editandoId === user.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSalvarEdicao(user.id)}
                      className="btn-card-action btn-publish"
                      title="Salvar"
                    >
                      <Check size={16} /> Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditandoId(null)}
                      className="btn-card-action btn-delete"
                      title="Cancelar"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => iniciarEdicao(user)}
                      className="btn-card-action"
                      style={{ color: "#ffb74d", borderColor: "rgba(255,183,77,0.3)" }}
                      title="Editar"
                    >
                      <Edit2 size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(user)}
                      className={`btn-card-action ${user.is_active ? "btn-hide" : "btn-publish"}`}
                      title={user.is_active ? "Desativar" : "Ativar"}
                    >
                      {user.is_active ? <UserX size={15} /> : <UserCheck size={15} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteUsuario(user.id, user.username)}
                      className="btn-card-action btn-delete"
                      title="Remover"
                    >
                      <Trash2 size={15} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Corpo do Card: Informações */}
            <div className="dash-card-body">
              {editandoId === user.id ? (
                /* Formulário de Edição Inline no Mobile */
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <input
                      type="text"
                      className="edit-inline-input"
                      value={dadosEditados.first_name}
                      onChange={handleEditFirstNameChange}
                      placeholder="Nome"
                      style={{ width: "100%" }}
                    />
                    <input
                      type="text"
                      className="edit-inline-input"
                      value={dadosEditados.last_name}
                      onChange={handleEditLastNameChange}
                      placeholder="Sobrenome"
                      style={{ width: "100%" }}
                    />
                  </div>

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
                    placeholder="E-mail"
                  />

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

                  <select
                    className="edit-inline-input"
                    value={dadosEditados.is_active}
                    onChange={(e) =>
                      setDadosEditados({
                        ...dadosEditados,
                        is_active: e.target.value === "true",
                      })
                    }
                  >
                    <option value="true">Ativo</option>
                    <option value="false">Inativo / Bloqueado</option>
                  </select>
                </div>
              ) : (
                /* Exibição Normal dos Dados */
                <>
                  <div className="dash-card-title-row">
                    <h3>
                      {user.first_name} {user.last_name}
                    </h3>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "0.7rem",
                        fontWeight: "600",
                        background: user.is_active
                          ? "rgba(37, 211, 102, 0.15)"
                          : "rgba(255, 77, 77, 0.15)",
                        color: user.is_active ? "#25d366" : "#ff4d4d",
                        border: `1px solid ${
                          user.is_active
                            ? "rgba(37, 211, 102, 0.3)"
                            : "rgba(255, 77, 77, 0.3)"
                        }`,
                      }}
                    >
                      {user.is_active ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.5)",
                      margin: "2px 0",
                    }}
                  >
                    @{user.username}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    <Mail size={14} />
                    <span>{user.email}</span>
                  </div>

                  <div style={{ marginTop: "4px" }}>
                    <span className="user-badge-staff">
                      <Shield size={12} />{" "}
                      {user.is_staff
                        ? "Administrador Master"
                        : "Staff / Editor"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
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