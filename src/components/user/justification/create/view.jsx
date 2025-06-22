import React, { useMemo, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import createJustificationService from "src/services/user/justification/create";

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
                  "gerencia",
                  "userId",
                  "startDate",
                  "endDate",
                  "type",
                  "description",
                ].map((key) => (
                  <p key={key}>
                    <strong>{key[0].toUpperCase() + key.slice(1)}:</strong>{" "}
                    {justification[key] || "—"}
                  </p>
                ))}
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

const validationSchema = Yup.object().shape({
  userId: Yup.string().required("Requerido"),
  type: Yup.string().required("Requerido"),
  startDate: Yup.date().required("Requerido"),
  endDate: Yup.date().required("Requerido"),
});

const View = ({ users = [] }) => {
  const [modal, setModal] = useState({ open: false, error: "", data: null });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [attachedFile, setAttachedFile] = useState(null);
  const [gerenciaFilter, setGerenciaFilter] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createJustificationService,
    onSuccess: () => {
      queryClient.invalidateQueries(["justifications"]);
      setAlert({
        type: "success",
        message: "Justificación ingresada correctamente.",
      });
    },
    onError: (err) => {
      setAlert({ type: "danger", message: err.message || "Error al guardar." });
    },
  });

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesGerencia = gerenciaFilter
        ? u.gerencia === gerenciaFilter
        : true;
      const matchesName = userSearch
        ? u.name.toLowerCase().includes(userSearch.toLowerCase())
        : true;
      return matchesGerencia && matchesName;
    });
  }, [users, gerenciaFilter, userSearch]);

  const handleModalSubmit = () => {
    if (modal.data) mutation.mutate(modal.data);
    setModal({ open: false, error: "", data: null });
    setAttachedFile(null);
  };

  return (
    <div className="container-fluid p-4">
      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      <Formik
        initialValues={{
          gerencia: "",
          userId: "",
          type: "",
          startDate: "",
          endDate: "",
          description: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { validateForm, setTouched }) => {
          const errors = await validateForm();
          console.log("🚀 ~ onSubmit={ ~ errors:", errors);
          if (Object.keys(errors).length > 0) {
            setTouched({
              gerencia: true,
              userId: true,
              type: true,
              startDate: true,
              endDate: true,
            });
            return;
          }

          const start = new Date(values.startDate);
          const end = new Date(values.endDate);
          const diff = (end - start) / (1000 * 60 * 60 * 24) + 1;

          if (start > end) {
            setModal({
              open: true,
              error: "La fecha inicio debe ser menor o igual a la de fin",
              data: null,
            });
            return;
          }

          if (values.type === "VACATION" && diff < 14) {
            setModal({
              open: true,
              error: "Vacaciones deben ser mínimo 14 días",
              data: null,
            });
            return;
          }

          if (values.type !== "VACATION" && diff < 2) {
            setModal({
              open: true,
              error: "Debe seleccionar más de 1 día",
              data: null,
            });
            return;
          }

          const { gerencia, ...payload } = values;
          setModal({
            open: true,
            error: "",
            data: { ...payload, file: attachedFile },
          });
        }}
      >
        {({ values, errors, touched }) => {
          const start = values.startDate ? new Date(values.startDate) : null;
          const end = values.endDate ? new Date(values.endDate) : null;

          const getDaysPerMonth = () => {
            if (!start || !end) return [];
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
            <Form>
              <div className="card shadow-sm">
                <div className="card-header border-bottom">
                  <h4 className="mb-0">Formulario de Justificación</h4>
                </div>
                <div className="card-body">
                  <div className="mb-4">
                    <h5>
                      <span className="badge bg-primary me-2">1</span>Datos del
                      Usuario
                    </h5>
                    <div className="row g-2 mb-2">
                      <div className="col-md-4">
                        <label className="form-label">Gerencia</label>
                        <select
                          className="form-select"
                          value={gerenciaFilter}
                          onChange={(e) => setGerenciaFilter(e.target.value)}
                        >
                          <option value="">Todas</option>
                          <option value="gerencia1">Gerencia 1</option>
                          <option value="gerencia2">Gerencia 2</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Buscar Usuario</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Nombre del usuario"
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Usuario</label>
                        <Field
                          as="select"
                          name="userId"
                          className="form-select"
                        >
                          <option value="">Seleccionar usuario</option>
                          {filteredUsers.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          ))}
                        </Field>
                        {errors.userId && touched.userId && (
                          <div className="text-danger small">
                            {errors.userId}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5>
                      <span className="badge bg-primary me-2">2</span>Datos de
                      la Justificación
                    </h5>
                    <div className="row g-2">
                      <div className="col-md-4">
                        <label className="form-label">Fecha Inicio</label>
                        <Field
                          type="date"
                          name="startDate"
                          className="form-control"
                        />
                        {errors.startDate && touched.startDate && (
                          <div className="text-danger small">
                            {errors.startDate}
                          </div>
                        )}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Fecha Fin</label>
                        <Field
                          type="date"
                          name="endDate"
                          className="form-control"
                        />
                        {errors.endDate && touched.endDate && (
                          <div className="text-danger small">
                            {errors.endDate}
                          </div>
                        )}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Tipo</label>
                        <Field as="select" name="type" className="form-select">
                          <option value="">Tipo Justificación</option>
                          <option value="VACATION">Vacaciones</option>
                          <option value="COMISION">
                            Comisión de servicios fuera de la división
                          </option>
                          <option value="ACTIVIDAD">
                            Actividades programadas fuera de la división
                          </option>
                          <option value="MEDICAL">
                            Licencias o restricciones médicas
                          </option>
                          <option value="LEGAL">Permisos legales</option>
                          <option value="OTHER">Otro</option>
                        </Field>
                        {errors.type && touched.type && (
                          <div className="text-danger small">{errors.type}</div>
                        )}
                      </div>
                    </div>

                    {start && end && (
                      <div className="mt-3">
                        <strong>
                          Este rango afectará los siguientes periodos:
                        </strong>
                        <div className="mt-2">
                          {getDaysPerMonth().map(([month, days]) => (
                            <span key={month} className="badge bg-info me-2">
                              {month}: {days} día{days > 1 ? "s" : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <h5>
                      <span className="badge bg-primary me-2">3</span>Datos
                      adicionales
                    </h5>
                    <div className="mb-3">
                      <Field
                        as="textarea"
                        name="description"
                        className="form-control"
                        rows="3"
                        placeholder="Descripción"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        Archivo adjunto (opcional)
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setAttachedFile(e.target.files[0])}
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <button type="submit" className="btn btn-primary px-5">
                      Enviar solicitud
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>

      {modal.open && (
        <JustificationModal
          justification={modal.data}
          error={modal.error}
          onClose={() => setModal({ open: false, error: "", data: null })}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default View;
