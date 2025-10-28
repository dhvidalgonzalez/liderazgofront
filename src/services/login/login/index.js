import apiClient from "src/services/apiClient";

const loginService = async ({ rut, clave }) => {
  // apiClient YA devuelve data, no el objeto response
  const data = await apiClient({
    method: "POST",
    url: "/login",
    data: { rut, clave },
  });
  console.log("🚀 ~ loginService ~ data:", data);
  return data; // { success: true } o { requirePasswordChange: true, ... }
};

export default loginService;
