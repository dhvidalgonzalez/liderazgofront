import apiClient from "src/services/apiClient";

// Normaliza RUT quitando puntos y en mayúsculas (K/k)
const normalizeRut = (rut) =>
  String(rut || "").trim().replace(/\./g, "").toUpperCase();

/**
 * Solicita el envío del correo con código de recuperación.
 * Backend: POST /login/change-password/request-code
 */
const requestPasswordCodeService = async ({ rut }) => {
  try {
    const res = await apiClient({
      method: "POST",
      url: "/login/change-password/request-code",
      data: { rut: normalizeRut(rut) },
    });
    return res;
  } catch (error) {
    console.error("❌ Error en requestPasswordCodeService:", error);
    throw error;
  }
};

export default requestPasswordCodeService;
