import apiClient from "src/services/apiClient";

const updateJustificationStatusService = async (id, payload) => {
  return apiClient({
    method: "PUT",
    url: `/justification/${id}/status`,
    data: payload, // incluye status, reviewerId, reviewerCause, reviewerComment
  });
};

export default updateJustificationStatusService;
