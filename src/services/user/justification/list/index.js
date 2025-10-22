import apiClient from "src/services/apiClient";

/**
 * Lista justificaciones del usuario autenticado.
 * - Ya no requiere pasar creatorId (usa el token JWT).
 * - Soporta filtros opcionales: startDate, endDate.
 *
 * Ejemplo de uso:
 * listJustificationsService({ startDate: "2025-10-01", endDate: "2025-10-31" })
 */
const listJustificationsService = async (filters = {}) => {
  try {
    const params = {};

    // ✅ filtros opcionales por rango de fechas
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    const res = await apiClient({
      method: "GET",
      url: "/justification",
      params,
    });

    // Aseguramos que siempre retorne un array
    return Array.isArray(res) ? res : res?.data || [];
  } catch (error) {
    console.error("❌ Error en listJustificationsService:", error);
    throw error;
  }
};

export default listJustificationsService;
