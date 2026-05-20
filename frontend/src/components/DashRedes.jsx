import React, { useEffect, useState } from "react";
import api from "../api";
import { Link2, Smartphone, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const DashRedes = () => {
  const [loading, setLoading] = useState(false);
  const [redes, setRedes] = useState({
    instagram: "",
    facebook: "",
    whatsapp: "",
    youtube: "",
    telefone: "",
  });

  // Busca as redes sociais salvas no banco de dados
  const fetchRedes = async () => {
    try {
      const res = await api.get("redes/");
      // Se o seu backend retornar uma lista, pegamos o primeiro registro [0]
      if (Array.isArray(res.data) && res.data.length > 0) {
        setRedes(res.data[0]);
      } else if (res.data && !Array.isArray(res.data)) {
        setRedes(res.data);
      }
    } catch (err) {
      console.error("Erro ao carregar links das redes sociais:", err);
      toast.error("Não foi possível carregar os links das redes.");
    }
  };

  useEffect(() => {
    fetchRedes();
  }, []);

  // Envia as alterações para o banco de dados
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Atualizando links do rodapé...");

    try {
      // Caso o backend use ID para a atualização ex: redes/1/
      const endpoint = redes.id ? `redes/${redes.id}/` : "redes/";

      if (redes.id) {
        await api.patch(endpoint, redes);
      } else {
        await api.post(endpoint, redes);
      }

      toast.success("Redes sociais atualizadas no site!", { id: toastId });
      fetchRedes();
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
        <h2>Gerenciar Redes Sociais</h2>
        <p>
          Altere os links dos ícones de contato que aparecem no rodapé (footer)
          da Styllo Vidros.
        </p>
      </div>

      <h3 className="dash-section-title">
        <Link2 size={20} /> Links de Destino Atuais
      </h3>

      <form onSubmit={handleSubmit} className="networks-form-container">
        <div className="network-input-box">
          <label>
            <i className="fa-brands fa-instagram icon-instagram"></i> Instagram
          </label>
          <input
            type="text"
            placeholder="https://instagram.com/seu_perfil"
            value={redes.instagram || ""}
            onChange={(e) => setRedes({ ...redes, instagram: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="network-input-box">
          <label>
            <i className="fa-brands fa-facebook icon-facebook"></i>Facebook
          </label>
          <input
            type="text"
            placeholder="https://facebook.com/sua_pagina"
            value={redes.facebook || ""}
            onChange={(e) => setRedes({ ...redes, facebook: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="network-input-box">
          <label>
            <i className="fa-brands fa-youtube icon-youtube"></i>Link do YouTube
          </label>
          <input
            type="text"
            placeholder="https://www.youtube.com/seu_canal"
            value={redes.youtube || ""}
            onChange={(e) => setRedes({ ...redes, youtube: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="network-input-box">
          <label>
            <i className="fa-brands fa-whatsapp icon-whatsapp"></i>Link do
            Whatsapp
          </label>
          <input
            type="text"
            placeholder="https://wa.me/55..."
            value={redes.whatsapp || ""}
            onChange={(e) => setRedes({ ...redes, whatsapp: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="network-input-box">
          <label>
            <Smartphone size={18} className="icon-phone" /> Telefone de Contato
            (Texto)
          </label>
          <input
            type="text"
            placeholder="Ex: (61) 98765-4321"
            value={redes.telefone || ""}
            onChange={(e) => setRedes({ ...redes, telefone: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="networks-form-footer">
          <button
            type="submit"
            className="btn-save-networks"
            disabled={loading}
          >
            <CheckCircle size={18} />
            {loading ? "Gravando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DashRedes;
