import React from "react";
import ReactDOM from "react-dom";
import { Formik } from "formik";
import * as Yup from "yup";

const EmployeeProfileModal = ({ open, onClose, initialData, onSave }) => {

  if (!open) return null;

  // ✅ Validación Yup (correo y fecha de término ahora opcionales)
  const validationSchema = Yup.object({
    name: Yup.string().required("Nombre requerido"),
    rut: Yup.string().required("RUT requerido"),
    email: Yup.string().email("Email inválido").nullable().optional(),
    startDate: Yup.date().required("Fecha de inicio requerida"),
    endDate: Yup.date()
      .nullable()
      .optional()
      .min(
        Yup.ref("startDate"),
        "La fecha de término no puede ser anterior a la de inicio"
      ),
  });

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
                rut: initialData?.rut || "",
                email: initialData?.email || "",
                sapCode: initialData?.sapCode || "",
                gerencia: initialData?.gerencia || "",
                empresa: initialData?.empresa || "",
                position: initialData?.position || "",
                startDate: initialData?.startDate || "",
                endDate: initialData?.endDate || "",
                isActive: initialData?.isActive ?? true,
              }}
              validationSchema={validationSchema}
              enableReinitialize
              onSubmit={(values) => onSave(values)}
            >
              {({ values, errors, touched, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <div className="modal-header bg-success text-white">
                    <h5 className="modal-title mb-0">
                      {initialData?.isNew ? "Nuevo Perfil" : "Perfil del Empleado"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={onClose}
                    ></button>
                  </div>

                  <div className="modal-body">
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
                          value={values.startDate}
                          onChange={handleChange}
                          className="form-control"
                        />
                        {touched.startDate && errors.startDate && (
                          <div className="text-danger small">{errors.startDate}</div>
                        )}
                      </div>

                      <div className="col-md-3">
                        <label className="form-label">Fecha de Término (opcional)</label>
                        <input
                          type="date"
                          name="endDate"
                          value={values.endDate}
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
                            checked={values.isActive}
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <label
                            htmlFor="isActive"
                            className="form-check-label user-select-none"
                          >
                            Activo
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={onClose}
                    >
                      Cerrar
                    </button>
                    <button type="submit" className="btn btn-success px-4">
                      Guardar
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
