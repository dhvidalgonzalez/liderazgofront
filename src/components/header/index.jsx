import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import plataformaNavbar from "src/assets/img/codelco/plataforma_navbar.png";
import logosNavbar from "src/assets/img/codelco/logos_navbar.png";
import logoUser from "src/assets/img/codelco/user.png";
import { useUser } from "../context/UserContext";


const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  console.log("🚀 ~ Header ~ user:", user)

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
    }
  };

  return (
    <nav className="navbar navbar-top fixed-top navbar-expand-lg bg-dark" id="navbarTop">
      <div className="navbar-logo">
        <Link className="navbar-brand me-1 me-sm-3" to="/home">
          <div className="d-flex align-items-center">
            <img src={plataformaNavbar} alt="phoenix" width="180" />
          </div>
        </Link>
      </div>

      <div
        className="collapse navbar-collapse navbar-top-collapse order-1 order-lg-0 justify-content-center"
        id="navbarTopCollapse"
      >
        <ul className="navbar-nav navbar-nav-top">
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
        </ul>
      </div>

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
            <div className="card position-relative border-0">
              <div className="card-body p-3">
                {user ? (
                  <>
                    <p className="fw-bold mb-0">{user.nombre}</p>
                    <p className="small text-muted mb-0">{user.rut}</p>
                  </>
                ) : (
                  <p className="text-muted mb-0">Usuario no identificado</p>
                )}
              </div>

              <div className="card-footer p-0 border-top border-translucent">
                <div className="px-3 py-2">
                  <button
                    className="btn btn-danger d-flex flex-center w-100"
                    onClick={handleLogout}
                  >
                    <span className="me-2" data-feather="log-out" />
                    Cerrar sesión
                  </button>
                </div>
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
