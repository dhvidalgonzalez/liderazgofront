import apiClient from "src/services/apiClient";

const loginService = async ({ rut, clave }) => {
  return apiClient({
    method: "POST",
    url: "/login",
    data: { rut, clave },
  });
};

export default loginService;
