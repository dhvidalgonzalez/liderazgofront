// src/components/user/home/view.jsx
import React from "react";
import { Link } from "react-router-dom";

const View = () => {
  return (
    <>
      <div className="row mb-4">
        <div className="col">
          <h3 className="fw-bold">Panel de Justificaciones</h3>
        </div>
      </div>

      <div className="row g-4 justify-content-center">
        <div className="col-md-6 col-lg-5">
          <Link to="/createJustification" className="text-decoration-none">
            <div className="card shadow-lg h-100">
              <div className="card-body d-flex flex-column justify-content-center align-items-center text-center p-5">
                <i className="fas fa-file-alt fa-4x text-primary mb-3"></i>
                <h4 className="card-title fw-bold text-dark">
                  Ingresar Justificación
                </h4>
                <p className="card-text text-dark">
                  Registra una nueva justificación rápidamente.
                </p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-6 col-lg-5">
          <Link to="/myJustifications" className="text-decoration-none">
            <div className="card shadow-lg h-100">
              <div className="card-body d-flex flex-column justify-content-center align-items-center text-center p-5">
                <i className="fas fa-clipboard-list fa-4x mb-3 text-primary"></i>
                <h4 className="card-title fw-bold text-dark">
                  Mis Justificaciones
                </h4>
                <p className="card-text text-dark">
                  Revisa tus justificaciones ingresadas.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default View;
