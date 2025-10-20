import apiClient from "src/services/apiClient";

const logoutService = async () => {
  try {
    const res = await apiClient({
      method: "POST",
      url: "/login/logout",
    });
    return res;
  } catch (error) {
    console.error("❌ Error en logoutService:", error);
    throw error;
  }
};

export default logoutService;
