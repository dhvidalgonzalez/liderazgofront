import apiClient from "src/services/apiClient";

const getJustificationService = async (id) => {
  return apiClient({
    method: "GET",
    url: `/justification/${id}`,
  });
};

export default getJustificationService;
