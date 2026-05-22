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

  // Estados separados para gerenciar a exibição amigável do perfil
  const [exibirNome, setExibirNome] = useState("Usuário");
  const [subTitulo, setSubTitulo] = useState("Conectado");

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth_user");

    if (storedAuth) {
      try {
        // Tenta converter o texto estruturado de volta para Objeto JavaScript
        const usuarioObjeto = JSON.parse(storedAuth);

        // Verifica se temos o primeiro nome cadastrado
        if (usuarioObjeto.first_name) {
          // Junta o First Name com o Last Name separados por um espaço normal
          const nomeCompleto =
            `${usuarioObjeto.first_name} ${usuarioObjeto.last_name || ""}`.trim();
          setExibirNome(nomeCompleto);
        } else {
          // Fallback caso o objeto exista mas não tenha nomes salvos
          setExibirNome(usuarioObjeto.username || "Usuário");
        }

        // No cabeçalho interno do dropdown, mostramos o username institucional (@gabriel.guedes)
        setSubTitulo(`@${usuarioObjeto.username}`);
      } catch (e) {
        // Bloco de segurança: Se 'auth_user' for apenas o texto antigo (String simples),
        // exibe o texto puro e evita que o React dê erro de tela branca.
        setExibirNome(storedAuth);
        setSubTitulo("Conectado");
      }
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
    localStorage.removeItem("is_admin");
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
          {/* Botão de Gatilho Principal (Navbar) */}
          <button
            type="button"
            className={`user-profile-trigger ${isOpen ? "active" : ""}`}
            onClick={toggleMenu}
          >
            <div className="avatar-circle">
              <User size={18} />
            </div>
            {/* 🔥 AQUI: Agora exibe o Nome e Sobrenome unificados de forma elegante */}
            <span className="user-profile-name">{exibirNome}</span>
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
                {/* Mostra o Username com arroba dentro do menu, mantendo o padrão do sistema */}
                <strong>{subTitulo}</strong>
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
