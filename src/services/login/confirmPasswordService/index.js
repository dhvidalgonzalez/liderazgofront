import apiClient from "src/services/apiClient";

const normalizeRut = (rut) =>
  String(rut || "").trim().replace(/\./g, "").toUpperCase();

/**
 * POST /login/change-password/confirm
 */
const confirmPasswordService = async ({ rut, newPassword }) => {
  try {
    const res = await apiClient({
      method: "POST",
      url: "/login/change-password/confirm",
      data: { rut: normalizeRut(rut), newPassword },
    });
    return res;
  } catch (error) {
    console.error("❌ Error en confirmPasswordService:", error);
    const backend = error?.response?.data;
    if (backend?.mensaje || backend?.detalle || backend?.error) {
      return {
        success: false,
        mensaje: backend.mensaje || backend.error,
        detalle: backend.detalle,
        status: error?.response?.status,
      };
    }
    throw error;
  }
};

export default confirmPasswordService;
