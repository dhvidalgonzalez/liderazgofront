import React from "react";
import bannerLogin from "src/assets/img/codelco/banner_login.png";
import logoDavte from "src/assets/img/codelco/davte.png";

const LoginBase = ({ children }) => {
  return (
    <div className="container-fluid bg-body-tertiary min-vh-100 d-flex align-items-center justify-content-center position-relative">
      {/* Fondo decorativo */}
      <div
        className="bg-holder position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundImage:
            "url('/assets/img/logos/codelco-completo-blanco.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          zIndex: 0,
          opacity: 0.03,
        }}
      />

      {/* Card principal */}
      <div
        className="card border-0 shadow-lg position-relative w-100"
        style={{ zIndex: 1, maxWidth: 1000 }}
      >
        <div className="row g-0">
          {/* Columna izquierda: título institucional */}
          <div className="col-md-6 bg-light d-none d-md-flex flex-column justify-content-center align-items-center p-4 rounded-start  bg-dark">
            <div className="text-center">
              <img
                src={bannerLogin}
                alt="CODELCO El Teniente"
                className="img-fluid"
                style={{ maxHeight: 500 }}
              />
            </div>
          </div>

          {/* Columna derecha: contenido dinámico */}
          <div className="col-md-6 d-flex flex-column justify-content-center align-items-center p-5">
            <div style={{ width: "100%", maxWidth: 360 }}>
              <div className="text-center">
                <h6
                  className="text-uppercase text-muted mb-1"
                  style={{ fontSize: 18, letterSpacing: "1px" }}
                >
                  Justificaciones Plan de
                </h6>
                <h2
                  className="text-dark fw-bold text-uppercase mb-4"
                  style={{ fontSize: 40 }}
                >
                  Liderazgo
                </h2>
              </div>

              {children}
              <div className="text-center mt-5">
                <img
                  src={logoDavte}
                  alt="DATE"
                  style={{ height: 64 }}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginBase;
