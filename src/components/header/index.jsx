import React from "react";
import { Link, NavLink } from "react-router-dom";
import plataformaNavbar from "src/assets/img/codelco/plataforma_navbar.png";
import logosNavbar from "src/assets/img/codelco/logos_navbar.png";
import logoUser from "src/assets/img/codelco/user.png";

const Header = () => {
  return (
    <nav
      className="navbar navbar-top fixed-top navbar-expand-lg bg-dark"
      id="navbarTop"
    >
      <div className="navbar-logo">
        <button
          className="btn navbar-toggler navbar-toggler-humburger-icon hover-bg-transparent"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTopCollapse"
          aria-controls="navbarTopCollapse"
          aria-expanded="false"
          aria-label="Toggle Navigation"
        >
          <span className="navbar-toggle-icon">
            <span className="toggle-line" />
          </span>
        </button>
        <Link className="navbar-brand me-1 me-sm-3" to={"/home"}>
          <div className="d-flex align-items-center">
            <img src={plataformaNavbar} alt="phoenix" width="180" />
          </div>
        </Link>
      </div>

      <div
        className="collapse navbar-collapse navbar-top-collapse order-1 order-lg-0 justify-content-center"
        id="navbarTopCollapse"
      >
        <ul
          className="navbar-nav navbar-nav-top"
          data-dropdown-on-hover="data-dropdown-on-hover"
        >
          <li className="nav-item">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `nav-link text-white lh-1 ${
                  isActive ? "fw-bold bg-primary" : ""
                }`
              }
            >
              Inicio
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/createJustification"
              className={({ isActive }) =>
                `nav-link text-white lh-1 ${
                  isActive ? "fw-bold bg-primary" : ""
                }`
              }
            >
              Crear Justificación
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/myJustifications"
              className={({ isActive }) =>
                `nav-link text-white lh-1 ${
                  isActive ? "fw-bold bg-primary " : ""
                }`
              }
            >
              Mis Justificaciones
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/adminJustifications"
              className={({ isActive }) =>
                `nav-link text-white lh-1 ${
                  isActive ? "fw-bold bg-primary " : ""
                }`
              }
            >
              Administrar Justificaciones
            </NavLink>
          </li>
        </ul>
      </div>

      <ul className="navbar-nav navbar-nav-icons flex-row">
        <li className="nav-item">
          <a
            className="nav-link"
            href="#"
            data-bs-toggle="modal"
            data-bs-target="#searchBoxModal"
          >
            <span
              data-feather="search"
              style={{ height: 19, width: 19, marginBottom: 2 }}
            />
          </a>
        </li>

        <li className="nav-item dropdown mx-4">
          <a
            className="nav-link lh-1 pe-0"
            id="navbarDropdownUser"
            href="#!"
            role="button"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
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
              <div className="card-body p-0">
                <div className="text-center pt-4 pb-3">
                  <div className="avatar avatar-xl">
                    <img className="rounded-circle" src={logoUser} alt="User" />
                  </div>
                  <h6 className="mt-2 text-body-emphasis">Jerry Seinfield</h6>
                </div>
                <div className="mb-3 mx-3">
                  <input
                    className="form-control form-control-sm"
                    id="statusUpdateInput"
                    type="text"
                    placeholder="Update your status"
                  />
                </div>
              </div>
              <div
                className="overflow-auto scrollbar"
                style={{ height: "10rem" }}
              >
                <ul className="nav d-flex flex-column mb-2 pb-1">
                  <li className="nav-item">
                    <a className="nav-link px-3 d-block" href="#!">
                      <span
                        className="me-2 text-body align-bottom"
                        data-feather="user"
                      />
                      <span>Profile</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link px-3 d-block" href="#!">
                      <span
                        className="me-2 text-body align-bottom"
                        data-feather="pie-chart"
                      />
                      Dashboard
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link px-3 d-block" href="#!">
                      <span
                        className="me-2 text-body align-bottom"
                        data-feather="lock"
                      />
                      Posts & Activity
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link px-3 d-block" href="#!">
                      <span
                        className="me-2 text-body align-bottom"
                        data-feather="settings"
                      />
                      Settings & Privacy
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link px-3 d-block" href="#!">
                      <span
                        className="me-2 text-body align-bottom"
                        data-feather="help-circle"
                      />
                      Help Center
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link px-3 d-block" href="#!">
                      <span
                        className="me-2 text-body align-bottom"
                        data-feather="globe"
                      />
                      Language
                    </a>
                  </li>
                </ul>
              </div>
              <div className="card-footer p-0 border-top border-translucent">
                <ul className="nav d-flex flex-column my-3">
                  <li className="nav-item">
                    <a className="nav-link px-3 d-block" href="#!">
                      <span
                        className="me-2 text-body align-bottom"
                        data-feather="user-plus"
                      />
                      Add another account
                    </a>
                  </li>
                </ul>
                <hr />
                <div className="px-3">
                  <a
                    className="btn btn-phoenix-secondary d-flex flex-center w-100"
                    href="#!"
                  >
                    <span className="me-2" data-feather="log-out" />
                    Sign out
                  </a>
                </div>
                <div className="my-2 text-center fw-bold fs-10 text-body-quaternary">
                  <a className="text-body-quaternary me-1" href="#!">
                    Privacy policy
                  </a>
                  •
                  <a className="text-body-quaternary mx-1" href="#!">
                    Terms
                  </a>
                  •
                  <a className="text-body-quaternary ms-1" href="#!">
                    Cookies
                  </a>
                </div>
              </div>
            </div>
          </div>
        </li>

        <li className="nav-item">
          <div className="">
            <img className="" src={logosNavbar} width="100" alt="Logos" />
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
