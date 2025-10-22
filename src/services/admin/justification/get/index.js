import apiClient from "src/services/apiClient";

/**
 * Obtiene una justificación por su ID.
 * @param {string} id - ID de la justificación
 * @returns {Promise<Object>} Datos de la justificación
 */
const getJustificationService = async (id) => {
  try {
    if (!id) throw new Error("Se requiere un ID de justificación");

    const res = await apiClient({
      method: "GET",
      url: `/justification/${id}`,
    });

    // Normalizamos salida: siempre devolvemos los datos directamente
    return res?.data || res;
  } catch (error) {
    console.error("❌ Error en getJustificationService:", error);
    throw error;
  }
};

export default getJustificationService;
