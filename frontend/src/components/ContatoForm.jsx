import React, { useState, useEffect } from "react";
import api from "../api";
import { Send, AlertCircle } from "lucide-react";
import { PatternFormat } from "react-number-format";

const ContatoForm = () => {
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    whatsapp: "",
    categoria: "", // Substituiu o e-mail
    mensagem: "",
  });
  const [status, setStatus] = useState(null); // 'success' ou 'error'

  // Carrega as categorias para o cliente escolher o tipo de serviço
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
      // 1. Salva no banco de dados da sua API do Render
      await api.post("contatos/", {
        nome: formData.nome,
        whatsapp: formData.whatsapp,
        servico:
          categorias.find((c) => c.id === Number(formData.categoria))?.nome ||
          "Geral",
        mensagem: formData.mensagem,
      });

      setStatus("success");

      // 2. 🔥 PONTO EXTRA: Envio Automático para o seu WhatsApp
      const seuNumeroWhatsApp = "5561992987278"; // Insira aqui o seu número com DDD (ex: 55 + DDD + Número)
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

      // Abre o WhatsApp com a mensagem montada
      window.open(
        `https://wa.me/${seuNumeroWhatsApp}?text=${textoWhatsApp}`,
        "_blank",
      );

      // Reseta o formulário
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
    <section className="section-container">
      <div className="contact-card">
        <form onSubmit={handleSubmit} className="contact-form">
          {/* Nome */}
          <input
            type="text"
            name="nome"
            placeholder="Seu Name"
            value={formData.nome}
            onChange={handleChange}
            required
          />

          {/* WhatsApp formatado */}
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

          {/* Seletor de Categoria / Tipo de Serviço */}
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "6px",
              background: "#1a1a1a",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              marginBottom: "15px",
            }}
          >
            <option value="" disabled>
              Selecione o que deseja orçar
            </option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>

          {/* 🔥 Texto informativo sobre a localização/região */}
          <div
            className="info-box-region"
            style={{
              display: "flex",
              alignItems: "start",
              gap: "8px",
              background: "rgba(138, 43, 226, 0.15)",
              padding: "10px 12px",
              borderRadius: "6px",
              marginBottom: "10px",
              border: "1px solid rgba(138, 43, 226, 0.3)",
            }}
          >
            <AlertCircle
              size={16}
              color="#8a2be2"
              style={{ marginTop: "2px", flexShrink: 0 }}
            />
            <p
              style={{
                fontSize: "0.82rem",
                color: "rgba(255,255,255,0.85)",
                margin: 0,
                lineHeight: "1.3",
              }}
            >
              <strong>Atenção:</strong> Por favor, informe a{" "}
              <strong>sua cidade ou região</strong> na descrição abaixo. O valor
              do orçamento varia de acordo com o local da instalação.
            </p>
          </div>

          {/* Mensagem / Descrição */}
          <textarea
            name="mensagem"
            placeholder="Descreva detalhes do projeto e a cidade onde será feito o trabalho..."
            value={formData.mensagem}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit" className="btn-submit-form">
            <Send size={18} /> Enviar e Abrir no WhatsApp
          </button>

          {status === "success" && (
            <p className="msg-success">
              Mensagem registrada com sucesso! Direcionando para o WhatsApp...
            </p>
          )}
          {status === "error" && (
            <p className="msg-error">
              Ocorreu um erro ao salvar os dados. Tente novamente.
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContatoForm;
