// src/services/apiClient.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  // ❌ NO fijamos Content-Type aquí
  withCredentials: true,
});

// 🔁 Interceptor de request: si es FormData, dejamos que el navegador ponga el boundary
axiosInstance.interceptors.request.use((config) => {
  const isFormData =
    typeof FormData !== "undefined" && config.data instanceof FormData;

  if (isFormData) {
    // axios v1 usa AxiosHeaders; aseguramos eliminar cualquier valor previo
    if (config.headers?.["Content-Type"]) {
      delete config.headers["Content-Type"];
    }
  }
  return config;
});

// 🔁 Interceptor de respuesta: si 401 => a /login (evita loop en /login)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";
    if (status === 401 && !url.includes("/liderazgo/login")) {
      if (window.location.pathname !== "/liderazgo/login") {
        window.location.href = "/liderazgo/login";
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

const apiClient = async ({ method = "GET", url, params = {}, data = {}, headers = {} }) => {
  try {
    const response = await axiosInstance.request({ method, url, params, data, headers });
    return response.data;
  } catch (error) {
    console.error(`❌ API Error [${method}] ${url}:`, error?.message || error);
    throw error;
  }
};

export default apiClient;
