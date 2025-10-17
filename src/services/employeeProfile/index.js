import apiClient from "src/services/apiClient";

const BASE_URL = "/admin/employee-profiles";

// 🔹 Obtener perfil por RUT
export const getEmployeeProfileService = async (rut) => {
  try {
    const res = await apiClient({
      method: "GET",
      url: `${BASE_URL}/rut/${rut}`,
    });
    return { exists: true, profile: res.profile };
  } catch (err) {
    // Si no existe, devolvemos estructura uniforme
    if (err.response?.status === 404) {
      return { exists: false, profile: null };
    }
    throw err;
  }
};

// 🔹 Crear perfil
export const createEmployeeProfileService = async (profileData) => {
  try {
    const res = await apiClient({
      method: "POST",
      url: BASE_URL,
      data: profileData,
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error createEmployeeProfileService:", err.response?.data);
    throw new Error(err.response?.data?.message || "Error al crear perfil");
  }
};

// 🔹 Actualizar perfil
export const updateEmployeeProfileService = async (id, profileData) => {

  try {
    const res = await apiClient({
      method: "PUT",
      url: `${BASE_URL}/${id}`,
      data: profileData,
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error updateEmployeeProfileService:", err.response?.data);
    throw new Error(err.response?.data?.message || "Error al actualizar perfil");
  }
};
