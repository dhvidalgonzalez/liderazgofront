import apiClient from "src/services/apiClient";

const loginService = async ({ rut, clave }) => {
  try {
    const res = await apiClient({
      method: "POST",
      url: "/login",
      data: { rut, clave },
    });
    return res;
  } catch (error) {
    console.error("❌ Error en loginService:", error);
    throw error;
  }
};

export default loginService;
