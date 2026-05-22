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

  // Handlers para a edição na tabela
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
        `Tem a certeza que deseja remover o acesso de "${username}" definitivamente?`,
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

  // NOVA FUNÇÃO: Alterna rapidamente o status Ativo/Inativo na API (PATCH)
  const handleToggleStatus = async (user) => {
    const novoStatus = !user.is_active;
    const mensagem = novoStatus
      ? `Deseja ativar a conta de ${user.username}?`
      : `Deseja suspender/desativar a conta de ${user.username}?`;

    if (window.confirm(mensagem)) {
      const toastId = toast.loading("Atualizando status da conta...");
      try {
        // Envia apenas a mudança de status para o endpoint correspondente
        await api.patch(`usuarios/${user.id}/`, { is_active: novoStatus });
        toast.success(
          novoStatus ? "Conta ativada!" : "Conta desativada/suspensa!",
          { id: toastId },
        );
        fetchUsuarios();
      } catch (err) {
        console.error(err);
        toast.error("Erro ao alterar o status do usuário.", { id: toastId });
      }
    }
  };

  // Ativa o modo de edição na linha da tabela
  const iniciarEdicao = (user) => {
    setEditandoId(user.id);
    setDadosEditados({
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      is_staff: user.is_staff,
      is_active: user.is_active, // Mapeia o status atual para edição
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

      {/* --- LISTAGEM EM TABELA --- */}
      <div className="dash-table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Usuário</th>
              <th>E-mail</th>
              <th>Nível de Acesso</th>
              <th>Status</th> {/* NOVA COLUNA */}
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

                {/* NOVA COLUNA: STATUS DA CONTA */}
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
                        border: `1px solid ${user.is_active ? "rgba(37, 211, 102, 0.2)" : "rgba(255, 77, 77, 0.2)"}`,
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

                        {/* NOVO BOTÃO DE ALTERNÂNCIA DE STATUS RÁPIDO */}
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

      {usuarios.length === 0 && (
        <div className="table-empty-message">
          Nenhum usuário cadastrado no sistema.
        </div>
      )}
    </div>
  );
};

export default DashUser;
