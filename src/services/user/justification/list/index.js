import apiClient from "src/services/apiClient";

const listJustificationsService = async () => {
  return apiClient({
    method: "GET",
    url: "/justification/",
  });
};

export default listJustificationsService;
