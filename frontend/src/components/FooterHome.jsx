import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Home,
  MessageSquare,
  LayoutDashboard,
  Menu,
  LogOut,
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
  return (
    <footer className="footer-main">
      <div className="footer-container">
        {/* Coluna 1: Navegação */}
        <div className="footer-column">
          <h3>Menu</h3>
          <ul>
            <li>
              <Link to="/">Início</Link>
            </li>
            <li>
              <Link to="/avaliar">Avaliar</Link>
            </li>
            <li>
              <Link to="/Contato">Contato</Link>
            </li>
            {isAuth ? (
              <>
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
            <a href="#" target="_blank" rel="noreferrer">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#" target="_blank" rel="noreferrer">
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a href="#" target="_blank" rel="noreferrer">
              <i className="fa-brands fa-youtube"></i>
            </a>
            <a href="#" target="_blank" rel="noreferrer">
              <i className="fa-brands fa-whatsapp"></i>
            </a>
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
