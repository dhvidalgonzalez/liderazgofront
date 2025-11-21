import apiClient from "src/services/apiClient";

/**
 * 📡 Lista justificaciones (ADMIN) con filtros + paginación
 *
 * params:
 *  - type?, status?, createdAtStart?, createdAtEnd?, search?
 *  - page?, pageSize?, sortBy?, sortOrder?
 */
const listJustificationsService = async (params = {}) => {
  try {
    const res = await apiClient({
      method: "POST",
      url: "/admin/justification",
      data: params,
    });

    // Si el backend ya responde { data, pagination }, lo usamos tal cual
    if (res && Array.isArray(res.data)) {
      return {
        data: res.data,
        pagination:
          res.pagination || {
            page: params.page || 1,
            pageSize: params.pageSize || res.data.length || 10,
            totalItems: res.data.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
      };
    }

    // Si por alguna razón el backend devolviera directamente un array:
    if (Array.isArray(res)) {
      return {
        data: res,
        pagination: {
          page: params.page || 1,
          pageSize: params.pageSize || res.length || 10,
          totalItems: res.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    }

    return {
      data: [],
      pagination: {
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        totalItems: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  } catch (error) {
    console.error("❌ Error en listJustificationsService (admin):", error);
    throw error;
  }
};

export default listJustificationsService;
