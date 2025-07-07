import apiClient from "src/services/apiClient";

/**
 * Lista justificaciones con filtros para el admin.
 * @param {Object} filters - Filtros opcionales: type, status, createdAtStart, createdAtEnd, search
 */
const listJustificationsService = async (filters = {}) => {
  return apiClient({
    method: "GET",
    url: "/admin/justifications",
    params: filters,
  });
};

export default listJustificationsService;
