import apiClient from "src/services/apiClient";

const BASE_URL = "/admin/employee-profiles";

// 🔹 Listar todos los perfiles
export const listEmployeeProfilesService = async () => {
  try {
    const data = await apiClient({
      method: "GET",
      url: BASE_URL,
    });
    console.log("🚀 ~ listEmployeeProfilesService ~ data:", data);
    return data ?? []; // ✅ Garantiza que no sea undefined
  } catch (err) {
    console.error("❌ Error listEmployeeProfilesService:", err);
    throw new Error("Error al listar perfiles de empleados");
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
    if (err.status === 404) return { exists: false, profile: null };
    throw err;
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
