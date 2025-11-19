import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import createJustificationService from "src/services/user/justification/create";
import listTrabajadoresService from "src/services/trabajador/listTrabajadores";
import listGerenciasService from "src/services/trabajador/listGerencias";
import listEmpresasService from "src/services/trabajador/listEmpresas";
import {
  getEmployeeProfileService,
  createEmployeeProfileService,
  updateEmployeeProfileService,
} from "src/services/admin/employeeProfile";

import { justificationTypes } from "src/constants";
import { useUser } from "src/components/context/UserContext";
import JustificationModal from "./JustificationModal";
import EmployeeProfileModal from "./EmployeeProfileModal";

/* ==================== HELPERS ==================== */
const formatRut = (rut) => {
  if (!rut) return "";
  const cleanRut = rut.replace(/[^0-9kK]/g, "").toUpperCase();
  if (cleanRut.length <= 1) return cleanRut;
  let body = cleanRut.slice(0, -1);
  let dv = cleanRut.slice(-1);
  let formatted = "";
  let count = 0;
  for (let i = body.length - 1; i >= 0; i--) {
    formatted = body[i] + formatted;
    count++;
    if (count === 3 && i !== 0) {
      formatted = "." + formatted;
      count = 0;
    }
  }
  return `${formatted}-${dv}`;
};

const normalizeOptionalString = (v) => {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
};

const normalizeSapCode = (v) => {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
};

/* Estado inicial del formulario (centralizado para poder resetear) */
const INITIAL_FORM = {
  userId: "",
  employeeNombre: "",
  employeeRut: "",
  employeeEmail: "",
  employeeSapCode: "",
  employeeGerencia: "",
  employeeEmpresa: "",
  type: "",
  startDate: "",
  endDate: "",
  description: "",
};

/* ==================== COMPONENTE ==================== */
const View = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  // Form + errores
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({
    userId: false,
    type: false,
    startDate: false,
    endDate: false,
  });

  // UI / modales / alertas
  const [modal, setModal] = useState({ open: false, error: "", data: null });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [attachedFile, setAttachedFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0); // para limpiar <input type="file" />

  const [profileModal, setProfileModal] = useState({
    open: false,
    data: null,
    isNew: false,
  });

  // Filtros / búsqueda
  const [gerenciaFilter, setGerenciaFilter] = useState("");
  const [empresaFilter, setEmpresaFilter] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [rutSearch, setRutSearch] = useState("");
  const [debouncedUserSearch] = useDebounce(userSearch, 400);
  const [debouncedRutSearch] = useDebounce(rutSearch, 400);

  /* ============ Helpers de normalización para el payload final ============ */
  const buildNormalizedPayload = (raw) => {
    return {
      ...raw,
      // asegurar que estos snapshots sean string|null
      employeeEmail: normalizeOptionalString(raw.employeeEmail),
      employeeGerencia: normalizeOptionalString(raw.employeeGerencia),
      employeeEmpresa: normalizeOptionalString(raw.employeeEmpresa),
      employeePosition: normalizeOptionalString(raw.employeePosition),
      employeeSapCode: normalizeSapCode(raw.employeeSapCode),
    };
  };

  /* ============ Reset total del formulario tras crear con éxito ============ */
  const resetAll = () => {
    setFormData(INITIAL_FORM);
    setFieldErrors({ userId: false, type: false, startDate: false, endDate: false });
    setAttachedFile(null);
    setFileInputKey((k) => k + 1); // limpia input file
    setModal({ open: false, error: "", data: null });
    // NO cierro el profileModal aquí porque no está abierto en este flujo
    // Mantengo filtros/búsquedas tal cual (si quisieras también se pueden limpiar)
  };

  /* ==================== MUTACIÓN JUSTIFICACIÓN ==================== */
  const mutation = useMutation({
    mutationFn: createJustificationService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["justifications"] });
      setAlert({
        type: "success",
        message: "Justificación ingresada correctamente.",
      });
      resetAll(); // ← limpiar todo al terminar OK
    },
    onError: (err) => {
      setAlert({ type: "danger", message: err?.message || "Error al guardar." });
    },
  });

  /* ==================== QUERIES ==================== */
  const { data: gerencias = [] } = useQuery({
    queryKey: ["gerencias"],
    queryFn: listGerenciasService,
  });

  const { data: empresas = [] } = useQuery({
    queryKey: ["empresas"],
    queryFn: listEmpresasService,
  });

  const shouldFetchTrabajadores =
    debouncedUserSearch.length >= 4 || debouncedRutSearch.length >= 4;

  const { data: trabajadores = [] } = useQuery({
    queryKey: [
      "trabajadores",
      gerenciaFilter,
      empresaFilter,
      debouncedUserSearch,
      debouncedRutSearch,
    ],
    queryFn: () =>
      listTrabajadoresService({
        ...(gerenciaFilter ? { gerencia: gerenciaFilter } : {}),
        ...(empresaFilter ? { empresa: empresaFilter } : {}),
        ...(debouncedUserSearch ? { nombre: debouncedUserSearch } : {}),
        ...(debouncedRutSearch ? { rut: debouncedRutSearch } : {}),
      }),
    enabled: shouldFetchTrabajadores,
    keepPreviousData: true,
  });

  /* ==================== HANDLERS ==================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleModalSubmit = () => {
    if (!modal.data) return;
    const payload = buildNormalizedPayload(modal.data);
    mutation.mutate({ ...payload, file: attachedFile });
    // cerramos modal (el reset total se hace en onSuccess)
    setModal({ open: false, error: "", data: null });
  };

  // ✅ Selección de trabajador y carga de perfil
  const handleWorkerSelect = async (rut) => {
    const selected = trabajadores.find((t) => t.RutCorregido?.toString() === rut);
    if (!selected) {
      // si el usuario deselecciona
      setFormData((prev) => ({ ...INITIAL_FORM }));
      return;
    }

    // Actualiza campos del formulario principal
    setFormData((prev) => ({
      ...prev,
      userId: rut,
      employeeNombre: selected.Nombre || "",
      employeeRut: selected.Rut || "",
      employeeEmail: selected.Email || "",
      employeeSapCode: selected.Sap != null ? String(selected.Sap) : "", // 👈 string siempre
      employeeGerencia: selected.Gerencia || "",
      employeeEmpresa: selected.Empresa || "",
    }));
    if (fieldErrors.userId) {
      setFieldErrors((prev) => ({ ...prev, userId: false }));
    }

    try {
      // 🔹 Consultar el perfil por RUT
      const response = await getEmployeeProfileService(selected.Rut);

      // Normalizamos la respuesta (puede venir {exists, profile} o el perfil directo)
      const profile = response?.profile ?? response ?? null;
      const exists = response?.exists ?? !!profile;

      // 🔹 Datos base del trabajador
      const baseData = {
        rut: selected.Rut,
        name: selected.Nombre,
        email: selected.Email || "",
        sapCode: selected.Sap != null ? String(selected.Sap) : "", // 👈 string
        gerencia: selected.Gerencia || "",
        empresa: selected.Empresa || "",
        position: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        isActive: true,
      };

      // 🔹 Si hay perfil existente, fusionamos datos
      const initialData =
        exists && profile
          ? { ...baseData, ...profile, id: profile.id, isNew: false }
          : { ...baseData, id: null, isNew: true };

      // 🔹 Abrimos el modal con los datos correctos
      setProfileModal({
        open: true,
        data: initialData,
        isNew: !exists,
      });
    } catch (err) {
      console.error("❌ Error al cargar perfil:", err);

      // 🔹 Si ocurre error o no hay perfil, inicializamos con los datos del trabajador
      setProfileModal({
        open: true,
        data: {
          rut: selected.Rut,
          name: selected.Nombre,
          email: selected.Email || "",
          sapCode: selected.Sap != null ? String(selected.Sap) : "",
          gerencia: selected.Gerencia || "",
          empresa: selected.Empresa || "",
          position: "",
          startDate: new Date().toISOString().split("T")[0],
          endDate: "",
          isActive: true,
          isNew: true,
          id: null,
        },
        isNew: true,
      });
    }
  };

  // ✅ Guardar perfil (crear o actualizar)
  const handleSaveProfile = async (profile) => {
    try {
      // 🔍 Verificar si el perfil ya existe en backend
      const check = await getEmployeeProfileService(profile.rut);

      if (check?.exists && check?.profile?.id) {
        // ✅ Ya existe → actualizamos
        await updateEmployeeProfileService(check.profile.id, profile);
        setAlert({
          type: "success",
          message: "Perfil actualizado correctamente.",
        });
      } else {
        // 🆕 No existe → creamos
        await createEmployeeProfileService(profile);
        setAlert({
          type: "success",
          message: "Perfil creado correctamente.",
        });
      }

      // 🔹 Cerrar modal y refrescar cache
      setProfileModal({ open: false, data: null, isNew: false });
      queryClient.invalidateQueries({ queryKey: ["employeeProfiles"] });
    } catch (err) {
      console.error("❌ Error en handleSaveProfile:", err);
      setAlert({
        type: "danger",
        message:
          "Error al guardar perfil: " + (err.message || "Error desconocido"),
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación de requeridos
    const requiredFields = ["userId", "type", "startDate", "endDate"];
    const errors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) errors[field] = true;
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...errors }));
      setAlert({ type: "danger", message: "Completa todos los campos requeridos." });
      return;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diff = (end - start) / (1000 * 60 * 60 * 24) + 1;

    if (start > end) {
      setModal({ open: true, error: "La fecha de inicio debe ser menor o igual a la de fin." });
      return;
    }

    if (formData.type === "VACATION" && diff < 14) {
      setModal({ open: true, error: "Las vacaciones deben ser mínimo 14 días." });
      return;
    }

    if (formData.type !== "VACATION" && diff < 2) {
      setModal({ open: true, error: "Debe seleccionar más de 1 día." });
      return;
    }

    const payload = buildNormalizedPayload({
      ...formData,
      creatorId: user.id,
    });

    setModal({
      open: true,
      error: "",
      data: payload,
    });
  };

  /* ==================== RENDER ==================== */
  const start = formData.startDate ? new Date(formData.startDate) : null;
  const end = formData.endDate ? new Date(formData.endDate) : null;

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
    <div className="container-fluid p-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-10">
          {alert.message && (
            <div className={`alert alert-${alert.type}`} role="alert">
              {alert.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="card shadow-sm">
              <div className="card-header border-bottom">
                <h4 className="mb-0">Formulario de Justificación</h4>
              </div>

              <div className="card-body">
                {/* === Filtros === */}
                <div className="row g-2 mb-2">
                  <div className="col-md-3">
                    <label className="form-label">Gerencia</label>
                    <select
                      className="form-select"
                      value={gerenciaFilter}
                      onChange={(e) => setGerenciaFilter(e.target.value)}
                    >
                      <option value="">Todas</option>
                      {gerencias.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Empresa</label>
                    <select
                      className="form-select"
                      value={empresaFilter}
                      onChange={(e) => setEmpresaFilter(e.target.value)}
                    >
                      <option value="">Todas</option>
                      {empresas.map((e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Buscar por Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nombre"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Buscar por RUT</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="RUT"
                      maxLength={12}
                      value={rutSearch}
                      onChange={(e) => setRutSearch(formatRut(e.target.value))}
                    />
                  </div>
                </div>

                {/* === Selector de trabajador (requerido) === */}
                <div className="row g-2 mb-2">
                  <div className="col-md-12">
                    <label className="form-label">
                      Trabajador <span className="text-danger">*</span>
                    </label>
                    <select
                      name="userId"
                      className={`form-select ${fieldErrors.userId ? "is-invalid" : ""}`}
                      value={formData.userId}
                      onChange={(e) => handleWorkerSelect(e.target.value)}
                    >
                      <option value="">Seleccionar trabajador</option>
                      {trabajadores.map((user) => (
                        <option key={user.RutCorregido} value={user.RutCorregido}>
                          {user.Nombre} - {user.Rut}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.userId && (
                      <div className="invalid-feedback">Este campo es obligatorio</div>
                    )}
                  </div>
                </div>

                {/* === Datos del trabajador === */}
                <div className="row g-2 mt-3">
                  <div className="col-md-4">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      name="employeeNombre"
                      value={formData.employeeNombre}
                      readOnly
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">RUT</label>
                    <input
                      type="text"
                      name="employeeRut"
                      value={formData.employeeRut}
                      readOnly
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row g-2 mt-1">
                  <div className="col-md-4">
                    <label className="form-label">SAP</label>
                    <input
                      type="text"
                      name="employeeSapCode"
                      value={formData.employeeSapCode}
                      readOnly
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Gerencia</label>
                    <input
                      type="text"
                      name="employeeGerencia"
                      value={formData.employeeGerencia}
                      readOnly
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Empresa</label>
                    <input
                      type="text"
                      name="employeeEmpresa"
                      value={formData.employeeEmpresa}
                      readOnly
                      className="form-control"
                    />
                  </div>
                </div>

                {/* === Fechas y tipo (requeridos) === */}
                <div className="row g-2 mt-3">
                  <div className="col-md-4">
                    <label className="form-label">
                      Fecha Inicio <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={`form-control ${fieldErrors.startDate ? "is-invalid" : ""}`}
                    />
                    {fieldErrors.startDate && (
                      <div className="invalid-feedback">Este campo es obligatorio</div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">
                      Fecha Fin <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={`form-control ${fieldErrors.endDate ? "is-invalid" : ""}`}
                    />
                    {fieldErrors.endDate && (
                      <div className="invalid-feedback">Este campo es obligatorio</div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">
                      Tipo <span className="text-danger">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className={`form-select ${fieldErrors.type ? "is-invalid" : ""}`}
                    >
                      <option value="">Tipo Justificación</option>
                      {Object.entries(justificationTypes).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.type && (
                      <div className="invalid-feedback">Este campo es obligatorio</div>
                    )}
                  </div>
                </div>

                {/* === Periodos afectados === */}
                {start && end && (
                  <div className="mt-3">
                    <strong>Este rango afectará los siguientes periodos:</strong>
                    <div className="mt-2">
                      {getDaysPerMonth().map(([month, days]) => (
                        <span key={month} className="badge bg-info me-2 mb-2">
                          {month}: {days} día{days > 1 ? "s" : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* === Descripción y archivo === */}
                <div className="mb-3 mt-4">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="form-control"
                    placeholder="Descripción"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Archivo adjunto (opcional)</label>
                  <input
                    key={fileInputKey} // 👈 fuerza reset del input file
                    type="file"
                    className="form-control"
                    onChange={(e) => setAttachedFile(e.target.files[0])}
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary px-5"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Enviando..." : "Enviar solicitud"}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* === Modales === */}
          {modal.open && (
            <JustificationModal
              justification={modal.data}
              error={modal.error}
              onClose={() => setModal({ open: false, error: "", data: null })}
              onSubmit={handleModalSubmit}
              submitting={mutation.isPending}
            />
          )}

          {profileModal.open && (
            <EmployeeProfileModal
              open={profileModal.open}
              onClose={() =>
                setProfileModal({ open: false, data: null, isNew: false })
              }
              initialData={profileModal.data}
              onSave={handleSaveProfile}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default View;
