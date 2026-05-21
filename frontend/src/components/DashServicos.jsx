import React, { useEffect, useState } from "react";
import api from "../api";
import { Plus, Trash2, Image as ImageIcon, FolderPlus } from "lucide-react";
import toast from "react-hot-toast";

const DashServicos = () => {
  const [servicos, setServicos] = useState([]);

  // 1. ESTADO INICIAL COM AS CATEGORIAS PADRÃO DO SISTEMA
  const [categorias, setCategorias] = useState([
    { valor: "BOX", label: "Box para Banheiros" },
    { valor: "JANELAS", label: "Janelas" },
    { valor: "PORTAS", label: "Portas" },
    { valor: "GUARDA_CORPO", label: "Guarda Corpo" },
    { valor: "SACADA", label: "Sacada" },
    { valor: "ESPELHO", label: "Espelhos" },
    { valor: "PERGOLADO", label: "Pergolado" },
  ]);

  const [novoServico, setNovoServico] = useState({
    titulo: "",
    categoria: "BOX",
    imagem: null,
  });

  // Estados para gerenciar a criação e exibição de novas categorias customizadas
  const [mostrarCriarCategoria, setMostrarCriarCategoria] = useState(false);
  const [novaCategoriaTexto, setNovaCategoriaTexto] = useState("");
  const [loading, setLoading] = useState(false);

  // Categorias nativas protegidas contra exclusão acidental
  const categoriasProtegidas = [
    "BOX",
    "JANELAS",
    "PORTAS",
    "GUARDA_CORPO",
    "SACADA",
    "ESPELHO",
    "PERGOLADO",
  ];

  const fetchServicos = async () => {
    try {
      const res = await api.get("servicos/");
      setServicos(res.data);

      if (Array.isArray(res.data)) {
        res.data.forEach((servico) => {
          if (servico.categoria) {
            setCategorias((prev) => {
              const existe = prev.some((c) => c.valor === servico.categoria);
              if (!existe) {
                // Se não existir, adiciona o valor cru retornado pelo banco como nova opção
                return [
                  ...prev,
                  { valor: servico.categoria, label: servico.categoria },
                ];
              }
              return prev;
            });
          }
        });
      }
    } catch (err) {
      console.error("Erro ao carregar serviços:", err);
    }
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  const handleFileChange = (e) => {
    setNovoServico({ ...novoServico, imagem: e.target.files[0] });
  };

  // 2. MONITORAMENTO DO SELECT DE CATEGORIAS
  const handleCategoriaChange = (e) => {
    const valorSelecionado = e.target.value;

    if (valorSelecionado === "ADICIONAR_NOVA") {
      setMostrarCriarCategoria(true);
      setNovoServico({ ...novoServico, categoria: "" });
    } else {
      setMostrarCriarCategoria(false);
      setNovoServico({ ...novoServico, categoria: valorSelecionado });
    }
  };

  // 3. FUNÇÃO PARA INSERIR UMA NOVA CATEGORIA NA LISTA DO SELECT
  const handleAdicionarCategoriaLista = (e) => {
    e.preventDefault();
    if (!novaCategoriaTexto.trim()) return;

    // Normaliza para letras maiúsculas substituindo espaços múltiplos por underline (padrão ENUM)
    const valorFormatado = novaCategoriaTexto
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "_");
    const labelFormatado = novaCategoriaTexto.trim();

    // Validação se a categoria já existe
    const jaExiste = categorias.some((c) => c.valor === valorFormatado);
    if (jaExiste) {
      toast.error("Esta categoria já existe na lista!");
      return;
    }

    // Atualiza a lista de opções do select
    const novaOpcao = { valor: valorFormatado, label: labelFormatado };
    setCategorias([...categorias, novaOpcao]);

    // Deixa a nova categoria criada já selecionada no formulário principal
    setNovoServico({ ...novoServico, categoria: valorFormatado });
    setNovaCategoriaTexto("");
    setMostrarCriarCategoria(false);
    toast.success(`Categoria "${labelFormatado}" adicionada!`);
  };

  // 4. FUNÇÃO PARA REMOVER UMA CATEGORIA PERSONALIZADA DA LISTA
  const handleRemoverCategoria = (categoriaValor) => {
    // 1ª Barreira de Proteção: Não permite apagar as categorias base do sistema
    if (categoriasProtegidas.includes(categoriaValor)) {
      toast.error(
        "Esta categoria é padrão do sistema e não pode ser removida.",
      );
      return;
    }

    // 2ª Barreira de Proteção: Verifica se tem algum serviço ativo usando essa categoria na tela
    const possuiServico = servicos.some((s) => s.categoria === categoriaValor);
    if (possuiServico) {
      toast.error(
        "Não é possível remover! Existem serviços cadastrados nesta categoria.",
      );
      return;
    }

    if (
      window.confirm(
        "Deseja realmente remover esta categoria da lista do menu?",
      )
    ) {
      // Filtra tirando a categoria correspondente do estado
      const listaAtualizada = categorias.filter(
        (c) => c.valor !== categoriaValor,
      );
      setCategorias(listaAtualizada);

      // Reseta o select de volta para a primeira opção válida
      setNovoServico({
        ...novoServico,
        categoria: listaAtualizada[0]?.valor || "",
      });
      toast.success("Categoria removida com sucesso!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!novoServico.categoria) {
      toast.error(
        "Por favor, selecione ou insira uma categoria válida antes de salvar.",
      );
      return;
    }

    setLoading(true);
    const t = toast.loading("Enviando serviço...");

    try {
      const formData = new FormData();
      formData.append("titulo", novoServico.titulo);
      formData.append("categoria", novoServico.categoria);
      formData.append("imagem", novoServico.imagem);

      await api.post("servicos/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Serviço cadastrado!", { id: t });
      // Reseta o formulário mantendo a primeira categoria da lista selecionada por padrão
      setNovoServico({
        titulo: "",
        categoria: categorias[0]?.valor || "BOX",
        imagem: null,
      });
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

        {/* SELECT MAPEADO DO ESTADO DE CATEGORIAS */}
        <select
          value={
            mostrarCriarCategoria ? "ADICIONAR_NOVA" : novoServico.categoria
          }
          onChange={handleCategoriaChange}
          required
        >
          {categorias.map((cat) => (
            <option key={cat.valor} value={cat.valor}>
              {cat.label}
            </option>
          ))}
          <option
            value="ADICIONAR_NOVA"
            style={{ fontWeight: "bold", color: "#8a2be2" }}
          >
            ➕ Adicionar / Gerenciar Categorias...
          </option>
        </select>

        {/* ZONA CONDICIONAL DE GERENCIAMENTO DE CATEGORIAS */}
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
            {/* Campo para criar nova */}
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
                onClick={handleAdicionarCategoriaLista}
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
                title="Salvar nova categoria"
              >
                <FolderPlus size={18} />
              </button>
            </div>

            {/* Painel secundário para listagem e remoção das categorias existentes */}
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
                Categorias Atuais (Clique na lixeira para remover):
              </span>
              {categorias.map((cat) => (
                <div
                  key={cat.valor}
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
                    {cat.label}
                  </span>

                  {/* Renderiza a lixeira apenas para categorias customizadas (as padrão ficam bloqueadas) */}
                  {!categoriasProtegidas.includes(cat.valor) && (
                    <button
                      type="button"
                      onClick={() => handleRemoverCategoria(cat.valor)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ff4d4d",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        padding: "2px",
                      }}
                      title={`Excluir categoria ${cat.label}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <input type="file" onChange={handleFileChange} required />

        <button type="submit" disabled={loading} className="btn-add">
          {loading ? "Processando..." : "Salvar Serviço"}
        </button>
      </form>

      <div className="dash-list">
        {servicos.map((s) => (
          <div key={s.id} className="dash-item">
            <span>
              {s.titulo} ({s.categoria})
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
