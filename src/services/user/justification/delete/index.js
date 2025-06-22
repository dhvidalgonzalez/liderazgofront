import apiClient from "src/services/apiClient";

const deleteJustificationService = async (id) => {
  return apiClient({
    method: "DELETE",
    url: `/justification/${id}`,
  });
};

export default deleteJustificationService;
