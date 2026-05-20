import React, { useEffect, useState } from "react";
import api from "../api";
import { FileText, Type, AlignLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const DashAbout = () => {
  const [loading, setLoading] = useState(false);
  const [sobre, setSobre] = useState({
    id: null,
    titulo_rodape: "",
    descricao_rodape: "",
  });

  // Busca o texto descritivo salvo no banco de dados
  const fetchSobre = async () => {
    try {
      // Ajuste o endpoint conforme a rota criada no seu Django (ex: 'sobre/' ou 'configuracoes/')
      const res = await api.get("aboutUs/");

      if (Array.isArray(res.data) && res.data.length > 0) {
        setSobre(res.data[0]);
      } else if (res.data && !Array.isArray(res.data)) {
        setSobre(res.data);
      }
    } catch (err) {
      console.error("Erro ao carregar dados do Sobre Nós:", err);
      toast.error("Não foi possível carregar o conteúdo do rodapé.");
    }
  };

  useEffect(() => {
    fetchSobre();
  }, []);

  // Envia as alterações para o banco de dados
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Atualizando texto do rodapé...");

    try {
      const endpoint = sobre.id ? `aboutUs/${sobre.id}/` : "aboutUs/";

      if (sobre.id) {
        await api.patch(endpoint, sobre);
      } else {
        await api.post(endpoint, sobre);
      }

      toast.success("Conteúdo institucional atualizado com sucesso!", {
        id: toastId,
      });
      fetchSobre();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar alterações.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dash-section">
      <div className="dash-section-header">
        <h2>Gerenciar Conteúdo Institucional</h2>
        <p>
          Altere o título de apresentação e o texto descritivo da Styllo Vidros
          exibido no rodapé do site.
        </p>
      </div>

      <h3 className="dash-section-title">
        <FileText size={20} /> Textos do Bloco de Apresentação
      </h3>

      <form onSubmit={handleSubmit} className="about-form-container">
        <div className="about-input-box">
          <label>
            <Type size={18} className="icon-about-title" /> Nome da Empresa /
            Título do Bloco
          </label>
          <input
            type="text"
            placeholder="Ex: STYLLO VIDROS"
            value={sobre.titulo_rodape || ""}
            onChange={(e) =>
              setSobre({ ...sobre, titulo_rodape: e.target.value })
            }
            disabled={loading}
            required
          />
        </div>

        <div className="about-input-box">
          <label>
            <AlignLeft size={18} className="icon-about-desc" /> Breve Descrição
            (Sobre Nós)
          </label>
          <textarea
            rows="5"
            placeholder="Sua vidraçaria especializada em soluções modernas de vidro e alumínio..."
            value={sobre.descricao_rodape || ""}
            onChange={(e) =>
              setSobre({ ...sobre, descricao_rodape: e.target.value })
            }
            disabled={loading}
            required
          />
        </div>

        <div className="about-form-footer">
          <button type="submit" className="btn-save-about" disabled={loading}>
            <CheckCircle size={18} />
            {loading ? "Gravando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DashAbout;
