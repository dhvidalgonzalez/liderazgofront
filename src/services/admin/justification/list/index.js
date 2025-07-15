import apiClient from "src/services/apiClient";

/**
 * Lista justificaciones con filtros para el admin.
 * @param {Object} filters - Filtros opcionales: type, status, createdAtStart, createdAtEnd, search
 */
const listJustificationsService = async (filters = {}) => {
  return apiClient({
    method: "POST",
    url: "/admin/justification",
    data: filters, // ✅ los filtros van en el body ahora
  });
};

export default listJustificationsService;
