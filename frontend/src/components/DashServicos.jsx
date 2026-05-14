import React, { useEffect, useState } from "react";
import api from "../api";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

const DashServicos = () => {
  const [servicos, setServicos] = useState([]);
  const [novoServico, setNovoServico] = useState({
    titulo: "",
    categoria: "BOX",
    imagem: null,
  });

  const fetchServicos = async () => {
    const res = await api.get("servicos/");
    setServicos(res.data);
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  const handleFileChange = (e) => {
    setNovoServico({ ...novoServico, imagem: e.target.files[0] });
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const t = toast.loading("Enviando serviço..."); // Toast com loading

    try {
      const formData = new FormData();
      formData.append("titulo", novoServico.titulo);
      formData.append("categoria", novoServico.categoria);
      formData.append("imagem", novoServico.imagem);

      await api.post("servicos/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Serviço cadastrado!", { id: t });
      setNovoServico({ titulo: "", categoria: "BOX", imagem: null });
      fetchServicos();
    } catch (err) {
      toast.error("Erro ao enviar.", { id: t });
    } finally {
      setLoading(false);
    }
  };

  const deleteServico = async (id) => {
    if (window.confirm("Excluir este serviço?")) {
      try {
        await api.delete(`servicos/${id}/`);
        toast.success("Serviço removido!");
        fetchServicos();
      } catch (err) {
        toast.error("Não foi possível excluir.");
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
        <select
          onChange={(e) =>
            setNovoServico({ ...novoServico, categoria: e.target.value })
          }
        >
          <option value="BOX">Box de Banheiro</option>
          <option value="SACADA">Sacada</option>
          <option value="ESPELHO">Espelho</option>
        </select>
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
