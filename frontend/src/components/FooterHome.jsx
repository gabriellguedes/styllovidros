import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { LogOut } from "lucide-react";

const FooterHome = () => {
  const navigate = useNavigate();
  const isAuth = localStorage.getItem("auth") === "true";

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  // Estado para armazenar os links vindos do banco de dados
  const [linksRedes, setLinksRedes] = useState({
    instagram: "",
    facebook: "",
    whatsapp: "",
    youtube: "",
    telefone: "",
  });

  useEffect(() => {
    const carregarLinksRodape = async () => {
      try {
        const res = await api.get("redes/");

        // Trata o retorno caso venha como Array (padrão do Django ViewSet)
        if (Array.isArray(res.data) && res.data.length > 0) {
          setLinksRedes(res.data[0]);
        } else if (res.data && !Array.isArray(res.data)) {
          setLinksRedes(res.data);
        }
      } catch (err) {
        console.error("Erro ao carregar os links do rodapé:", err);
      }
    };

    carregarLinksRodape();
  }, []);

  // Função auxiliar atualizada para gerar o link do WhatsApp com mensagem pré-definida
  const formatarLinkWhatsapp = (linkOrNumber) => {
    if (!linkOrNumber) return "#";

    const mensagemPadrao =
      "Olá! Vi o contato de vocês através do site e gostaria de fazer um orçamento.";
    const mensagemCodificada = encodeURIComponent(mensagemPadrao);

    if (linkOrNumber.includes("http")) {
      const caractereConexao = linkOrNumber.includes("?") ? "&" : "?";

      if (linkOrNumber.includes("text=")) {
        return linkOrNumber;
      }
      return `${linkOrNumber}${caractereConexao}text=${mensagemCodificada}`;
    }

    // Se o usuário digitou apenas o número de telefone bruto no painel (ex: 61987654321)
    const numeroLimpo = linkOrNumber.replace(/\D/g, "");
    return `https://wa.me/55${numeroLimpo}?text=${mensagemCodificada}`;
  };
  const scrollToTop = (e) => {
    // Se o usuário já estiver na Home ("/") apenas rola a tela para cima suavemente
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Transição suave
    });
  };

  const [aboutUs, setAboutUs] = useState({
    titulo_rodape: "",
    descricao_rodape: "",
  });

  useEffect(() => {
    const carregarAboutUs = async () => {
      try {
        const res = await api.get("aboutUs/");

        // Trata o retorno caso venha como Array (padrão do Django ViewSet)
        if (Array.isArray(res.data) && res.data.length > 0) {
          setAboutUs(res.data[0]);
        } else if (res.data && !Array.isArray(res.data)) {
          setAboutUs(res.data);
        }
      } catch (err) {
        console.error("Erro ao carregar o conteúdo do Sobre Nós: ", err);
      }
    };

    carregarAboutUs();
  }, []);

  return (
    <footer className="footer-main">
      <div className="footer-container">
        {/* Coluna 1: Navegação */}
        <div className="footer-column">
          <h3 className="footer-column-h3-01">Menu</h3>
          <ul>
            <li>
              <Link to="/" onClick={scrollToTop}>
                Início
              </Link>
            </li>
            <li>
              <Link to="/avaliar" target="_blank" rel="noopener noreferrer">
                Avaliar
              </Link>
            </li>
            <li>
              <Link to="/Contato">Contato</Link>
            </li>
            {isAuth ? (
              <>
                <li>
                  <Link to="/dashboard">Painel</Link>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">Entrar</Link>
              </li>
            )}
          </ul>
        </div>

        <div className="footer-column central">
          <h3>Sobre Nós</h3>
          {aboutUs.descricao_rodape && (
            <p className="footer-about">{aboutUs.descricao_rodape}</p>
          )}
        </div>

        {/* Na coluna das Redes Sociais, os ícones agora estão maiores via CSS */}
        <div className="footer-column">
          <h3>Siga-nos</h3>
          <div className="social-links">
            {linksRedes.instagram && (
              <a
                href={linksRedes.instagram}
                title="Ir para o Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>
            )}
            {linksRedes.facebook && (
              <a
                href={linksRedes.facebook}
                title="Ir para o Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-facebook"></i>
              </a>
            )}
            {linksRedes.youtube && (
              <a
                href={linksRedes.youtube}
                title="Ir para o YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-youtube"></i>
              </a>
            )}
            {linksRedes.whatsapp && (
              <a
                href={formatarLinkWhatsapp(linksRedes.whatsapp)}
                title="Fale Conosco no Whatsapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Styllo Vidros - Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default FooterHome;
