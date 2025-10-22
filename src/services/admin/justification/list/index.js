import apiClient from "src/services/apiClient";

/**
 * 📡 Lista justificaciones (ADMIN)
 * - Filtros en el body: { type, status, createdAtStart, createdAtEnd, search }
 */
const listJustificationsService = async (filters = {}) => {
  try {
    const res = await apiClient({
      method: "POST",
      url: "/admin/justification",
      data: filters,
    });

    // Asegura un array como salida
    if (Array.isArray(res)) return res;
    return res?.data || [];
  } catch (error) {
    console.error("❌ Error en listJustificationsService (admin):", error);
    throw error;
  }
};

export default listJustificationsService;
