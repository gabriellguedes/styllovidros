import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
  Home,
  MessageSquare,
  LayoutDashboard,
  Menu,
  LogOut,
  TextAlignCenter,
} from "lucide-react";

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

  // Função auxiliar para gerar o link correto do WhatsApp caso o usuário coloque só o número no input
  const formatarLinkWhatsapp = (linkOrNumber) => {
    if (!linkOrNumber) return "#";
    // Se já for um link completo (contiver http), retorna ele mesmo
    if (linkOrNumber.includes("http")) return linkOrNumber;
    // Caso contrário, limpa os caracteres e gera o link wa.me
    const numeroLimpo = linkOrNumber.replace(/\D/g, "");
    return `https://wa.me/55${numeroLimpo}`;
  };

  return (
    <footer className="footer-main">
      <div className="footer-container">
        {/* Coluna 1: Navegação */}
        <div className="footer-column">
          <h3 className="footer-column-h3-01">Painel</h3>
          <ul>
            {isAuth ? (
              <>
                <li>
                  <Link to="/">Início</Link>
                </li>
                <li>
                  <Link to="/avaliar">Avaliar</Link>
                </li>
                <li>
                  <Link to="/Contato">Contato</Link>
                </li>
                <li>
                  <Link to="/dashboard">Painel</Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "yellow",
                    }}
                  >
                    <LogOut size={18} /> Sair
                  </button>
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
          <p className="footer-about">
            Com anos de experiência no mercado, a <strong>Styllo Vidros</strong>{" "}
            é especialista em transformar ambientes através do vidro. Unimos
            técnica, segurança e design para entregar projetos sob medida que
            elevam o padrão da sua residência ou empresa. Nossa missão é a
            transparência em cada detalhe e a satisfação total de nossos
            clientes.
          </p>
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
