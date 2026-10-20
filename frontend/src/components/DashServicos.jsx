import React, { useEffect, useState } from "react";
import api from "../api";
import { Plus, Trash2, Edit3, X, FolderPlus, Tag } from "lucide-react";
import toast from "react-hot-toast";

const DashServicos = () => {
  const [servicos, setServicos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Estado do formulário
  const [formDataServico, setFormDataServico] = useState({
    titulo: "",
    categoria: "",
    imagem: null,
  });

  const [editandoId, setEditandoId] = useState(null);
  const [mostrarCriarCategoria, setMostrarCriarCategoria] = useState(false);
  const [novaCategoriaTexto, setNovaCategoriaTexto] = useState("");
  const [loading, setLoading] = useState(false);

  // Filtro de formatação: primeira letra de cada palavra maiúscula
  const formatarCaseSensitive = (texto) => {
    if (!texto) return "";
    return texto
      .trim()
      .toLowerCase()
      .split(" ")
      .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(" ");
  };

  const fetchCategorias = async () => {
    try {
      const res = await api.get("categorias/");
      setCategorias(res.data);
      if (res.data.length > 0 && !formDataServico.categoria) {
        setFormDataServico((prev) => ({ ...prev, categoria: res.data[0].id }));
      }
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
      toast.error("Não foi possível carregar as categorias.");
    }
  };

  const fetchServicos = async () => {
    try {
      const res = await api.get("servicos/");
      setServicos(res.data);
    } catch (err) {
      console.error("Erro ao carregar serviços:", err);
    }
  };

  useEffect(() => {
    fetchCategorias();
    fetchServicos();
  }, []);

  const handleFileChange = (e) => {
    setFormDataServico({ ...formDataServico, imagem: e.target.files[0] });
  };

  const handleCategoriaChange = (e) => {
    const valor = e.target.value;
    if (valor === "ADICIONAR_NOVA") {
      setMostrarCriarCategoria(true);
    } else {
      setMostrarCriarCategoria(false);
      setFormDataServico({ ...formDataServico, categoria: Number(valor) });
    }
  };

  const handleAdicionarCategoriaAPI = async (e) => {
    e.preventDefault();
    if (!novaCategoriaTexto.trim()) return;

    const nomeFormatado = formatarCaseSensitive(novaCategoriaTexto);

    const jaExiste = categorias.some(
      (c) => c.nome.toLowerCase() === nomeFormatado.toLowerCase()
    );
    if (jaExiste) {
      toast.error("Esta categoria já existe no sistema!");
      return;
    }

    const toastId = toast.loading("Salvando nova categoria...");
    try {
      const res = await api.post("categorias/", { nome: nomeFormatado });
      toast.success(`Categoria "${nomeFormatado}" salva!`, { id: toastId });
      setNovaCategoriaTexto("");
      setMostrarCriarCategoria(false);

      setCategorias([...categorias, res.data]);
      setFormDataServico((prev) => ({ ...prev, categoria: res.data.id }));
    } catch (err) {
      toast.error("Erro ao cadastrar categoria.", { id: toastId });
    }
  };

  const handleRemoverCategoriaAPI = async (categoriaId, categoriaNome) => {
    const possuiServico = servicos.some((s) => s.categoria === categoriaId);
    if (possuiServico) {
      toast.error("Existem serviços vinculados a esta categoria.");
      return;
    }

    if (window.confirm(`Excluir permanentemente "${categoriaNome}"?`)) {
      const toastId = toast.loading("Excluindo...");
      try {
        await api.delete(`categorias/${categoriaId}/`);
        toast.success("Categoria removida!", { id: toastId });

        const lista = categorias.filter((c) => c.id !== categoriaId);
        setCategorias(lista);
        setFormDataServico((prev) => ({ ...prev, categoria: lista[0]?.id || "" }));
      } catch (err) {
        toast.error("Erro ao excluir categoria.", { id: toastId });
      }
    }
  };

  const iniciarEdicao = (servico) => {
    setEditandoId(servico.id);
    setFormDataServico({
      titulo: servico.titulo,
      categoria: servico.categoria || categorias[0]?.id || "",
      imagem: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setFormDataServico({
      titulo: "",
      categoria: categorias[0]?.id || "",
      imagem: null,
    });
    const input = document.getElementById("file-input-servico");
    if (input) input.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formDataServico.categoria) {
      toast.error("Selecione uma categoria válida.");
      return;
    }

    setLoading(true);
    const t = toast.loading(editandoId ? "Atualizando..." : "Salvando...");

    try {
      const data = new FormData();
      data.append("titulo", formatarCaseSensitive(formDataServico.titulo));
      data.append("categoria", formDataServico.categoria);
      if (formDataServico.imagem) {
        data.append("imagem", formDataServico.imagem);
      }

      if (editandoId) {
        await api.patch(`servicos/${editandoId}/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Serviço atualizado!", { id: t });
      } else {
        await api.post("servicos/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Serviço cadastrado!", { id: t });
      }

      cancelarEdicao();
      fetchServicos();
    } catch (err) {
      toast.error("Erro ao processar serviço.", { id: t });
    } finally {
      setLoading(false);
    }
  };

  const deleteServico = async (id) => {
    if (window.confirm("Excluir este serviço definitivamente?")) {
      try {
        await api.delete(`servicos/${id}/`);
        toast.success("Serviço removido!");
        fetchServicos();
      } catch (err) {
        toast.error("Não foi possível excluir o serviço.");
      }
    }
  };

  return (
    <div className="dash-section" style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* CABEÇALHO DO FORMULÁRIO */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
          {editandoId ? <Edit3 size={22} color="#8a2be2" /> : <Plus size={22} />}
          {editandoId ? `Editar Serviço #${editandoId}` : "Adicionar Novo Serviço"}
        </h2>
</div>
        {editandoId && (
          <button
            type="button"
            onClick={cancelarEdicao}
            className="btn-cancelar"
          >
            <X size={18} /> Cancelar Edição
          </button>
        )}
      

      {/* BLOCO CARD DO FORMULÁRIO */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "14px",
          padding: "20px",
          marginBottom: "35px",
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <input
            type="text"
            placeholder="Título do Trabalho (Ex: Box de Vidro Temperado)"
            value={formDataServico.titulo}
            onChange={(e) =>
              setFormDataServico({ ...formDataServico, titulo: e.target.value })
            }
            required
            style={{
              width: "100%",
              padding: "12px 14px",
              background: "rgba(0, 0, 0, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "0.9rem",
              outline: "none",
            }}
          />

          <select
            value={mostrarCriarCategoria ? "ADICIONAR_NOVA" : formDataServico.categoria}
            onChange={handleCategoriaChange}
            required
            style={{
              width: "100%",
              padding: "12px 14px",
              background: "rgba(0, 0, 0, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "0.9rem",
              outline: "none",
            }}
          >
            <option value="" disabled hidden>
              {categorias.length === 0 ? "Nenhuma categoria cadastrada" : "Selecione uma Categoria"}
            </option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id} style={{ background: "#1a1a2e", color: "#fff" }}>
                {cat.nome}
              </option>
            ))}
            <option value="ADICIONAR_NOVA" style={{ background: "#1a1a2e", fontWeight: "bold", color: "#8a2be2" }}>
              ➕ Adicionar / Gerenciar Categorias...
            </option>
          </select>

          {mostrarCriarCategoria && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="Nova Categoria..."
                  value={novaCategoriaTexto}
                  onChange={(e) => setNovaCategoriaTexto(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "rgba(0, 0, 0, 0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "6px",
                    color: "#fff",
                  }}
                />
                <button
                  type="button"
                  onClick={handleAdicionarCategoriaAPI}
                  style={{
                    padding: "0 16px",
                    background: "#8a2be2",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FolderPlus size={18} />
                </button>
              </div>

              <div
                style={{
                  background: "rgba(0,0,0,0.2)",
                  padding: "10px",
                  borderRadius: "6px",
                  maxHeight: "120px",
                  overflowY: "auto",
                }}
              >
                {categorias.map((cat) => (
                  <div
                    key={cat.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "4px 0",
                      fontSize: "0.85rem",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <span style={{ color: "rgba(255,255,255,0.7)" }}>{cat.nome}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoverCategoriaAPI(cat.id, cat.nome)}
                      style={{ background: "none", border: "none", color: "#ff4d4d", cursor: "pointer" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)" }}>
              {editandoId ? "Alterar Imagem (Opcional):" : "Imagem do Serviço:"}
            </label>
            <input
              id="file-input-servico"
              type="file"
              onChange={handleFileChange}
              required={!editandoId}
              style={{
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.7)",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: editandoId ? "#28a745" : "#8a2be2",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "0.95rem",
              cursor: "pointer",
              marginTop: "6px",
              boxShadow: "0 4px 12px rgba(138, 43, 226, 0.25)",
              transition: "all 0.2s ease",
            }}
          >
            {loading ? "Processando..." : editandoId ? "Salvar Alterações" : "Salvar Serviço"}
          </button>
        </form>
      </div>

      {/* LISTAGEM EM CARDS (JUNÇÃO VÍDEOS + DEPOIMENTOS) */}
      <h3 style={{ fontSize: "1.1rem", color: "#fff", marginBottom: "16px", fontWeight: "600" }}>
        Serviços Cadastrados ({servicos.length})
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "18px",
        }}
      >
        {servicos.map((s) => (
          <div
            key={s.id}
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            }}
          >
            {/* CAPA DA IMAGEM (ESTILO VÍDEOS) */}
            {s.imagem ? (
              <img
                src={s.imagem}
                alt={s.titulo}
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "cover",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "160px",
                  background: "rgba(255,255,255,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.2)",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                Sem Imagem
              </div>
            )}

            {/* CORPO DO CARD (ESTILO DEPOIMENTOS) */}
            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
              {/* TOPO: ID + BOTÕES DE AÇÃO */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", fontWeight: "600" }}>
                  #{s.id}
                </span>

                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => iniciarEdicao(s)}
                    title="Editar Serviço"
                    style={{
                      background: "rgba(138, 43, 226, 0.15)",
                      border: "1px solid rgba(138, 43, 226, 0.3)",
                      color: "#a855f7",
                      padding: "6px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Edit3 size={15} />
                  </button>

                  <button
                    onClick={() => deleteServico(s.id)}
                    title="Excluir Serviço"
                    style={{
                      background: "rgba(255, 77, 77, 0.15)",
                      border: "1px solid rgba(255, 77, 77, 0.3)",
                      color: "#ff4d4d",
                      padding: "6px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* TÍTULO DO TRABALHO */}
              <h4 style={{ fontSize: "1rem", color: "#fff", fontWeight: "700", margin: "2px 0" }}>
                {s.titulo}
              </h4>

              {/* BADGE DE CATEGORIA */}
              <div>
                <span
                  style={{
                    background: "rgba(138, 43, 226, 0.2)",
                    border: "1px solid rgba(138, 43, 226, 0.3)",
                    color: "#d8b4fe",
                    padding: "3px 10px",
                    borderRadius: "12px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Tag size={12} />
                  {s.categoria_detalhes?.nome || "Sem Categoria"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {servicos.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "rgba(255,255,255,0.4)",
            background: "rgba(255,255,255,0.02)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          Nenhum serviço cadastrado até o momento.
        </div>
      )}
    </div>
  );
};

export default DashServicos;