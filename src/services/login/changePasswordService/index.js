import apiClient from "src/services/apiClient";

// ============================================================
// Helpers
// ============================================================
const normalizeRut = (rut) =>
  String(rut || "")
    .trim()
    .replace(/\./g, "")
    .toUpperCase();

// Normaliza cualquier respuesta (éxito o error) a un shape estable
const normalizeBackendPayload = (data, fallback = {}) => {
  if (data && typeof data === "object") {
    // Si ya viene tipado desde backend
    if ("success" in data || "errorCode" in data || "userMessage" in data) {
      return {
        success: Boolean(data.success),
        errorCode: data.errorCode || (data.success ? "OK" : "UNKNOWN_ERROR"),
        userMessage: data.userMessage || (data.success ? "" : "Ocurrió un error."),
        detail: data.detail || data.detalle || "",
        vigencia: data.vigencia ?? null,
        codeAlreadySent: Boolean(data.codeAlreadySent),
        status: data.status ?? fallback.status ?? null,
        ...data,
      };
    }

    // Si backend legacy devuelve {mensaje, detalle}
    return {
      success: data.mensaje === "OK",
      errorCode: data.mensaje === "OK" ? "OK" : "API_ERROR",
      userMessage: data.mensaje === "OK" ? "" : "No se pudo procesar la solicitud.",
      detail: data.detalle || data.mensaje || "",
      vigencia: data.vigencia ?? null,
      codeAlreadySent: false,
      status: fallback.status ?? null,
      raw: data,
    };
  }

  return {
    success: false,
    errorCode: "UNKNOWN_ERROR",
    userMessage: "Respuesta inválida del servidor.",
    detail: String(data ?? ""),
    vigencia: null,
    codeAlreadySent: false,
    status: fallback.status ?? null,
  };
};

const requestPasswordCodeService = async ({ rut }) => {
  const rutNorm = normalizeRut(rut);

  try {
    const res = await apiClient({
      method: "POST",
      url: "/login/change-password/request-code",
      data: { rut: rutNorm },
    });

    // ✅ Siempre retorna data normalizada
    return normalizeBackendPayload(res?.data, { status: res?.status });
  } catch (err) {
    // ✅ Si el backend respondió con JSON, úsalo
    const status = err?.response?.status ?? 0;
    const data = err?.response?.data;

    if (data) {
      return normalizeBackendPayload(data, { status });
    }

    // ✅ Error real de conexión / CORS / timeout / etc.
    return {
      success: false,
      errorCode: "CONNECTION_ERROR",
      userMessage:
        "No pudimos conectar con el servidor. Verifica tu conexión e intenta nuevamente.",
      detail: err?.message || "Network error",
      vigencia: null,
      codeAlreadySent: false,
      status,
    };
  }
};

export default requestPasswordCodeService;
