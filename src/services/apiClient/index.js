// src/utils/apiClient.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 🔑 Esto es CLAVE para enviar cookies al backend
});


const apiClient = async ({
  method = "GET",
  url,
  params = {},
  data = {},
  headers = {},
}) => {
  try {
    const response = await axiosInstance.request({
      method,
      url,
      params,
      data,
      headers,
    });

    return response.data;
  } catch (error) {
    console.error("❌ API Error:", error);
    throw error.response?.data || error;
  }
};

export default apiClient;
