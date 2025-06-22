import apiClient from "src/services/apiClient";

const createJustificationService = async (data) => {
  return apiClient({
    method: "POST",
    url: "/justification/",
    data,
  });
};

export default createJustificationService;
