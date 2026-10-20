import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Mail, Phone, MapPin, ArrowLeft, Send } from "lucide-react";
import ContatoForm from "../components/ContatoForm";

const Contato = () => {
  

  return (
    <div className="login-page-container"> {/* Reutiliza o container centralizado com fundo estilizado */}
      <div className="testimonial-form-card" style={{ maxWidth: "700px" }}>
        
        <div className="testimonial-form-header">
          <h2>Fale com a <span>Stylo Vidros</span></h2>
          <p>Tem alguma dúvida ou deseja solicitar um projeto sob medida? Entre em contacto connosco.</p>
        </div>

        <ContatoForm />

        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Voltar para a Página Inicial
        </Link>

      </div>
    </div>
  );
};

export default Contato;