// src/services/justification/updateJustificationStatusService/index.js
import apiClient from "src/services/apiClient";

const updateJustificationStatusService = async (id, { status, reviewerId }) => {
  try {
    const res = await apiClient({
      method: "PUT",
      url: `/justification/${encodeURIComponent(id)}/status`,
      data: { status, reviewerId },
    });
    return res;
  } catch (error) {
    console.error("❌ Error en updateJustificationStatusService:", error);
    throw error;
  }
};

export default updateJustificationStatusService;
