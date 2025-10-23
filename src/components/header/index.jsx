import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import plataformaNavbar from "src/assets/img/codelco/plataforma_navbar.png";
import logosNavbar from "src/assets/img/codelco/logos_navbar.png";
import logoUser from "src/assets/img/codelco/user.png";
import { useUser } from "../context/UserContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useUser();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/liderazgo/login");
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
    }
  };

  if (!user) return null;

  return (
    <nav className="navbar navbar-top fixed-top navbar-expand-lg bg-dark" id="navbarTop">
      {/* Izquierda: Logo plataforma */}
      <div className="navbar-logo d-flex align-items-center">
        <Link className="navbar-brand me-1 me-sm-3" to="/home">
          <img src={plataformaNavbar} alt="plataforma" width="180" />
        </Link>
      </div>

      {/* Centro: menú principal */}
      <div
        className="collapse navbar-collapse navbar-top-collapse order-1 order-lg-0 justify-content-center"
        id="navbarTopCollapse"
      >
        <ul className="navbar-nav navbar-nav-top">
          {isAdmin && (
            <li className="nav-item">
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `nav-link text-white lh-1 ${isActive ? "fw-bold bg-primary" : ""}`
                }
              >
                Inicio
              </NavLink>
            </li>
          )}

          <li className="nav-item">
            <NavLink
              to="/createJustification"
              className={({ isActive }) =>
                `nav-link text-white lh-1 ${isActive ? "fw-bold bg-primary" : ""}`
              }
            >
              Crear Justificación
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/myJustifications"
              className={({ isActive }) =>
                `nav-link text-white lh-1 ${isActive ? "fw-bold bg-primary" : ""}`
              }
            >
              Mis Justificaciones
            </NavLink>
          </li>

          {isAdmin && (
            <>
              <li className="nav-item">
                <NavLink
                  to="/adminJustifications"
                  className={({ isActive }) =>
                    `nav-link text-white lh-1 ${isActive ? "fw-bold bg-primary" : ""}`
                  }
                >
                  Administrar Justificaciones
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/employeeProfiles"
                  className={({ isActive }) =>
                    `nav-link text-white lh-1 ${isActive ? "fw-bold bg-primary" : ""}`
                  }
                >
                  Perfiles
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Derecha: info de usuario + botón Cerrar sesión (sin dropdown) */}
      <div className="d-flex align-items-center ms-auto gap-3">
        <div className="d-flex align-items-center text-white small">
          <img
            src={logoUser}
            alt="User"
            className="rounded-circle me-2"
            style={{ width: 32, height: 32, objectFit: "cover" }}
          />
            <div className="d-none d-md-flex flex-column lh-1">
              <strong className="text-uppercase">{user.nombre}</strong>
              <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                {isAdmin ? "Administrador" : "Usuario"} · {user.rut}
              </span>
            </div>
        </div>

        <button
          type="button"
          className="btn btn-sm btn-outline-light"
          onClick={handleLogout}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          Cerrar sesión
        </button>

        <img src={logosNavbar} width="100" alt="Logos" />
      </div>
    </nav>
  );
};

export default Header;
