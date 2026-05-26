import React, { useEffect, useState } from "react";
import api from "../api";
import {
  Plus,
  Trash2,
  FolderPlus,
  Images,
  CheckCircle,
  Circle,
  Edit, // 🔥 Adicionado ícone de edição
  X, // 🔥 Adicionado ícone para fechar modal
} from "lucide-react";
import toast from "react-hot-toast";

const DashPortifolio = () => {
  const [albuns, setAlbuns] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [albumSelecionado, setAlbumSelecionado] = useState(null);

  // Estado para a criação de um novo Álbum
  const [novoAlbum, setNovoAlbum] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
  });

  // 🔥 ESTADOS PARA EDIÇÃO
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [dadosEdit, setDadosEdit] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
  });

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [resCategorias, resAlbuns] = await Promise.all([
        api.get("categorias/"),
        api.get("albuns/"),
      ]);
      setCategorias(resCategorias.data);
      setAlbuns(resAlbuns.data);

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
      setAlbumSelecionado(res.data);
      setAlbuns((prev) => prev.map((a) => (a.id === id ? res.data : a)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCriarAlbum = async (e) => {
    e.preventDefault();
    setLoading(true);
    const tid = toast.loading("Criando álbum...");
    try {
      const res = await api.post("albuns/", novoAlbum);
      toast.success("Álbum criado!", { id: tid });
      setNovoAlbum({
        titulo: "",
        descricao: "",
        categoria: categorias[0]?.id || "",
      });
      setAlbuns([res.data, ...albuns]);
      setAlbumSelecionado(res.data);
    } catch (err) {
      toast.error("Erro ao criar álbum.", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FUNÇÃO PARA ABRIR MODAL DE EDIÇÃO
  const handleAbrirEdicao = () => {
    setDadosEdit({
      titulo: albumSelecionado.titulo,
      descricao: albumSelecionado.descricao || "",
      categoria: albumSelecionado.categoria,
    });
    setIsModalEditOpen(true);
  };

  // 🔥 FUNÇÃO PARA SALVAR EDIÇÃO (PATCH)
  const handleSalvarEdicao = async (e) => {
    e.preventDefault();
    const tid = toast.loading("Salvando alterações...");
    try {
      const res = await api.patch(`albuns/${albumSelecionado.id}/`, dadosEdit);
      toast.success("Álbum atualizado!", { id: tid });
      setIsModalEditOpen(false);
      recarregarAlbumAtivo(albumSelecionado.id);
    } catch (err) {
      toast.error("Erro ao atualizar álbum.", { id: tid });
    }
  };

  // Funções de Fotos (Upload, Capa, Delete) permanecem as mesmas...
  const handleUploadFotos = async (e) => {
    const arquivos = Array.from(e.target.files);
    if (!albumSelecionado || !albumSelecionado.id) return;
    const albumIdValido = String(albumSelecionado.id);
    const tid = toast.loading(`Enviando ${arquivos.length} foto(s)...`);
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
    const tid = toast.loading("Definindo capa...");
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

  const handleDeletarAlbum = async (id, titulo) => {
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

  return (
    <div className="dash-portfolio-container">
      {/* COLUNA ESQUERDA */}
      <div className="dash-portfolio-left">
        <div className="dash-section">
          <h3>
            <FolderPlus size={20} /> Novo Álbum
          </h3>
          <form
            onSubmit={handleCriarAlbum}
            className="dash-form"
            name="form-new-album"
          >
            <input
              type="text"
              placeholder="Título do Álbum (Ex: Fachada Comercial - Loja X)"
              value={novoAlbum.titulo}
              onChange={(e) =>
                setNovoAlbum({ ...novoAlbum, titulo: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Descrição do projeto (Especificações técnicas, tipo de vidro, roldanas...)"
              value={novoAlbum.descricao}
              onChange={(e) =>
                setNovoAlbum({ ...novoAlbum, descricao: e.target.value })
              }
              rows={3}
            />
            <select
              value={novoAlbum.categoria}
              onChange={(e) =>
                setNovoAlbum({
                  ...novoAlbum,
                  categoria: Number(e.target.value),
                })
              }
              required
            >
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
            <button type="submit" className="btn-add">
              Criar Álbum
            </button>
          </form>
        </div>

        <div className="dash-section" style={{ marginTop: "20px" }}>
          <h3>Álbuns Publicados</h3>
          <div className="dash-list">
            {albuns.map((a) => (
              <div
                key={a.id}
                className={`dash-item ${albumSelecionado?.id === a.id ? "selected-item-portfolio" : ""}`}
                onClick={() => setAlbumSelecionado(a)}
              >
                <div>
                  <span>{a.titulo}</span>
                  <small>
                    {a.categoria_detalhes?.nome} ({a.fotos?.length || 0} fotos)
                  </small>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletarAlbum(a.id, a.titulo);
                  }}
                  className="btn-del"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COLUNA DIREITA (GERENCIAMENTO) */}
      <div className="dash-portfolio-right">
        {albumSelecionado ? (
          <div className="dash-section full-height-section">
            <div className="active-album-header">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  width: "100%",
                }}
              >
                <div>
                  <h2>
                    Gerenciando: <span>{albumSelecionado.titulo}</span>
                  </h2>
                  <p>{albumSelecionado.descricao || "Sem descrição."}</p>
                </div>
                {/* 🔥 BOTÃO DE EDITAR NO TOPO DA DIREITA */}
                <button
                  onClick={handleAbrirEdicao}
                  className="btn-edit-album-top"
                  title="Editar informações do álbum"
                >
                  <Edit size={18} /> Editar Info
                </button>
              </div>
            </div>

            <div className="upload-media-batch-box">
              <label
                htmlFor="multiple-file-input"
                className="batch-upload-label"
              >
                <Images size={24} />
                <span>Clique para adicionar fotos</span>
              </label>
              <input
                id="multiple-file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleUploadFotos}
                style={{ display: "none" }}
              />
            </div>

            <div className="photos-management-grid">
              {albumSelecionado.fotos?.map((foto) => (
                <div
                  key={foto.id}
                  className={`photo-manage-card ${albumSelecionado.capa === foto.id ? "is-cover-active" : ""}`}
                >
                  <img src={foto.imagem} alt="Album item" />
                  <div className="photo-card-actions-bar">
                    <button
                      type="button"
                      onClick={() => handleDefinirCapa(foto.id)}
                      className={`btn-select-cover ${albumSelecionado.capa === foto.id ? "active-cover" : ""}`}
                    >
                      {albumSelecionado.capa === foto.id ? (
                        <CheckCircle size={16} />
                      ) : (
                        <Circle size={16} />
                      )}
                      <span>Capa</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletarFoto(foto.id)}
                      className="btn-delete-photo-inline"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="dash-section empty-right-state flex-center">
            <Images size={48} style={{ opacity: 0.3, marginBottom: "10px" }} />
            <p>Selecione um álbum para gerenciar.</p>
          </div>
        )}
      </div>

      {/* 🔥 MODAL DE EDIÇÃO */}
      {isModalEditOpen && (
        <div className="portfolio-edit-modal-overlay">
          <div className="portfolio-edit-modal-content">
            <div className="modal-header">
              <h3>Editar Álbum</h3>
              <button onClick={() => setIsModalEditOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={handleSalvarEdicao}
              className="dash-form"
              name="form-edit-album"
            >
              <label>Título do Projeto</label>
              <input
                type="text"
                value={dadosEdit.titulo}
                onChange={(e) =>
                  setDadosEdit({ ...dadosEdit, titulo: e.target.value })
                }
                required
              />

              <label>Descrição</label>
              <textarea
                value={dadosEdit.descricao}
                onChange={(e) =>
                  setDadosEdit({ ...dadosEdit, descricao: e.target.value })
                }
                rows={4}
              />

              <label>Categoria</label>
              <select
                value={dadosEdit.categoria}
                onChange={(e) =>
                  setDadosEdit({
                    ...dadosEdit,
                    categoria: Number(e.target.value),
                  })
                }
                required
              >
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalEditOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
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
