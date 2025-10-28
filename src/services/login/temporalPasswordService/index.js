import apiClient from "src/services/apiClient";

const normalizeRut = (rut) =>
  String(rut || "").trim().replace(/\./g, "").toUpperCase();

/**
 * POST /login/change-password/validate-temp
 */
const temporalPasswordService = async ({ rut, tempPassword }) => {
  console.log("🚀 ~ temporalPasswordService ~ rut:", rut)
  try {
    const res = await apiClient({
      method: "POST",
      url: "/login/change-password/validate-temp",
      data: { rut: normalizeRut(rut), tempPassword },
    });
    console.log("🚀 ~ temporalPasswordService ~ res:", res)
    return res;
  } catch (error) {
    console.error("❌ Error en temporalPasswordService:", error);
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

export default temporalPasswordService;
