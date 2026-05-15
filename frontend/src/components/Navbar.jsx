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

const Navbar = () => {
  const navigate = useNavigate();
  const isAuth = localStorage.getItem("auth") === "true";

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Links de Navegação */}
        <ul className="nav-menu">
          <li>
            <Link to="/" className="nav-links">
              Home
            </Link>
          </li>
          {isAuth ? (
            <>
              <li>
                <Link to="/dashboard" className="nav-links">
                  Painel
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="nav-links"
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
              <Link to="/login" className="nav-links">
                Entrar
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
