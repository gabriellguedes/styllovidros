import React, { useEffect, useState } from "react";
import api from "../api";
import {
  Plus,
  Trash2,
  FolderPlus,
  Images,
  CheckCircle,
  Circle,
} from "lucide-react";
import toast from "react-hot-toast";

const DashPortifolio = () => {
  const [albuns, setAlbuns] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [albumSelecionado, setAlbumSelecionado] = useState(null);

  // Estado para a criação de um novo Álbum (Etapa 1)
  const [novoAlbum, setNovoAlbum] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
  });

  const [loading, setLoading] = useState(false);

  // Carregar as categorias dinâmicas e os álbuns existentes
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
      console.error("Erro ao carregar dados do portfólio:", err);
      toast.error("Erro ao sincronizar dados com o servidor.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Recarregar os detalhes de um álbum específico para atualizar as fotos na tela
  const recarregarAlbumAtivo = async (id) => {
    try {
      const res = await api.get(`albuns/${id}/`);
      setAlbumSelecionado(res.data);
      // Atualiza também na listagem geral de álbuns
      setAlbuns((prev) => prev.map((a) => (a.id === id ? res.data : a)));
    } catch (err) {
      console.error(err);
    }
  };

  // Criar Novo Álbum (POST)
  const handleCriarAlbum = async (e) => {
    e.preventDefault();
    if (!novoAlbum.categoria) {
      toast.error("Selecione uma categoria válida.");
      return;
    }

    setLoading(true);
    const tid = toast.loading("Criando álbum de projeto...");

    try {
      const res = await api.post("albuns/", novoAlbum);
      toast.success("Álbum criado com sucesso! Agora adicione as fotos.", {
        id: tid,
      });

      setNovoAlbum({
        titulo: "",
        descricao: "",
        categoria: categorias[0]?.id || "",
      });
      setAlbuns([res.data, ...albuns]);
      setAlbumSelecionado(res.data); // Abre o álbum criado automaticamente para colocar fotos
    } catch (err) {
      toast.error("Erro ao criar o álbum.", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  // Subir Múltiplas Fotos para o Álbum Selecionado (POST em lote)
  const handleUploadFotos = async (e) => {
    const arquivos = Array.from(e.target.files);

    // 1. Validação de segurança: verifica se há um álbum ativo selecionado
    if (!albumSelecionado || !albumSelecionado.id) {
      toast.error("Nenhum álbum selecionado ou ativo para receber as fotos.");
      return;
    }

    if (arquivos.length === 0) return;

    if (albumSelecionado.fotos.length + arquivos.length > 10) {
      toast.error("Limite máximo sugerido de fotos excedido para este álbum.");
      return;
    }

    // 🔥 O SEGREDO DA CORREÇÃO: Extraímos e isolamos o ID como String ANTES do loop.
    // Isso impede que o laço perca a referência do ID durante as iterações assíncronas.
    const albumIdValido = String(albumSelecionado.id);

    const tid = toast.loading(`A enviar ${arquivos.length} foto(s)...`);

    try {
      const promessas = arquivos.map((file) => {
        const formData = new FormData();

        // Usamos a constante isolada que tem a garantia de conter o ID correto
        formData.append("album", albumIdValido);
        formData.append("imagem", file);

        return api.post("album-fotos/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      });

      // Aguarda todos os uploads terminarem em paralelo
      await Promise.all(promessas);
      toast.success("Fotos adicionadas ao álbum!", { id: tid });

      // Limpa visualmente o input de ficheiros
      document.getElementById("multiple-file-input").value = "";

      // Atualiza o ecrã com as novas fotos
      recarregarAlbumAtivo(albumSelecionado.id);
    } catch (err) {
      console.error("Erro detalhado do Django:", err.response?.data || err);
      toast.error("Falha no upload de algumas fotos. Verifica o painel.", {
        id: tid,
      });
    }
  };

  // Definir qual foto do álbum será a Capa (PATCH)
  const handleDefinirCapa = async (fotoId) => {
    if (!albumSelecionado) return;
    const tid = toast.loading("Atualizando capa do álbum...");

    try {
      await api.patch(`albuns/${albumSelecionado.id}/`, { capa: fotoId });
      toast.success("Nova capa definida para o álbum!", { id: tid });
      recarregarAlbumAtivo(albumSelecionado.id);
    } catch (err) {
      toast.error("Erro ao salvar alteração de capa.", { id: tid });
    }
  };

  // Apagar uma Foto Individual (DELETE)
  const handleDeletarFoto = async (fotoId) => {
    if (!window.confirm("Remover esta foto do álbum permanentemente?")) return;
    const tid = toast.loading("Apagando imagem...");

    try {
      await api.delete(`album-fotos/${fotoId}/`);
      toast.success("Foto removida!", { id: tid });
      recarregarAlbumAtivo(albumSelecionado.id);
    } catch (err) {
      toast.error("Erro ao apagar a foto.", { id: tid });
    }
  };

  // Apagar o Álbum Inteiro (DELETE)
  const handleDeletarAlbum = async (id, titulo) => {
    if (
      !window.confirm(
        `Tem certeza que deseja excluir o álbum "${titulo}" e TODAS as fotos contidas nele?`,
      )
    )
      return;
    const tid = toast.loading("Removendo álbum completo...");

    try {
      await api.delete(`albuns/${id}/`);
      toast.success("Álbum excluído com sucesso!", { id: tid });
      setAlbuns(albuns.filter((a) => a.id !== id));
      if (albumSelecionado?.id === id) setAlbumSelecionado(null);
    } catch (err) {
      toast.error("Não foi possível excluir o álbum.", { id: tid });
    }
  };

  return (
    <div className="dash-portfolio-container">
      {/* SEÇÃO DA ESQUERDA: Cadastro de Álbum e Lista Geral */}
      <div className="dash-portfolio-left">
        <div className="dash-section">
          <h3>
            <FolderPlus size={20} /> Novo Álbum de Projeto
          </h3>

          <form onSubmit={handleCriarAlbum} className="dash-form">
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

            <button type="submit" disabled={loading} className="btn-add">
              {loading ? "Criando..." : "Criar Álbum"}
            </button>
          </form>
        </div>

        {/* Listagem de Álbuns Cadastrados */}
        <div className="dash-section" style={{ marginTop: "20px" }}>
          <h3>Álbuns Publicados</h3>
          <div className="dash-list">
            {albuns.map((a) => (
              <div
                key={a.id}
                className={`dash-item ${albumSelecionado?.id === a.id ? "selected-item-portfolio" : ""}`}
                onClick={() => setAlbumSelecionado(a)}
                style={{ cursor: "pointer" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <span style={{ fontWeight: "500" }}>{a.titulo}</span>
                  <small
                    style={{
                      color: "var(--accent-purple)",
                      fontSize: "0.75rem",
                    }}
                  >
                    {a.categoria_detalhes?.nome} — ({a.fotos?.length || 0}{" "}
                    fotos)
                  </small>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Impede selecionar ao clicar no botão de lixeira
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

      {/* SEÇÃO DA DIREITA: Gerenciador de Fotos Internas do Álbum Ativo */}
      <div className="dash-portfolio-right">
        {albumSelecionado ? (
          <div className="dash-section full-height-section">
            <div className="active-album-header">
              <div>
                <h2>
                  Gerenciando: <span>{albumSelecionado.titulo}</span>
                </h2>
                <p>
                  {albumSelecionado.descricao || "Sem descrição informada."}
                </p>
              </div>
            </div>

            {/* Input de Upload em Lote */}
            <div className="upload-media-batch-box">
              <label
                htmlFor="multiple-file-input"
                className="batch-upload-label"
              >
                <Images size={24} />
                <span>
                  Clique para selecionar ou arrastar múltiplas fotos (Máx 5
                  recomendadas)
                </span>
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

            {/* Grid de Miniaturas para Escolha de Capa e Deleção */}
            <h4 className="sub-title-photos-grid">
              Fotos no Álbum (Selecione o círculo para marcar a capa)
            </h4>

            <div className="photos-management-grid">
              {albumSelecionado.fotos && albumSelecionado.fotos.length > 0 ? (
                albumSelecionado.fotos.map((foto) => {
                  const ehCapa = albumSelecionado.capa === foto.id;
                  return (
                    <div
                      key={foto.id}
                      className={`photo-manage-card ${ehCapa ? "is-cover-active" : ""}`}
                    >
                      <img src={foto.imagem} alt="Item do álbum" />

                      <div className="photo-card-actions-bar">
                        {/* Selector Circular de Capa */}
                        <button
                          type="button"
                          onClick={() => handleDefinirCapa(foto.id)}
                          className={`btn-select-cover ${ehCapa ? "active-cover" : ""}`}
                          title={
                            ehCapa
                              ? "Esta é a imagem de capa"
                              : "Definir como capa do álbum"
                          }
                        >
                          {ehCapa ? (
                            <CheckCircle size={16} />
                          ) : (
                            <Circle size={16} />
                          )}
                          <span>{ehCapa ? "Capa" : "Definir Capa"}</span>
                        </button>

                        {/* Botão de Lixeira Individual */}
                        <button
                          type="button"
                          onClick={() => handleDeletarFoto(foto.id)}
                          className="btn-delete-photo-inline"
                          title="Excluir esta foto"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-photos-alert">
                  <Images size={32} />
                  <p>
                    Este álbum ainda está vazio. Selecione fotos acima para
                    preenchê-lo.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="dash-section empty-right-state flex-center">
            <Images size={48} style={{ opacity: 0.3, marginBottom: "10px" }} />
            <p>
              Selecione um álbum da lista ao lado ou crie um novo para gerenciar
              as suas fotos e definir a imagem de capa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashPortifolio;
