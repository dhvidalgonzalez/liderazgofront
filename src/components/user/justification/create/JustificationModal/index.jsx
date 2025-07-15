
import { justificationTypes } from "src/constants";


const JustificationModal = ({ justification, error, onClose, onSubmit }) => {
  const { startDate, endDate } = justification || {};
  const start = new Date(startDate);
  const end = new Date(endDate);

  const getDaysPerMonth = (start, end) => {
    const map = new Map();
    let current = new Date(start);
    while (current <= end) {
      const key = current.toLocaleDateString("es-CL", {
        month: "long",
        year: "numeric",
      });
      map.set(key, (map.get(key) || 0) + 1);
      current.setDate(current.getDate() + 1);
    }
    return Array.from(map.entries());
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {error
                ? "Error en la justificación"
                : "Resumen de la Justificación"}
            </h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <>
                {[
                  "employeeNombre",
                  "employeeRut",
                  "employeeEmail",
                  "startDate",
                  "endDate",
                  "type",
                  "description",
                ].map((key) => {
                  const labels = {
                    employeeNombre: "Nombre",
                    employeeRut: "RUT",
                    employeeEmail: "Email",
                    startDate: "Fecha de inicio",
                    endDate: "Fecha de término",
                    type: "Tipo",
                    description: "Descripción",
                  };
                  return (
                    <p key={key}>
                      <strong>{labels[key] || key}:</strong>{" "}
                      {key === "type"
                        ? justificationTypes[justification[key]] || "—"
                        : justification[key] || "—"}
                    </p>
                  );
                })}
                {justification.file && (
                  <p>
                    <strong>Archivo adjunto:</strong> {justification.file.name}
                  </p>
                )}
                <hr />
                <strong>Este rango afectará los siguientes periodos:</strong>
                <div className="mt-2">
                  {getDaysPerMonth(start, end).map(([month, days]) => (
                    <span key={month} className="badge bg-info me-2 mb-2">
                      {month}: {days} día{days > 1 ? "s" : ""}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
            {!error && (
              <button className="btn btn-primary" onClick={onSubmit}>
                Enviar Justificación
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default JustificationModal;