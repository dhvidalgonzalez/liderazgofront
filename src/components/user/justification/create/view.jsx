import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import createJustificationService from "src/services/user/justification/create";
import listTrabajadoresService from "src/services/trabajador/listTrabajadores";
import listGerenciasService from "src/services/trabajador/listGerencias";
import listEmpresasService from "src/services/trabajador/listEmpresas";
import { justificationTypes } from "src/constants";
import { useUser } from "src/components/context/UserContext";
import JustificationModal from "./JustificationModal";

const validationSchema = Yup.object().shape({
  userId: Yup.string().required("Requerido"),
  type: Yup.string().required("Requerido"),
  startDate: Yup.date().required("Requerido"),
  endDate: Yup.date().required("Requerido"),
});

const View = () => {
  const { user } = useUser();
  const [modal, setModal] = useState({ open: false, error: "", data: null });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [attachedFile, setAttachedFile] = useState(null);
  const [gerenciaFilter, setGerenciaFilter] = useState("");
  const [empresaFilter, setEmpresaFilter] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [debouncedSearch] = useDebounce(userSearch, 400);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createJustificationService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["justifications"] });
      setAlert({
        type: "success",
        message: "Justificación ingresada correctamente.",
      });
    },
    onError: (err) => {
      setAlert({ type: "danger", message: err.message || "Error al guardar." });
    },
  });

  const { data: gerencias = [] } = useQuery({
    queryKey: ["gerencias"],
    queryFn: listGerenciasService,
  });

  const { data: empresas = [] } = useQuery({
    queryKey: ["empresas"],
    queryFn: listEmpresasService,
  });

// Después: permite buscar sin filtro de gerencia/empresa
const shouldFetchTrabajadores = debouncedSearch.length >= 4;

const { data: trabajadores = [] } = useQuery({
  queryKey: ["trabajadores", gerenciaFilter, empresaFilter, debouncedSearch],
  queryFn: () =>
    listTrabajadoresService({
      // Aplica solo si existen
      ...(gerenciaFilter ? { gerencia: gerenciaFilter } : {}),
      ...(empresaFilter ? { empresa: empresaFilter } : {}),
      // Siempre aplica si hay búsqueda
      ...(debouncedSearch ? { nombre: debouncedSearch } : {}),
    }),
  enabled: shouldFetchTrabajadores,
  keepPreviousData: true,
});
  console.log("🚀 ~ View ~ trabajadores:", trabajadores)

  const handleModalSubmit = () => {
    if (!modal.data) return;
    mutation.mutate({ ...modal.data, file: attachedFile });
    setModal({ open: false, error: "", data: null });
    setAttachedFile(null);
  };




  return (
    <div className="container-fluid p-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-10">
          {alert.message && (
            <div className={`alert alert-${alert.type}`} role="alert">
              {alert.message}
            </div>
          )}

          <Formik
            initialValues={{
              userId: "",
              employeeNombre: "",
              employeeRut: "",
              employeeEmail: "",
              employeeSapCode: "",
              employeeGerencia: "",
              type: "",
              startDate: "",
              endDate: "",
              description: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { validateForm, setTouched }) => {
              const errors = await validateForm();
              if (Object.keys(errors).length > 0) {
                setTouched({ userId: true, type: true, startDate: true, endDate: true });
                return;
              }

              const start = new Date(values.startDate);
              const end = new Date(values.endDate);
              const diff = (end - start) / (1000 * 60 * 60 * 24) + 1;

              if (start > end) {
                setModal({ open: true, error: "La fecha inicio debe ser menor o igual a la de fin", data: null });
                return;
              }

              if (values.type === "VACATION" && diff < 14) {
                setModal({ open: true, error: "Vacaciones deben ser mínimo 14 días", data: null });
                return;
              }

              if (values.type !== "VACATION" && diff < 2) {
                setModal({ open: true, error: "Debe seleccionar más de 1 día", data: null });
                return;
              }

              const { userId, ...justificationData } = values;
              setModal({
                open: true,
                error: "",
                data: {
                  ...justificationData,
                  file: attachedFile,
                  creatorId: user.id,
                },
              });
            }}
          >
            {({ values, errors, touched, setFieldValue }) => {
              const start = values.startDate ? new Date(values.startDate) : null;
              const end = values.endDate ? new Date(values.endDate) : null;
              const getDaysPerMonth = () => {
                if (!start || !end) return [];
                const map = new Map();
                let current = new Date(start);
                while (current <= end) {
                  const key = current.toLocaleDateString("es-CL", { month: "long", year: "numeric" });
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
                      <div className="row g-2 mb-2">
                        <div className="col-md-4">
                          <label className="form-label">Gerencia</label>
                          <select className="form-select" value={gerenciaFilter} onChange={(e) => setGerenciaFilter(e.target.value)}>
                            <option value="">Todas</option>
                            {gerencias.map((g) => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Empresa</label>
                          <select className="form-select" value={empresaFilter} onChange={(e) => setEmpresaFilter(e.target.value)}>
                            <option value="">Todas</option>
                            {empresas.map((e) => (
                              <option key={e} value={e}>{e}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Buscar Trabajador</label>
                          <input type="text" className="form-control" placeholder="Nombre o RUT" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
                        </div>
                      </div>

                      <div className="row g-2 mb-2">
                        <div className="col-md-12">
                          <label className="form-label">Trabajador</label>
                          <Field
                            as="select"
                            name="userId"
                            className="form-select"
                            onChange={(e) => {
                              const selectedId = e.target.value;
                              setFieldValue("userId", selectedId);
                              const selected = trabajadores.find((u) => u.RutCorregido?.toString() === selectedId);
                              if (selected) {
                                setFieldValue("employeeNombre", selected.Nombre || "");
                                setFieldValue("employeeRut", selected.Rut || "");
                                setFieldValue("employeeEmail", selected.Email || "");
                                setFieldValue("employeeSapCode", selected.Sap || "");
                                setFieldValue("employeeGerencia", selected.Gerencia || "");
                                setFieldValue("employeeEmpresa", selected.Empresa || "");
                              }
                            }}
                          >
                            <option value="">Seleccionar trabajador</option>
                            {trabajadores.map((user) => (
                              <option key={user.RutCorregido} value={user.RutCorregido}>
                                {user.Nombre}  {user.Rut}
                              </option>
                            ))}
                          </Field>

                          {errors.userId && touched.userId && (
                            <div className="text-danger small">{errors.userId}</div>
                          )}
                        </div>
                      </div>

                      <div className="row g-2 mt-3">
                        <div className="col-md-4">
                          <label className="form-label">Nombre</label>
                          <Field type="text" name="employeeNombre" className="form-control" readOnly />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">RUT</label>
                          <Field type="text" name="employeeRut" className="form-control" readOnly />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Email</label>
                          <Field type="text" name="employeeEmail" className="form-control" readOnly />
                        </div>
                      </div>

                      <div className="row g-2 mt-1">
                        <div className="col-md-4">
                          <label className="form-label">SAP</label>
                          <Field type="text" name="employeeSap" className="form-control" readOnly />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Gerencia</label>
                          <Field type="text" name="employeeGerencia" className="form-control" readOnly />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Empresa</label>
                          <Field type="text" name="employeeEmpresa" className="form-control" readOnly />
                        </div>
                      </div>


                      <div className="row g-2 mt-3">
                        <div className="col-md-4">
                          <label className="form-label">Fecha Inicio</label>
                          <Field type="date" name="startDate" className="form-control" />
                          {errors.startDate && touched.startDate && (
                            <div className="text-danger small">{errors.startDate}</div>
                          )}
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Fecha Fin</label>
                          <Field type="date" name="endDate" className="form-control" />
                          {errors.endDate && touched.endDate && (
                            <div className="text-danger small">{errors.endDate}</div>
                          )}
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Tipo</label>
                          <Field as="select" name="type" className="form-select">
                            <option value="">Tipo Justificación</option>
                            {Object.entries(justificationTypes).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </Field>
                          {errors.type && touched.type && (
                            <div className="text-danger small">{errors.type}</div>
                          )}
                        </div>
                      </div>

                      {start && end && (
                        <div className="mt-3">
                          <strong>Este rango afectará los siguientes periodos:</strong>
                          <div className="mt-2">
                            {getDaysPerMonth().map(([month, days]) => (
                              <span key={month} className="badge bg-info me-2">
                                {month}: {days} día{days > 1 ? "s" : ""}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-3 mt-4">
                        <Field as="textarea" name="description" className="form-control" rows="3" placeholder="Descripción" />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Archivo adjunto (opcional)</label>
                        <input type="file" className="form-control" onChange={(e) => setAttachedFile(e.target.files[0])} />
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
      </div>
    </div>
  );
};

export default View;
