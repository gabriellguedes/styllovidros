import React from "react";
import { Link } from "react-router-dom";
import { Home, MessageSquare, LayoutDashboard, Menu } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo / Nome da Marca */}
        <Link to="/" className="navbar-logo">
          <img class="nav_logo" src="/logo.png" />
          STYLLO <span>VIDROS</span>
        </Link>

        {/* Links de Navegação */}
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              <Home size={18} /> Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/avaliar" className="nav-links">
              <MessageSquare size={18} /> Avaliar
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/dashboard" className="nav-links">
              <LayoutDashboard size={18} /> Painel
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
