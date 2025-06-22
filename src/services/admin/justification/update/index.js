import apiClient from "src/services/apiClient";

const updateJustificationStatusService = async (id, { status, reviewerId }) => {
  return apiClient({
    method: "PUT",
    url: `/justification/${id}/status`,
    data: { status, reviewerId },
  });
};

export default updateJustificationStatusService;
