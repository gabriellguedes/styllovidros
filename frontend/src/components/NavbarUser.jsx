import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  User,
  LogOut,
  Key,
  Settings,
  ChevronDown,
  MonitorCog,
  LayoutDashboard,
} from "lucide-react";
import api from "../api";

const NavbarUser = ({ activeTab, handleTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = localStorage.getItem("auth") === "true";

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Recupera o nome do usuário logado (pode ser adaptado para o seu contexto/localStorage)
  const [username, setUsername] = useState("Administrador");

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth_user"); // ou como tiver salvo o nome
    if (storedAuth) {
      setUsername(storedAuth);
    }
  }, []);

  // Fecha o dropdown automaticamente se o usuário clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");
    navigate("/");
    window.location.reload();
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = (tabName) => {
    if (handleTabChange) {
      handleTabChange(tabName);
    }
    setIsOpen(false);
  };
  const isNoDashboard = location.pathname === "/dashboard";

  return (
    <>
      {isAuth ? (
        <div className="user-profile-menu-container" ref={menuRef}>
          {/* Botão de Disparo (Gatilho) */}
          <button
            type="button"
            className={`user-profile-trigger ${isOpen ? "active" : ""}`}
            onClick={toggleMenu}
          >
            <div className="avatar-circle">
              <User size={18} />
            </div>
            <span className="user-profile-name">{username}</span>
            <ChevronDown
              size={14}
              className={`chevron-user-icon ${isOpen ? "rotate" : ""}`}
            />
          </button>

          {/* Menu Dropdown Suspenso */}
          {isOpen && (
            <ul className="user-profile-dropdown">
              <li className="dropdown-user-info-header">
                <span>Conectado como</span>
                <strong>{username}</strong>
              </li>

              <hr className="dropdown-divider" />
              <li className={isNoDashboard ? "disabled-dropdown-item" : ""}>
                <button
                  type="button"
                  onClick={() => !isNoDashboard && navigate("/dashboard")}
                  disabled={isNoDashboard}
                >
                  <LayoutDashboard size={16} />
                  Painel Administrativo
                </button>
              </li>
              <hr className="dropdown-divider" />
              <li>
                <button
                  type="button"
                  onClick={() => handleMenuClick("usuarios")}
                >
                  <Settings size={16} />
                  Editar Usuário
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => handleMenuClick("usuarios")}
                >
                  <Key size={16} />
                  Alterar Senha
                </button>
              </li>

              <hr className="dropdown-divider" />

              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn-dropdown-logout"
                >
                  <LogOut size={16} />
                  Sair do Sistema
                </button>
              </li>
            </ul>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default NavbarUser;
