import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import plataformaNavbar from "src/assets/img/codelco/plataforma_navbar.png";
import logosNavbar from "src/assets/img/codelco/logos_navbar.png";
import logoUser from "src/assets/img/codelco/user.png";
import { useUser } from "../context/UserContext";

/**
 * Header principal (JSX puro):
 * - Accesos directos de usuario (Crear/Mis Justificaciones)
 * - Menú "Administración" (solo si isAdmin)
 * - Menú de usuario (avatar) con opción "Cerrar sesión"
 * - Estilo navbar-dark bg-dark
 */
const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useUser();

  const handleLogout = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    Promise.resolve()
      .then(() => logout && logout())
      .then(() => navigate("/liderazgo/login"))
      .catch((error) => console.error("❌ Error al cerrar sesión:", error));
  };

  if (!user) return null;

  const navLinkClass = ({ isActive }) =>
    "nav-link px-3 py-2" + (isActive ? " active fw-semibold" : " text-white-50");

  return (
    <nav className="navbar navbar-top navbar-expand-lg navbar-dark bg-dark fixed-top" id="navbarTop">
      <div className="container-fluid">
        {/* Branding + Toggler */}
        <div className="navbar-logo d-flex align-items-center">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTopCollapse"
            aria-controls="navbarTopCollapse"
            aria-expanded="false"
            aria-label="Alternar navegación"
          >
            <span className="navbar-toggler-icon" />
          </button>

        <Link className="navbar-brand ms-2 me-3 d-flex align-items-center" to="/home">
            <img src={plataformaNavbar} alt="Plataforma" height={28} />
          </Link>
        </div>

        {/* Contenido colapsable */}
        <div className="collapse navbar-collapse" id="navbarTopCollapse">
          {/* IZQ/Centro: accesos directos de usuario + admin dropdown */}
          <ul className="navbar-nav me-auto align-items-lg-center">
            {/* Accesos directos (usuario) */}
            <li className="nav-item">
              <NavLink to="/createJustification" className={navLinkClass}>
                <i className="bi bi-plus-circle me-1" /> Crear&nbsp;Justificación
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/myJustifications" className={navLinkClass}>
                <i className="bi bi-card-checklist me-1" /> Mis&nbsp;Justificaciones
              </NavLink>
            </li>

            {/* Menú Administración (solo si es admin) */}
            {isAdmin ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle px-3 py-2 text-white-50"
                  href="#!"
                  id="adminDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-gear me-1" /> Administración
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <NavLink className="dropdown-item" to="/adminJustifications">
                      <i className="bi bi-ui-checks-grid me-1" />
                      Administrar justificaciones
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/employeeProfiles">
                      <i className="bi bi-people me-1" />
                      Perfiles
                    </NavLink>
                  </li>
                </ul>
              </li>
            ) : null}
          </ul>

          {/* DER: logos + menú usuario (avatar + logout en dropdown) */}
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item d-none d-lg-block me-3">
              <img src={logosNavbar} alt="Logos" height={40} />
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link d-flex align-items-center dropdown-toggle"
                href="#!"
                id="userMenuDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={logoUser}
                  alt={user && user.nombre ? user.nombre : "Usuario"}
                  className="rounded-circle me-2"
                  style={{ width: 32, height: 32, objectFit: "cover" }}
                />
                <span className="d-none d-lg-inline text-white">
                  {user && user.nombre ? user.nombre : ""}
                </span>
              </a>

              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuDropdown">
                <li className="dropdown-header">
                  <div className="fw-semibold">{user && user.nombre ? user.nombre : ""}</div>
                  <div className="text-muted small">
                    {(user && user.rut) || ""} · {isAdmin ? "Administrador" : "Usuario"}
                  </div>
                </li>
                <li><hr className="dropdown-divider" /></li>

                {/* Atajos también aquí por comodidad */}
                <li>
                  <NavLink className="dropdown-item" to="/createJustification">
                    <i className="bi bi-plus-circle me-1" />
                    Crear justificación
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/myJustifications">
                    <i className="bi bi-card-checklist me-1" />
                    Mis justificaciones
                  </NavLink>
                </li>

                {isAdmin ? (
                  <>
                    <li><hr className="dropdown-divider" /></li>
                    <li className="dropdown-header text-muted small">Administración</li>
                    <li>
                      <NavLink className="dropdown-item" to="/adminJustifications">
                        <i className="bi bi-ui-checks-grid me-1" />
                        Administrar justificaciones
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item" to="/employeeProfiles">
                        <i className="bi bi-people me-1" />
                        Perfiles
                      </NavLink>
                    </li>
                  </>
                ) : null}

                <li><hr className="dropdown-divider" /></li>
                <li>
                  <a className="dropdown-item text-danger" href="#logout" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1" />
                    Cerrar sesión
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
