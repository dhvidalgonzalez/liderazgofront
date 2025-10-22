import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateJustificationStatusService from "src/services/admin/justification/update";

const View = ({ justification, onClose }) => {
  const [status, setStatus] = useState(justification.status);
  const [reviewerCause, setReviewerCause] = useState(
    justification.reviewerCause || ""
  );
  const [reviewerComment, setReviewerComment] = useState(
    justification.reviewerComment || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, status, reviewerCause, reviewerComment }) =>
      updateJustificationStatusService(id, {
        status,
        reviewerCause,
        reviewerComment,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["justifications"]);
      onClose();
    },
    onError: (err) => {
      setError(err.message || "Error al actualizar el estado.");
      setLoading(false);
    },
  });

  const handleUpdate = () => {
    if (status === "REJECTED" && !reviewerCause.trim()) {
      setError("Debe ingresar una causa si rechaza la justificación.");
      return;
    }

    setError("");
    setLoading(true);
    mutation.mutate({
      id: justification.id,
      status,
      reviewerCause,
      reviewerComment,
    });
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
            <h5 className="modal-title">Actualizar Justificación</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>
              <strong>Colaborador:</strong> {justification.employeeNombre}
            </p>
            <p>
              <strong>RUT:</strong> {justification.employeeRut}
            </p>
            <p>
              <strong>Tipo:</strong> {justification.type}
            </p>
            <p>
              <strong>Estado actual:</strong> {justification.status}
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
                  Descargar
                </a>
              </p>
            )}

            <div className="mt-3">
              <label className="form-label">Nuevo estado</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="PENDING">Pendiente</option>
                <option value="APPROVED">Aprobado</option>
                <option value="REJECTED">Rechazado</option>
              </select>
            </div>

            <div className="mt-3">
              <label className="form-label">Causa del revisor (opcional)</label>
              <input
                type="text"
                className="form-control"
                value={reviewerCause}
                onChange={(e) => setReviewerCause(e.target.value)}
                placeholder="Ingrese una causa o razón"
              />
            </div>

            <div className="mt-3">
              <label className="form-label">
                Observaciones del revisor (opcional)
              </label>
              <textarea
                className="form-control"
                rows="3"
                value={reviewerComment}
                onChange={(e) => setReviewerComment(e.target.value)}
                placeholder="Comentarios adicionales..."
              />
            </div>

            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
