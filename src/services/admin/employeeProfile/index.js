import apiClient from "src/services/apiClient";

const BASE_URL = "/admin/employee-profiles";

const pickDefined = (obj = {}) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null && v !== ""));

// 🔹 (Compat) Listar todos los perfiles -> SIEMPRE retorna array
export const listEmployeeProfilesService = async () => {
  try {
    const payload = await apiClient({
      method: "GET",
      url: BASE_URL,
    });
    // Compatibilidad: si viene { data, pagination }, devuelvo solo el array
    if (payload && Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.data)) return payload.data;
    return []; // fallback
  } catch (err) {
    console.error("❌ Error listEmployeeProfilesService:", err);
    throw new Error("Error al listar perfiles de empleados");
  }
};

// 🔹 (Nuevo, opt-in) Listar con paginación/búsqueda/orden -> retorna { data, pagination }
export const listEmployeeProfilesPagedService = async ({
  page = 1,
  pageSize = 10,
  q,
  sortBy = "name",
  sortOrder = "asc",
  isActive,
  empresa,
  gerencia,
} = {}) => {
  try {
    const params = pickDefined({
      page,
      pageSize,
      q,
      sortBy,
      sortOrder,
      isActive,
      empresa,
      gerencia,
    });

    const payload = await apiClient({
      method: "GET",
      url: BASE_URL,
      params,
    });

    // Normalizo respuesta: aseguro { data: [], pagination: {...} }
    if (payload && Array.isArray(payload.data) && payload.pagination) {
      return payload;
    }
    if (Array.isArray(payload)) {
      // Si el backend por compat devuelve array, fabrico un pagination mínimo
      return {
        data: payload,
        pagination: {
          page: 1,
          pageSize: payload.length,
          totalItems: payload.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
    // Fallback seguro
    return {
      data: Array.isArray(payload?.data) ? payload.data : [],
      pagination: payload?.pagination || {
        page: page || 1,
        pageSize: pageSize || 10,
        totalItems: Array.isArray(payload?.data) ? payload.data.length : 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };
  } catch (err) {
    console.error("❌ Error listEmployeeProfilesPagedService:", err);
    throw new Error("Error al listar perfiles (paginado)");
  }
};

// 🔹 Obtener perfil por RUT
export const getEmployeeProfileService = async (rut) => {
  try {
    const data = await apiClient({
      method: "GET",
      url: `${BASE_URL}/rut/${rut}`,
    });
    return { exists: true, profile: data };
  } catch (err) {
    const status =
      err?.status ??
      err?.response?.status ??
      err?.response?.data?.status ??
      err?.code;

    if (Number(status) === 404) {
      return { exists: false, profile: null }; // ← no lanzar error
    }
    throw err; // otros errores sí se propagan
  }
};

// 🔹 Crear perfil
export const createEmployeeProfileService = async (profileData) => {
  try {
    const data = await apiClient({
      method: "POST",
      url: BASE_URL,
      data: profileData,
    });
    return data;
  } catch (err) {
    console.error("❌ Error createEmployeeProfileService:", err);
    throw new Error("Error al crear perfil de empleado");
  }
};

// 🔹 Actualizar perfil
export const updateEmployeeProfileService = async (id, profileData) => {
  try {
    const data = await apiClient({
      method: "PUT",
      url: `${BASE_URL}/${id}`,
      data: profileData,
    });
    return data;
  } catch (err) {
    console.error("❌ Error updateEmployeeProfileService:", err);
    throw new Error("Error al actualizar perfil de empleado");
  }
};

