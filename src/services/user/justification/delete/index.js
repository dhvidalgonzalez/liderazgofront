import apiClient from "src/services/apiClient";

const deleteJustificationService = async (id) => {
  try {
    const res = await apiClient({
      method: "DELETE",
      url: `/justification/${encodeURIComponent(id)}`,
    });
    return res;
  } catch (error) {
    console.error("❌ Error en deleteJustificationService:", error);
    throw error;
  }
};

export default deleteJustificationService;
