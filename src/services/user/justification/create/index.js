// src/services/justification/createJustificationService/index.js
import apiClient from "src/services/apiClient";

const normalizeRut = (rut) => String(rut || "").replace(/\./g, "").trim();

const createJustificationService = async (data) => {

  const hasFile = data?.file instanceof File;

  // Normaliza valores básicos que suelen causar rechazos
  const payload = {
    ...data,
    employeeRut: normalizeRut(data.employeeRut),
    userId: String(data.userId ?? "").trim(),
    // Si usas 'YYYY-MM-DD', déjalo así; el backend decide si requiere DateTime
    startDate: data.startDate || undefined,
    endDate: data.endDate || undefined,
  };

  let response;

  if (hasFile) {
    // ▶️ Con archivo: multipart/form-data (no tocar Content-Type)
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (key === "file") return; // lo agregamos abajo
      formData.append(key, value);
    });
    formData.append("file", data.file);

    response = await apiClient({
      method: "POST",
      url: "/justification",
      data: formData,
      // ❌ NO pongas Content-Type aquí
    });
  } else {
    // ▶️ Sin archivo: JSON (mucho más simple para el backend)
    response = await apiClient({
      method: "POST",
      url: "/justification",
      data: payload,
    });
  }

  console.log("✅ createJustificationService response:", response);
  return response;
};

export default createJustificationService;
