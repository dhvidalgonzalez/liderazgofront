// src/services/apiClient.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const isFormData = typeof FormData !== "undefined" && config.data instanceof FormData;
  if (isFormData && config.headers?.["Content-Type"]) {
    delete config.headers["Content-Type"];
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response, // ✅ devolvemos el response completo aquí
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";
    if (status === 401 && !url.includes("/liderazgo/login")) {
      if (window.location.pathname !== "/liderazgo/login") {
        window.location.href = "/liderazgo/login";
      }
    }
    return Promise.reject(error?.response?.data || error);
  }
);

/** ✅ NUEVO: si pasas { raw:true } devuelvo el response completo, si no solo data */
const apiClient = async ({ raw = false, ...req }) => {
  const resp = await axiosInstance.request(req);
  return raw ? resp : resp.data;
};

export default apiClient;
