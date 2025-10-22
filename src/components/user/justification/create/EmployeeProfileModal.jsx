// src/components/admin/employeeProfile/EmployeeProfileModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  getEmployeeProfileService,
  createEmployeeProfileService,
  updateEmployeeProfileService,
  // upsertEmployeeProfileByRutService, // opcional
} from "src/services/admin/employeeProfile";


const toDateInputFormat = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};


const EmployeeProfileModal = ({ open, onClose, initialData, onSave }) => {
  if (!open) return null;

  const normalizeRut = (rut) =>
    rut ? rut.toString().replace(/\./g, "").replace(/-/g, "-").trim().toUpperCase() : "";

  const validationSchema = Yup.object({
    name: Yup.string().required("Nombre requerido"),
    rut: Yup.string().required("RUT requerido"),
    email: Yup.string().email("Email inválido").nullable().optional(),
    startDate: Yup.date().required("Fecha de inicio requerida"),
    endDate: Yup.date()
      .nullable()
      .optional()
      .min(Yup.ref("startDate"), "La fecha de término no puede ser anterior a la de inicio"),
  });

  const todayISO = () => new Date().toISOString().split("T")[0];
  const withDefaultDates = (values) => {
    const startDate = values.startDate || todayISO();
    const endDate = values.endDate || "2099-12-31";
    return { ...values, startDate, endDate };
  };

  // 🔎 pre-chequeo de existencia al abrir
  const [checking, setChecking] = useState(false);
  const [exists, setExists] = useState(false);
  const [existingId, setExistingId] = useState(null);
  const [checkError, setCheckError] = useState(null);

  const rutNormFromInit = useMemo(() => normalizeRut(initialData?.rut || ""), [initialData?.rut]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!open || !rutNormFromInit) return;
      try {
        setChecking(true);
        setCheckError(null);
        const { exists, profile } = await getEmployeeProfileService(rutNormFromInit);
        if (!active) return;
        setExists(!!exists);
        setExistingId(profile?.id || null);
      } catch (e) {
        if (!active) return;
        setExists(false);
        setExistingId(null);
        setCheckError(
          e?.response?.data?.message || e?.message || "No se pudo verificar el perfil."
        );
      } finally {
        if (active) setChecking(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [open, rutNormFromInit]);

  // Modo update si: ya existe O viene forzado desde initialData
  const isUpdateMode =
    exists ||
    initialData?.mode === "update" ||
    initialData?.isUpdate === true ||
    initialData?.isNew === false;

  return ReactDOM.createPortal(
    <>
      <div className="modal-backdrop fade show"></div>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1055 }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content shadow border-0">
            <Formik
              initialValues={{
                name: initialData?.name || "",
                rut: rutNormFromInit || "",
                email: initialData?.email || "",
                sapCode: initialData?.sapCode || "",
                gerencia: initialData?.gerencia || "",
                empresa: initialData?.empresa || "",
                position: initialData?.position || "",
                startDate: toDateInputFormat(initialData?.startDate),
                endDate: toDateInputFormat(initialData?.endDate),
                isActive: initialData?.isActive ?? true,
              }}

              validationSchema={validationSchema}
              enableReinitialize
              onSubmit={async (rawValues, { setSubmitting, setStatus }) => {
                try {
                  setSubmitting(true);
                  setStatus(null);

                  const rutNorm = normalizeRut(rawValues.rut);
                  const values = withDefaultDates({ ...rawValues, rut: rutNorm });

                  // ⚡ ya sabemos si existe o no (sin GET extra)
                  if (isUpdateMode && existingId) {
                    await updateEmployeeProfileService(existingId, values);
                    setStatus({ type: "success", msg: "Perfil actualizado correctamente." });
                  } else if (isUpdateMode && !existingId) {
                    // Edge: flagged update pero no hubo ID (ej: error al chequear)
                    // Intentamos crear para no bloquear el flujo
                    await createEmployeeProfileService(values);
                    setStatus({ type: "success", msg: "Perfil creado correctamente." });
                  } else {
                    await createEmployeeProfileService(values);
                    setStatus({ type: "success", msg: "Perfil creado correctamente." });
                  }

                  onSave?.(values);
                  setTimeout(() => onClose(), 600);
                } catch (err) {
                  console.error("❌ Error guardando perfil:", err);
                  const msg =
                    err?.response?.data?.message || err?.message || "Error al guardar perfil.";
                  setStatus({ type: "danger", msg });
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ values, errors, touched, handleChange, handleSubmit, isSubmitting, status }) => (
                <form onSubmit={handleSubmit}>
                  <div className="modal-header">
                    <h5 className="modal-title mb-0">
                      {isUpdateMode ? "Perfil del Empleado (actualización)" : "Nuevo Perfil"}
                      <span className="ms-2">
                        {checking ? (
                          <span className="badge bg-secondary">Verificando…</span>
                        ) : exists ? (
                          <span className="badge bg-info text-dark">Existe</span>
                        ) : (
                          <span className="badge bg-success">Nuevo</span>
                        )}
                      </span>
                    </h5>
                    <button type="button" className="btn-close" onClick={onClose}></button>
                  </div>

                  <div className="modal-body">
                    {checkError && (
                      <div className="alert alert-warning py-2 mb-3">
                        {checkError} — puedes continuar y guardar igualmente.
                      </div>
                    )}

                    {status && (
                      <div className={`alert alert-${status.type}`} role="alert">
                        {status.msg}
                      </div>
                    )}

                    <div className="row g-3">
                      {/* === Fila 1 === */}
                      <div className="col-md-6">
                        <label className="form-label">Nombre</label>
                        <input
                          type="text"
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          className="form-control"
                        />
                        {touched.name && errors.name && (
                          <div className="text-danger small">{errors.name}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">RUT</label>
                        <input
                          type="text"
                          name="rut"
                          value={values.rut}
                          readOnly
                          className="form-control"
                        />
                      </div>

                      {/* === Fila 2 === */}
                      <div className="col-md-6">
                        <label className="form-label">Email (opcional)</label>
                        <input
                          type="email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="correo@empresa.cl"
                        />
                        {touched.email && errors.email && (
                          <div className="text-danger small">{errors.email}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Código SAP</label>
                        <input
                          type="text"
                          name="sapCode"
                          value={values.sapCode}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>

                      {/* === Fila 3 === */}
                      <div className="col-md-6">
                        <label className="form-label">Gerencia</label>
                        <input
                          type="text"
                          name="gerencia"
                          value={values.gerencia}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Empresa</label>
                        <input
                          type="text"
                          name="empresa"
                          value={values.empresa}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>

                      {/* === Fila 4 === */}
                      <div className="col-md-6">
                        <label className="form-label">Cargo</label>
                        <input
                          type="text"
                          name="position"
                          value={values.position}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>

                      <div className="col-md-3">
                        <label className="form-label">Fecha de Inicio</label>
                        <input
                          type="date"
                          name="startDate"
                          value={values.startDate || ""}
                          onChange={handleChange}
                          className="form-control"
                        />
                        {touched.startDate && errors.startDate && (
                          <div className="text-danger small">{errors.startDate}</div>
                        )}
                      </div>

                      <div className="col-md-3">
                        <label className="form-label">Fecha de Término</label>
                        <input
                          type="date"
                          name="endDate"
                          value={values.endDate || ""}
                          onChange={handleChange}
                          className="form-control"
                        />
                        {touched.endDate && errors.endDate && (
                          <div className="text-danger small">{errors.endDate}</div>
                        )}
                      </div>

                      {/* === Fila 5 === */}
                      <div className="col-md-3 d-flex align-items-center">
                        <div className="form-check mt-4">
                          <input
                            type="checkbox"
                            name="isActive"
                            id="isActive"
                            checked={!!values.isActive}
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <label htmlFor="isActive" className="form-check-label user-select-none">
                            Activo
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                      Cerrar
                    </button>
                    <button type="submit" className="btn btn-success px-4" disabled={isSubmitting}>
                      {isSubmitting ? "Guardando..." : "Guardar"}
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default EmployeeProfileModal;
