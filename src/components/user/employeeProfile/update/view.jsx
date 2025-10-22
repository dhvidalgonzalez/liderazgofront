import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEmployeeProfileService } from "src/services/admin/employeeProfile";

const View = ({ profile, onClose }) => {
  const [form, setForm] = useState({
    name: profile.name || "",
    rut: profile.rut || "",
    email: profile.email || "",
    sapCode: profile.sapCode || "",
    gerencia: profile.gerencia || "",
    empresa: profile.empresa || "",
    position: profile.position || "",
    startDate: profile.startDate ? profile.startDate.split("T")[0] : "",
    endDate: profile.endDate ? profile.endDate.split("T")[0] : "",
    isActive: profile.isActive ?? true,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }) => updateEmployeeProfileService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["employeeProfiles"]);
      onClose();
    },
    onError: (err) => {
      setError(err.message || "Error al actualizar el perfil.");
      setLoading(false);
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    setError("");

    if (!form.name.trim() || !form.rut.trim()) {
      setError("El nombre y el RUT son obligatorios.");
      return;
    }

    setLoading(true);
    mutation.mutate({
      id: profile.id,
      data: form,
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
            <h5 className="modal-title">Editar Perfil de Empleado</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">RUT</label>
                <input
                  type="text"
                  name="rut"
                  className="form-control"
                  value={form.rut}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Código SAP</label>
                <input
                  type="text"
                  name="sapCode"
                  className="form-control"
                  value={form.sapCode}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Gerencia</label>
                <input
                  type="text"
                  name="gerencia"
                  className="form-control"
                  value={form.gerencia}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Empresa</label>
                <input
                  type="text"
                  name="empresa"
                  className="form-control"
                  value={form.empresa}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Cargo / Posición</label>
                <input
                  type="text"
                  name="position"
                  className="form-control"
                  value={form.position}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Fecha Inicio</label>
                <input
                  type="date"
                  name="startDate"
                  className="form-control"
                  value={form.startDate}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Fecha Fin</label>
                <input
                  type="date"
                  name="endDate"
                  className="form-control"
                  value={form.endDate}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-3 d-flex align-items-end">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="isActive">
                    Activo
                  </label>
                </div>
              </div>
            </div>

            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
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
