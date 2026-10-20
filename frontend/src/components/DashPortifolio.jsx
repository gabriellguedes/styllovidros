import React, { useEffect, useState } from "react";
import api from "../api";
import {
  Plus,
  Trash2,
  FolderPlus,
  Images,
  CheckCircle,
  Circle,
  Edit,
  X,
  Eye,
  EyeOff,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";

const DashPortifolio = () => {
  const [albuns, setAlbuns] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [albumSelecionado, setAlbumSelecionado] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState("visiveis"); // "visiveis" ou "ocultos"

  const [novoAlbum, setNovoAlbum] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
    visivel: true,
  });

  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [dadosEdit, setDadosEdit] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
    visivel: true,
  });

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [resCategorias, resAlbuns] = await Promise.all([
        api.get("categorias/"),
        api.get("albuns/"),
      ]);
      setCategorias(resCategorias.data);
      
      const albunsTratados = resAlbuns.data.map((a) => ({
        ...a,
        visivel: a.visivel !== undefined ? a.visivel : true,
      }));
      setAlbuns(albunsTratados);

      if (resCategorias.data.length > 0 && !novoAlbum.categoria) {
        setNovoAlbum((prev) => ({
          ...prev,
          categoria: resCategorias.data[0].id,
        }));
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      toast.error("Erro ao sincronizar dados.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const recarregarAlbumAtivo = async (id) => {
    try {
      const res = await api.get(`albuns/${id}/`);
      const albumAtualizado = {
        ...res.data,
        visivel: res.data.visivel !== undefined ? res.data.visivel : true,
      };
      setAlbumSelecionado(albumAtualizado);
      setAlbuns((prev) => prev.map((a) => (a.id === id ? albumAtualizado : a)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCriarAlbum = async (e) => {
    e.preventDefault();
    setLoading(true);
    const tid = toast.loading("A criar álbum...");
    try {
      const res = await api.post("albuns/", novoAlbum);
      const novoCriado = {
        ...res.data,
        visivel: res.data.visivel !== undefined ? res.data.visivel : true,
      };
      toast.success("Álbum criado!", { id: tid });
      setNovoAlbum({
        titulo: "",
        descricao: "",
        categoria: categorias[0]?.id || "",
        visivel: true,
      });
      setAlbuns([novoCriado, ...albuns]);
      setAlbumSelecionado(novoCriado);
    } catch (err) {
      toast.error("Erro ao criar álbum.", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirEdicao = () => {
    setDadosEdit({
      titulo: albumSelecionado.titulo,
      descricao: albumSelecionado.descricao || "",
      categoria: albumSelecionado.categoria,
      visivel: albumSelecionado.visivel,
    });
    setIsModalEditOpen(true);
  };

  const handleSalvarEdicao = async (e) => {
    e.preventDefault();
    const tid = toast.loading("A guardar alterações...");
    try {
      await api.patch(`albuns/${albumSelecionado.id}/`, dadosEdit);
      toast.success("Álbum atualizado!", { id: tid });
      setIsModalEditOpen(false);
      recarregarAlbumAtivo(albumSelecionado.id);
    } catch (err) {
      toast.error("Erro ao atualizar álbum.", { id: tid });
    }
  };

  const handleToggleVisibilidade = async (album, e) => {
    e.stopPropagation();
    const novoStatus = !album.visivel;
    const tid = toast.loading(novoStatus ? "A exibir álbum..." : "A ocultar álbum...");
    try {
      await api.patch(`albuns/${album.id}/`, { visivel: novoStatus });
      setAlbuns((prev) =>
        prev.map((a) => (a.id === album.id ? { ...a, visivel: novoStatus } : a))
      );
      if (albumSelecionado?.id === album.id) {
        setAlbumSelecionado((prev) => ({ ...prev, visivel: novoStatus }));
      }
      toast.success(novoStatus ? "Álbum visível no site!" : "Álbum ocultado.", { id: tid });
    } catch (err) {
      toast.error("Erro ao atualizar status.", { id: tid });
    }
  };

  const handleUploadFotos = async (e) => {
    const arquivos = Array.from(e.target.files);
    if (!albumSelecionado || !albumSelecionado.id) return;
    const albumIdValido = String(albumSelecionado.id);
    const tid = toast.loading(`A enviar ${arquivos.length} foto(s)...`);
    try {
      const promessas = arquivos.map((file) => {
        const formData = new FormData();
        formData.append("album", albumIdValido);
        formData.append("imagem", file);
        return api.post("album-fotos/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      });
      await Promise.all(promessas);
      toast.success("Fotos adicionadas!", { id: tid });
      document.getElementById("multiple-file-input").value = "";
      recarregarAlbumAtivo(albumSelecionado.id);
    } catch (err) {
      toast.error("Erro no upload.", { id: tid });
    }
  };

  const handleDefinirCapa = async (fotoId) => {
    const tid = toast.loading("A definir capa...");
    try {
      await api.patch(`albuns/${albumSelecionado.id}/`, { capa: fotoId });
      toast.success("Capa atualizada!", { id: tid });
      recarregarAlbumAtivo(albumSelecionado.id);
    } catch (err) {
      toast.error("Erro ao definir capa.", { id: tid });
    }
  };

  const handleDeletarFoto = async (fotoId) => {
    if (!window.confirm("Remover foto?")) return;
    try {
      await api.delete(`album-fotos/${fotoId}/`);
      toast.success("Foto removida!");
      recarregarAlbumAtivo(albumSelecionado.id);
    } catch (err) {
      toast.error("Erro ao apagar foto.");
    }
  };

  const handleDeletarAlbum = async (id, titulo, e) => {
    e.stopPropagation();
    if (!window.confirm(`Excluir álbum "${titulo}"?`)) return;
    try {
      await api.delete(`albuns/${id}/`);
      toast.success("Álbum removido!");
      setAlbuns(albuns.filter((a) => a.id !== id));
      if (albumSelecionado?.id === id) setAlbumSelecionado(null);
    } catch (err) {
      toast.error("Erro ao excluir álbum.");
    }
  };

  const obterFotoCapaUrl = (album) => {
    if (!album.fotos || album.fotos.length === 0) return null;
    const fotoCapa = album.fotos.find((f) => f.id === album.capa);
    return fotoCapa ? fotoCapa.imagem : album.fotos[0].imagem;
  };

  const albunsVisiveis = albuns.filter((a) => a.visivel);
  const albunsOcultos = albuns.filter((a) => !a.visivel);
  const albunsExibidos = abaAtiva === "visiveis" ? albunsVisiveis : albunsOcultos;

  return (
    <div className="dash-section" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ color: "#fff", marginBottom: "5px" }}>Gerir Portfólio de Álbuns</h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
          Crie e organize álbuns de projetos por categorias e modere a visibilidade no site.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", alignItems: "start" }}>
        
        {/* COLUNA ESQUERDA: NOVO ÁLBUM + ABAS + CARDS DE ÁLBUNS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* FORMULÁRIO NOVO ÁLBUM */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#fff", display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
              <FolderPlus size={18} color="#8a2be2" /> Novo Álbum
            </h3>
            <form onSubmit={handleCriarAlbum} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input
                type="text"
                placeholder="Título do Álbum (Ex: Fachada X)"
                value={novoAlbum.titulo}
                onChange={(e) => setNovoAlbum({ ...novoAlbum, titulo: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              />
              <textarea
                placeholder="Descrição do projeto..."
                value={novoAlbum.descricao}
                onChange={(e) => setNovoAlbum({ ...novoAlbum, descricao: e.target.value })}
                rows={2}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "0.9rem",
                  outline: "none",
                  resize: "vertical",
                }}
              />
              <select
                value={novoAlbum.categoria}
                onChange={(e) => setNovoAlbum({ ...novoAlbum, categoria: Number(e.target.value) })}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              >
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id} style={{ background: "#1a1a2e", color: "#fff" }}>
                    {cat.nome}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#8a2be2",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(138, 43, 226, 0.25)",
                }}
              >
                {loading ? "A criar..." : "Criar Álbum"}
              </button>
            </form>
          </div>

          {/* LISTAGEM DE ÁLBUNS EM CARDS */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ fontSize: "1.05rem", color: "#fff", fontWeight: "600" }}>
                Álbuns Cadastrados ({albuns.length})
              </h3>
            </div>

            {/* ABAS: VISÍVEIS / OCULTOS */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
              <button
                type="button"
                onClick={() => setAbaAtiva("visiveis")}
                style={{
                  flex: 1,
                  background: abaAtiva === "visiveis" ? "var(--accent-purple, #8a2be2)" : "rgba(255,255,255,0.05)",
                  color: "#fff",
                  border: abaAtiva === "visiveis" ? "none" : "1px solid rgba(255,255,255,0.1)",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <Eye size={14} /> Visíveis ({albunsVisiveis.length})
              </button>

              <button
                type="button"
                onClick={() => setAbaAtiva("ocultos")}
                style={{
                  flex: 1,
                  background: abaAtiva === "ocultos" ? "var(--accent-purple, #8a2be2)" : "rgba(255,255,255,0.05)",
                  color: "#fff",
                  border: abaAtiva === "ocultos" ? "none" : "1px solid rgba(255,255,255,0.1)",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <EyeOff size={14} /> Ocultos ({albunsOcultos.length})
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {albunsExibidos.map((a) => {
                const capaUrl = obterFotoCapaUrl(a);
                const isSelected = albumSelecionado?.id === a.id;
                return (
                  <div
                    key={a.id}
                    onClick={() => setAlbumSelecionado(a)}
                    style={{
                      background: isSelected ? "rgba(138, 43, 226, 0.15)" : "rgba(255, 255, 255, 0.03)",
                      border: isSelected ? "2px solid #8a2be2" : "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "14px",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {/* CAPA DA IMAGEM NO TOPO */}
                    {capaUrl ? (
                      <img
                        src={capaUrl}
                        alt={a.titulo}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "150px",
                          background: "rgba(255,255,255,0.04)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "rgba(255,255,255,0.2)",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <Images size={28} />
                      </div>
                    )}

                    {/* CORPO DO CARD */}
                    <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", fontWeight: "600" }}>
                          #{a.id}
                        </span>

                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            onClick={(e) => handleToggleVisibilidade(a, e)}
                            title={a.visivel ? "Ocultar do site" : "Tornar visível no site"}
                            style={{
                              background: "rgba(138, 43, 226, 0.15)",
                              border: "1px solid rgba(138, 43, 226, 0.3)",
                              color: a.visivel ? "#81c784" : "#ffb74d",
                              padding: "6px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {a.visivel ? <Eye size={15} /> : <EyeOff size={15} />}
                          </button>

                          <button
                            onClick={(e) => handleDeletarAlbum(a.id, a.titulo, e)}
                            title="Excluir Álbum"
                            style={{
                              background: "rgba(255, 77, 77, 0.15)",
                              border: "1px solid rgba(255, 77, 77, 0.3)",
                              color: "#ff4d4d",
                              padding: "6px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <h4 style={{ fontSize: "0.95rem", color: "#fff", fontWeight: "700", margin: "2px 0" }}>
                        {a.titulo}
                      </h4>

                      <div>
                        <span
                          style={{
                            background: "rgba(138, 43, 226, 0.2)",
                            border: "1px solid rgba(138, 43, 226, 0.3)",
                            color: "#d8b4fe",
                            padding: "3px 10px",
                            borderRadius: "12px",
                            fontSize: "0.72rem",
                            fontWeight: "600",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Tag size={11} />
                          {a.categoria_detalhes?.nome || "Geral"} • {a.fotos?.length || 0} fotos
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {albunsExibidos.length === 0 && (
                <div style={{ textAlign: "center", padding: "20px", color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>
                  Nenhum álbum nesta aba.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: GESTÃO DO ÁLBUM SELECIONADO */}
        <div>
          {albumSelecionado ? (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "14px", flexWrap: "wrap" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <h2 style={{ fontSize: "1.25rem", color: "#fff", fontWeight: "700" }}>
                      {albumSelecionado.titulo}
                    </h2>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "10px",
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        background: albumSelecionado.visivel ? "rgba(46, 125, 50, 0.2)" : "rgba(239, 108, 0, 0.2)",
                        color: albumSelecionado.visivel ? "#81c784" : "#ffb74d",
                      }}
                    >
                      {albumSelecionado.visivel ? "Visível" : "Oculto"}
                    </span>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", lineHeight: "1.4" }}>
                    {albumSelecionado.descricao || "Sem descrição informada."}
                  </p>
                </div>

                <button
                  onClick={handleAbrirEdicao}
                  style={{
                    background: "rgba(138, 43, 226, 0.15)",
                    border: "1px solid rgba(138, 43, 226, 0.3)",
                    color: "#d8b4fe",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Edit size={14} /> Editar Informações
                </button>
              </div>

              <label
                htmlFor="multiple-file-input"
                style={{
                  border: "2px dashed rgba(138, 43, 226, 0.4)",
                  background: "rgba(138, 43, 226, 0.05)",
                  padding: "16px",
                  borderRadius: "10px",
                  textAlign: "center",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  color: "#fff",
                }}
              >
                <Images size={24} color="#8a2be2" />
                <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>Clique para adicionar novas fotos ao álbum</span>
              </label>
              <input
                id="multiple-file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleUploadFotos}
                style={{ display: "none" }}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: "12px",
                  maxHeight: "450px",
                  overflowY: "auto",
                  paddingRight: "4px",
                }}
              >
                {albumSelecionado.fotos?.map((foto) => {
                  const isCapa = albumSelecionado.capa === foto.id;
                  return (
                    <div
                      key={foto.id}
                      style={{
                        background: "rgba(0,0,0,0.2)",
                        border: isCapa ? "2px solid #8a2be2" : "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "10px",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <img
                        src={foto.imagem}
                        alt="Item do álbum"
                        style={{ width: "100%", height: "110px", objectFit: "cover" }}
                      />
                      <div style={{ padding: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <button
                          type="button"
                          onClick={() => handleDefinirCapa(foto.id)}
                          style={{
                            background: isCapa ? "rgba(138, 43, 226, 0.2)" : "rgba(255,255,255,0.05)",
                            border: isCapa ? "1px solid rgba(138, 43, 226, 0.4)" : "1px solid rgba(255,255,255,0.1)",
                            color: isCapa ? "#d8b4fe" : "rgba(255,255,255,0.7)",
                            padding: "3px 6px",
                            borderRadius: "4px",
                            fontSize: "0.7rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                          }}
                        >
                          {isCapa ? <CheckCircle size={12} color="#8a2be2" /> : <Circle size={12} />}
                          {isCapa ? "Capa" : "Capa"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletarFoto(foto.id)}
                          title="Remover foto"
                          style={{
                            background: "rgba(255, 77, 77, 0.15)",
                            border: "1px solid rgba(255, 77, 77, 0.3)",
                            color: "#ff4d4d",
                            padding: "5px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "50px 20px",
                color: "rgba(255,255,255,0.4)",
                background: "rgba(255, 255, 255, 0.02)",
                borderRadius: "14px",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "300px",
              }}
            >
              <Images size={42} style={{ opacity: 0.3, marginBottom: "10px" }} />
              <p style={{ fontSize: "0.9rem" }}>Selecione um álbum na lista ao lado para gerenciar as fotos e informações.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE EDIÇÃO */}
      {isModalEditOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              background: "#1a1a2e",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "16px",
              padding: "24px",
              width: "100%",
              maxWidth: "460px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ color: "#fff", fontSize: "1.15rem", fontWeight: "700" }}>Editar Informações do Álbum</h3>
              <button
                onClick={() => setIsModalEditOpen(false)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSalvarEdicao} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>Título do Projeto</label>
              <input
                type="text"
                value={dadosEdit.titulo}
                onChange={(e) => setDadosEdit({ ...dadosEdit, titulo: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "8px",
                  color: "#fff",
                  outline: "none",
                }}
              />

              <label style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>Descrição</label>
              <textarea
                value={dadosEdit.descricao}
                onChange={(e) => setDadosEdit({ ...dadosEdit, descricao: e.target.value })}
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "8px",
                  color: "#fff",
                  outline: "none",
                  resize: "vertical",
                }}
              />

              <label style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>Categoria</label>
              <select
                value={dadosEdit.categoria}
                onChange={(e) => setDadosEdit({ ...dadosEdit, categoria: Number(e.target.value) })}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "8px",
                  color: "#fff",
                  outline: "none",
                }}
              >
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id} style={{ background: "#1a1a2e", color: "#fff" }}>
                    {cat.nome}
                  </option>
                ))}
              </select>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                <input
                  type="checkbox"
                  id="visivel-check"
                  checked={dadosEdit.visivel}
                  onChange={(e) => setDadosEdit({ ...dadosEdit, visivel: e.target.checked })}
                  style={{ width: "16px", height: "16px", accentColor: "#8a2be2" }}
                />
                <label htmlFor="visivel-check" style={{ fontSize: "0.85rem", color: "#fff", cursor: "pointer" }}>
                  Visível no site para os clientes
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "14px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalEditOpen(false)}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#fff",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    background: "#8a2be2",
                    border: "none",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                  }}
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashPortifolio;