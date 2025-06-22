// src/components/common/Menu.jsx
import React from "react";
import { Link } from "react-router-dom";

const Menu = () => {
  return (
    <nav className="navbar navbar-vertical navbar-expand-lg">
      <div className="collapse navbar-collapse" id="navbarVerticalCollapse">
        <div className="navbar-vertical-content">
          <ul className="navbar-nav flex-column" id="navbarVerticalNav">
            <li className="nav-item">
              <p className="navbar-vertical-label">Menú</p>
              <hr className="navbar-vertical-line" />

              <div className="nav-item-wrapper">
                <Link className="nav-link label-1" to="/home">
                  <div className="d-flex align-items-center">
                    <span className="nav-link-icon">
                      <i className="fas fa-home" />
                    </span>
                    <span className="nav-link-text-wrapper">
                      <span className="nav-link-text">Inicio</span>
                    </span>
                  </div>
                </Link>
              </div>

              <div className="nav-item-wrapper">
                <Link className="nav-link label-1" to="/createJustification">
                  <div className="d-flex align-items-center">
                    <span className="nav-link-icon">
                      <i className="fas fa-plus-circle" />
                    </span>
                    <span className="nav-link-text-wrapper">
                      <span className="nav-link-text">Crear Justificación</span>
                    </span>
                  </div>
                </Link>
              </div>

              <div className="nav-item-wrapper">
                <Link className="nav-link label-1" to="/myJustifications">
                  <div className="d-flex align-items-center">
                    <span className="nav-link-icon">
                      <i className="fas fa-list" />
                    </span>
                    <span className="nav-link-text-wrapper">
                      <span className="nav-link-text">Mis Justificaciones</span>
                    </span>
                  </div>
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="navbar-vertical-footer">
        <button className="btn navbar-vertical-toggle border-0 fw-semibold w-100 white-space-nowrap d-flex align-items-center">
          <span className="uil uil-left-arrow-to-left fs-8" />
          <span className="uil uil-arrow-from-right fs-8" />
          <span className="navbar-vertical-footer-text ms-2">
            Colapsar menú
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Menu;
