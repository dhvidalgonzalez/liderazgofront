import apiClient from "src/services/apiClient";

const getJustificationService = async (id) => {
  try {
    const res = await apiClient({
      method: "GET",
      url: `/justification/${encodeURIComponent(id)}`,
    });
    return res;
  } catch (error) {
    console.error("❌ Error en getJustificationService:", error);
    throw error;
  }
};

export default getJustificationService;
