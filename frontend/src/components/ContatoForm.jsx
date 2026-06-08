import React, { useState, useEffect } from "react";
import api from "../api";
import {
  Send,
  AlertCircle,
  User,
  Phone as PhoneIcon,
  MessageSquare,
} from "lucide-react";
import { PatternFormat } from "react-number-format";

const ContatoForm = () => {
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    whatsapp: "",
    categoria: "",
    mensagem: "",
  });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    api
      .get("categorias/")
      .then((res) => {
        setCategorias(res.data);
        if (res.data.length > 0) {
          setFormData((prev) => ({ ...prev, categoria: res.data[0].id }));
        }
      })
      .catch((err) => console.error("Erro ao carregar categorias:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("contatos/", {
        nome: formData.nome,
        whatsapp: formData.whatsapp,
        servico: Number(formData.categoria),
        mensagem: formData.mensagem,
      });

      setStatus("success");

      const seuNumeroWhatsApp = "5561992987278";
      const nomeCategoria =
        categorias.find((c) => c.id === Number(formData.categoria))?.nome ||
        "Geral";

      const textoWhatsApp = encodeURIComponent(
        `Olá Styllo Vidros! Gostaria de um orçamento:\n\n` +
          `👤 *Nome:* ${formData.nome}\n` +
          `📱 *WhatsApp:* ${formData.whatsapp}\n` +
          `🛠️ *Interesse:* ${nomeCategoria}\n` +
          `📝 *Detalhes/Região:* ${formData.mensagem}`,
      );

      window.open(
        `https://wa.me/${seuNumeroWhatsApp}?text=${textoWhatsApp}`,
        "_blank",
      );

      setFormData({
        nome: "",
        whatsapp: "",
        categoria: categorias[0]?.id || "",
        mensagem: "",
      });
    } catch (error) {
      console.error("Erro ao enviar contato:", error);
      setStatus("error");
    }
  };

  return (
    <div className="styllo-contact-card">
      <form onSubmit={handleSubmit} className="styllo-contact-form">
        {/* Input Nome */}
        <div className="styllo-input-group">
          <User size={18} className="styllo-input-icon" />
          <input
            type="text"
            name="nome"
            placeholder="Seu Nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>

        {/* Input WhatsApp */}
        <div className="styllo-input-group">
          <PhoneIcon size={18} className="styllo-input-icon" />
          <PatternFormat
            format="(##) # ####-####"
            mask="X"
            placeholder="WhatsApp Ex: (61) 9 9999-9999"
            value={formData.whatsapp}
            onValueChange={(values) => {
              const { value } = values;
              setFormData({ ...formData, whatsapp: value });
            }}
            required
          />
        </div>

        {/* Select Categoria */}
        <div className="styllo-input-group">
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
          >
            <option value="" disabled hidden>
              Selecione o que deseja orçar
            </option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Banner Informativo */}
        <div className="styllo-info-box">
          <AlertCircle size={18} className="styllo-info-icon" />
          <p>
            <strong>Atenção:</strong> Por favor, informe a{" "}
            <strong>sua cidade ou região</strong> na descrição abaixo. O valor
            varia de acordo com o local de instalação.
          </p>
        </div>

        {/* Textarea Mensagem */}
        <div className="styllo-input-group textarea-group">
          <MessageSquare
            size={18}
            className="styllo-input-icon textarea-icon"
          />
          <textarea
            name="mensagem"
            placeholder="Descreva detalhes do projeto e a cidade onde será feito o trabalho..."
            value={formData.mensagem}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {/* Botão Enviar */}
        <button type="submit" className="styllo-btn-submit">
          <Send size={18} /> Enviar mensagem
        </button>

        {status === "success" && (
          <p className="styllo-status-msg success">
            ✓ Mensagem registrada! Direcionando ao WhatsApp...
          </p>
        )}
        {status === "error" && (
          <p className="styllo-status-msg error">
            ✕ Erro ao salvar dados. Tente novamente ou use o ícone flutuante.
          </p>
        )}
      </form>
    </div>
  );
};

export default ContatoForm;
