import React, { useEffect, useState } from "react";
import api from "../api";
import { Plus, Trash2, Image as ImageIcon, FolderPlus } from "lucide-react";
import toast from "react-hot-toast";

const DashServicos = () => {
  const [servicos, setServicos] = useState([]);
  const [categorias, setCategorias] = useState([]); // Agora começa vazio e vem da API

  const [novoServico, setNovoServico] = useState({
    titulo: "",
    categoria: "", // Vai armazenar o ID numérico da categoria selecionada
    imagem: null,
  });

  // Estados para gerenciar a criação e exibição de novas categorias customizadas
  const [mostrarCriarCategoria, setMostrarCriarCategoria] = useState(false);
  const [novaCategoriaTexto, setNovaCategoriaTexto] = useState("");
  const [loading, setLoading] = useState(false);

  // Carrega as categorias salvas no Banco de Dados
  const fetchCategorias = async () => {
    try {
      const res = await api.get("categorias/");
      setCategorias(res.data);

      // Se houver categorias e o formulário estiver sem nenhuma selecionada, define a primeira
      if (res.data.length > 0 && !novoServico.categoria) {
        setNovoServico((prev) => ({ ...prev, categoria: res.data[0].id }));
      }
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
      toast.error("Não foi possível carregar as categorias.");
    }
  };

  // Carrega a listagem de serviços cadastrados
  const fetchServicos = async () => {
    try {
      const res = await api.get("servicos/");
      setServicos(res.data);
    } catch (err) {
      console.error("Erro ao carregar serviços:", err);
    }
  };

  // Roda uma única vez ao abrir a tela
  useEffect(() => {
    fetchCategorias();
    fetchServicos();
  }, []);

  const handleFileChange = (e) => {
    setNovoServico({ ...novoServico, imagem: e.target.files[0] });
  };

  // Monitora a troca de seleção do select principal
  const handleCategoriaChange = (e) => {
    const valorSelecionado = e.target.value;

    if (valorSelecionado === "ADICIONAR_NOVA") {
      setMostrarCriarCategoria(true);
    } else {
      setMostrarCriarCategoria(false);
      setNovoServico({ ...novoServico, categoria: Number(valorSelecionado) });
    }
  };

  // 🔥 INTEGRAÇÃO API: Cadastra uma nova categoria no Banco de Dados (POST)
  const handleAdicionarCategoriaAPI = async (e) => {
    e.preventDefault();
    if (!novaCategoriaTexto.trim()) return;

    const nomeFormatado = novaCategoriaTexto.trim().toUpperCase();

    // Validação local rápida para evitar requisição redundante
    const jaExiste = categorias.some((c) => c.nome === nomeFormatado);
    if (jaExiste) {
      toast.error("Esta categoria já existe no sistema!");
      return;
    }

    const toastId = toast.loading("Salvando nova categoria...");
    try {
      // Envia para o endpoint do Django
      const res = await api.post("categorias/", { nome: nomeFormatado });

      toast.success(`Categoria "${nomeFormatado}" salva com sucesso!`, {
        id: toastId,
      });
      setNovaCategoriaTexto("");
      setMostrarCriarCategoria(false);

      // Atualiza a lista local com a resposta contendo o ID gerado pelo Django
      setCategorias([...categorias, res.data]);
      // Deixa a nova categoria selecionada por padrão
      setNovoServico({ ...novoServico, categoria: res.data.id });
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar categoria no banco.", { id: toastId });
    }
  };

  // 🔥 INTEGRAÇÃO API: Remove uma categoria do Banco de Dados (DELETE)
  const handleRemoverCategoriaAPI = async (categoriaId, categoriaNome) => {
    // Validação de segurança: Impede apagar caso algum serviço cadastrado na tela dependa dela
    const possuiServico = servicos.some((s) => s.categoria === categoriaId);
    if (possuiServico) {
      toast.error(
        "Não é possível remover! Existem serviços ativos vinculados a esta categoria.",
      );
      return;
    }

    if (
      window.confirm(
        `Deseja realmente excluir permanentemente a categoria "${categoriaNome}"?`,
      )
    ) {
      const toastId = toast.loading("Excluindo do sistema...");
      try {
        await api.delete(`categorias/${categoriaId}/`);
        toast.success("Categoria removida!", { id: toastId });

        // Remove da lista do estado do React
        const listaAtualizada = categorias.filter((c) => c.id !== categoriaId);
        setCategorias(listaAtualizada);

        // Reseta o formulário para a primeira categoria restante
        setNovoServico({
          ...novoServico,
          categoria: listaAtualizada[0]?.id || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Erro ao excluir. Verifique se existem dependências.", {
          id: toastId,
        });
      }
    }
  };

  // Salva o Serviço Completo
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!novoServico.categoria) {
      toast.error("Por favor, selecione uma categoria válida antes de salvar.");
      return;
    }

    setLoading(true);
    const t = toast.loading("Enviando serviço...");

    try {
      const formData = new FormData();
      formData.append("titulo", novoServico.titulo);
      formData.append("categoria", novoServico.categoria); // Envia o ID numérico correto
      formData.append("imagem", novoServico.imagem);

      await api.post("servicos/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Serviço cadastrado!", { id: t });

      // Limpa o formulário mantendo a categoria anterior ativa
      setNovoServico({
        titulo: "",
        categoria: novoServico.categoria,
        imagem: null,
      });

      // Reseta o input do arquivo fisicamente (limpa a seleção anterior)
      document.getElementById("file-input-servico").value = "";

      fetchServicos();
    } catch (err) {
      toast.error("Erro ao enviar serviço.", { id: t });
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
    <div className="dash-section">
      <h3>
        <Plus size={20} /> Adicionar Novo Serviço
      </h3>

      <form onSubmit={handleSubmit} className="dash-form">
        <input
          type="text"
          placeholder="Título do Trabalho"
          value={novoServico.titulo}
          onChange={(e) =>
            setNovoServico({ ...novoServico, titulo: e.target.value })
          }
          required
        />

        {/* SELECT DINÂMICO MAPEADO DO BANCO DE DADOS */}
        <select
          value={
            mostrarCriarCategoria ? "ADICIONAR_NOVA" : novoServico.categoria
          }
          onChange={handleCategoriaChange}
          required
        >
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nome}
            </option>
          ))}
          <option
            value="ADICIONAR_NOVA"
            style={{ fontWeight: "bold", color: "#8a2be2" }}
          >
            ➕ Adicionar / Gerenciar Categorias...
          </option>
        </select>

        {/* CONTROLE DE GERENCIAMENTO DE CATEGORIAS */}
        {mostrarCriarCategoria && (
          <div
            className="category-manager-box"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "100%",
              marginTop: "-5px",
            }}
          >
            <div style={{ display: "flex", gap: "10px", width: "100%" }}>
              <input
                type="text"
                placeholder="Nome da Nova Categoria (Ex: Cortina de Vidro)"
                value={novaCategoriaTexto}
                onChange={(e) => setNovaCategoriaTexto(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={handleAdicionarCategoriaAPI}
                className="btn-add-inline"
                style={{
                  padding: "0 15px",
                  background: "#8a2be2",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
                title="Salvar na API"
              >
                <FolderPlus size={18} />
              </button>
            </div>

            {/* Listagem das categorias vindas da API com botão de exclusão real */}
            <div
              className="custom-categories-list"
              style={{
                background: "rgba(0,0,0,0.2)",
                padding: "12px",
                borderRadius: "6px",
                maxHeight: "150px",
                overflowY: "auto",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <span
                style={{
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.4)",
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Categorias Atuais no Banco de Dados:
              </span>
              {categorias.map((cat) => (
                <div
                  key={cat.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 0",
                    fontSize: "0.88rem",
                    borderBottom: "1px solid rgba(255,255,255,0.03)",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.75)" }}>
                    {cat.nome}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemoverCategoriaAPI(cat.id, cat.nome)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ff4d4d",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      padding: "2px",
                    }}
                    title={`Excluir permanentemente ${cat.nome}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <input
          id="file-input-servico"
          type="file"
          onChange={handleFileChange}
          required
        />

        <button type="submit" disabled={loading} className="btn-add">
          {loading ? "Processando..." : "Salvar Serviço"}
        </button>
      </form>

      {/* LISTAGEM DE SERVIÇOS CADASTRADOS */}
      <div className="dash-list">
        {servicos.map((s) => (
          <div key={s.id} className="dash-item">
            <span>
              {s.titulo} —{" "}
              <strong style={{ color: "var(--accent-purple)" }}>
                {s.categoria_detalhes?.nome || "Sem Categoria"}
              </strong>
            </span>
            <button onClick={() => deleteServico(s.id)} className="btn-del">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashServicos;
