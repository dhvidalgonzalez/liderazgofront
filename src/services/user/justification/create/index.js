import apiClient from "src/services/apiClient";

const normalizeRut = (rut) => String(rut || "").replace(/\./g, "").trim();

const isBrowserFile = (f) => {
  // Evita reventar en SSR o tests: File puede no existir en el entorno
  return typeof File !== "undefined" && f instanceof File;
};

const createJustificationService = async (data) => {
  const hasFile = data?.file && (isBrowserFile(data.file) || typeof data.file.size === "number");

  const payload = {
    ...data,
    employeeRut: normalizeRut(data.employeeRut),
    userId: String(data.userId ?? "").trim(),
    startDate: data.startDate || undefined,
    endDate: data.endDate || undefined,
  };

  let response;
  if (hasFile) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (key === "file") return;
      formData.append(key, value);
    });
    formData.append("file", data.file);

    response = await apiClient({
      method: "POST",
      url: "/justification",
      data: formData,
      // Importante: no seteamos Content-Type manualmente
    });
  } else {
    response = await apiClient({
      method: "POST",
      url: "/justification",
      data: payload,
    });
  }

  return response;
};

export default createJustificationService;
