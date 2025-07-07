import React from "react";

const typeMap = {
  VACATION: "Vacaciones",
  COMISION: "Comisión",
  ACTIVIDAD: "Actividad",
  MEDICAL: "Médica",
  LEGAL: "Legal",
  OTHER: "Otra",
};

const statusMap = {
  PENDING: "Pendiente",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
};

const View = ({ justification, onClose }) => {
  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Detalle de Justificación</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>
              <strong>Colaborador:</strong> {justification.employeeName || "—"}
            </p>
            <p>
              <strong>RUT:</strong> {justification.employeeRut || "—"}
            </p>
            <p>
              <strong>Email:</strong> {justification.employeeEmail || "—"}
            </p>
            <p>
              <strong>Código SAP:</strong>{" "}
              {justification.employeeSapCode || "—"}
            </p>
            {justification.employeeGerencia && (
              <p>
                <strong>Gerencia:</strong> {justification.employeeGerencia}
              </p>
            )}
            <p>
              <strong>Tipo:</strong>{" "}
              {typeMap[justification.type] || justification.type || "—"}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              {statusMap[justification.status] || justification.status || "—"}
            </p>
            <p>
              <strong>Descripción:</strong> {justification.description || "—"}
            </p>
            {justification.documentUrl && (
              <p>
                <strong>Documento:</strong>{" "}
                <a
                  href={justification.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver documento
                </a>
              </p>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-dark" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
