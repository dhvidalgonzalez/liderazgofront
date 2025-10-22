import apiClient from "src/services/apiClient";

/**
 * Actualiza el estado de una justificación (Admin)
 * 
 * @param {string} id - ID de la justificación a actualizar
 * @param {Object} payload - Datos de actualización:
 *   {
 *     status: "APPROVED" | "REJECTED" | "PENDING",
 *     reviewerId?: string,
 *     reviewerCause?: string,
 *     reviewerComment?: string
 *   }
 * 
 * @returns {Promise<Object>} Datos actualizados de la justificación
 */
const updateJustificationStatusService = async (id, payload = {}) => {
  try {
    if (!id) throw new Error("Se requiere un ID de justificación.");
    if (!payload.status)
      throw new Error("Debe especificarse un estado (status) en el payload.");

    const res = await apiClient({
      method: "PUT",
      url: `/admin/justification/${id}/status`,
      data: payload,
    });

    // Normalizamos la respuesta para que devuelva directamente los datos
    return res?.data || res;
  } catch (error) {
    console.error("❌ Error en updateJustificationStatusService:", error);
    throw error;
  }
};

export default updateJustificationStatusService;
