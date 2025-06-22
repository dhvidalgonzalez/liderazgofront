import React from "react";
import logoCodelco from "src/assets/img/codelco/logo.png";
import logoDavte from "src/assets/img/codelco/davte.png";
import "./LoginBase.css";

const LoginBase = ({ children }) => {
  return (
    <div className="login-page bg-light d-flex flex-column min-vh-100">
      {/* Header con título y logo */}
      <div
        className="login-header bg-primary d-flex justify-content-between align-items-center px-4"
        style={{ height: "100px" }}
      >
        <div className="text-white fw-bold">
          <div style={{ fontSize: "18px", lineHeight: "1.2" }}>
            JUSTIFICACIONES PLAN DE
          </div>
          <div style={{ fontSize: "30px", lineHeight: "1" }}>
            <span className="fw-bolder">LIDERAZGO</span>
          </div>
        </div>
        <img src={logoCodelco} alt="CODELCO El Teniente" height="60" />
      </div>

      {/* Contenido central */}
      <div className="flex-fill d-flex justify-content-center align-items-center">
        <div
          className="login-box bg-white p-4 rounded shadow"
          style={{ minWidth: 350, maxWidth: 420 }}
        >
          <h3 className="text-center mb-4 fw-bold">Iniciar Sesión</h3>
          {children}
        </div>
      </div>

      {/* Footer con logo de DATE */}
      <div className="text-center pb-3">
        <small>Desarrollado por</small>
        <br />
        <img
          src={logoDavte}
          alt="Desarrollado por DATE"
          style={{ height: 28, marginTop: 4 }}
        />
      </div>
    </div>
  );
};

export default LoginBase;
