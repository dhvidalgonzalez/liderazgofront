import apiClient from "src/services/apiClient";

const logoutService = async () => {
  return apiClient({
    method: "POST",
    url: "/login/logout",
    withCredentials: true, // Asegura que se envíe la cookie
  });
};

export default logoutService;
