// src/services/user/justification/list.js
import apiClient from "src/services/apiClient";

const listJustificationsService = async (creatorId) => {
  return apiClient({
    method: "GET",
    url: "/justification/",
    params: { creatorId }, // 👈 así se pasa como query param
  });
};

export default listJustificationsService;
