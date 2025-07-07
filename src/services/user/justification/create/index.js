import apiClient from "src/services/apiClient";

const createJustificationService = async (data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "file") {
      if (value instanceof File) {
        formData.append("file", value); // ✅ solo si es un File válido
      }
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  return apiClient({
    method: "POST",
    url: "/justification/",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default createJustificationService;
