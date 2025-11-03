import React from "react";
// 👇 Usa el servicio de ADMIN que mencionaste
// (si tu ruta difiere, ajusta el import sin cambiar el resto)
import downloadJustificationDocument from "src/services/admin/justification/downloadJustificationDocument";

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
  const handleDownload = async () => {
    try {
      // base del nombre de archivo
      const base = `justificacion_${(justification.employeeRut || "rut")
        .replace(/\./g, "")
        .replace(/[^a-zA-Z0-9_-]/g, "")}_${(justification.type || "doc")
        .toString()
        .toLowerCase()}`;

      // Hints: prioriza documentMime; si no, intenta inferir la extensión del documentUrl
      const hintMime = justification.documentMime || "";
      let hintExt = "";
      if (!hintMime && justification.documentUrl) {
        const m = String(justification.documentUrl).match(/\.([a-z0-9]{2,5})(?:\?|#|$)/i);
        hintExt = m ? m[1] : "";
      }

      await downloadJustificationDocument(justification.id, base, {
        hintMime,
        hintExt,
      });
    } catch (err) {
      console.error(err);
      alert(err.message || "No fue posible descargar el documento.");
    }
  };

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
            <p><strong>Colaborador:</strong> {justification.employeeNombre || "—"}</p>
            <p><strong>RUT:</strong> {justification.employeeRut || "—"}</p>
            <p><strong>Email:</strong> {justification.employeeEmail || "—"}</p>
            <p><strong>Código SAP:</strong> {justification.employeeSapCode || "—"}</p>
            {justification.employeeGerencia && (
              <p><strong>Gerencia:</strong> {justification.employeeGerencia}</p>
            )}
            <p><strong>Tipo:</strong> {typeMap[justification.type] || justification.type || "—"}</p>
            <p><strong>Estado:</strong> {statusMap[justification.status] || justification.status || "—"}</p>
            <p><strong>Descripción:</strong> {justification.description || "—"}</p>

            {(justification.documentUrl || justification.documentFilename) ? (
              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-outline-primary" onClick={handleDownload}>
                  Descargar documento
                </button>
                <span className="text-muted small">(Se valida el archivo antes de servirlo)</span>
              </div>
            ) : (
              <p className="text-muted"><em>Sin documento adjunto</em></p>
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
