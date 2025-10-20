import apiClient from "src/services/apiClient";

const meService = async () => {
  try {
    const res = await apiClient({
      method: "GET",
      url: "/me",
    });
    return res;
  } catch (error) {
    console.error("⚠️ Error en meService:", error);
    throw error;
  }
};

export default meService;
