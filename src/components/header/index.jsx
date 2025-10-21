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
      {/* Logo */}
      <div className="navbar-logo">
        <Link className="navbar-brand me-1 me-sm-3" to="/home">
          <div className="d-flex align-items-center">
            <img src={plataformaNavbar} alt="plataforma" width="180" />
          </div>
        </Link>
      </div>

      {/* Menú central */}
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

          {/* Siempre visibles */}
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

          {/* Solo visible si es administrador */}
          {isAdmin && (
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
          )}

            {/* Solo visible si es administrador */}
          {isAdmin && (
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
          )}
        </ul>
      </div>

      {/* Menú usuario */}
      <ul className="navbar-nav navbar-nav-icons flex-row">
        <li className="nav-item dropdown mx-4">
          <a
            className="nav-link lh-1 pe-0"
            id="navbarDropdownUser"
            href="#!"
            role="button"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <div className="avatar avatar-l">
              <img className="rounded-circle" src={logoUser} alt="User" />
            </div>
          </a>

          <div
            className="dropdown-menu dropdown-menu-end navbar-dropdown-caret py-0 dropdown-profile shadow border"
            aria-labelledby="navbarDropdownUser"
          >
            <div className="card border-0">
              <div className="card-body text-center p-3">
                <p className="fw-bold mb-1 text-uppercase">{user.nombre}</p>
                <p className="small text-muted mb-2">{user.rut}</p>
                <hr className="my-2" />
                <p className="text-secondary mb-0">
                  {isAdmin ? "Administrador" : "Usuario"}
                </p>
              </div>

              <div className="card-footer p-0 border-top border-translucent">
                <button
                  className="btn btn-danger w-100 rounded-0"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i> Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </li>

        <li className="nav-item">
          <img src={logosNavbar} width="100" alt="Logos" />
        </li>
      </ul>
    </nav>
  );
};

export default Header;
