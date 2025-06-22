// src/utils/apiClient.js
import axios from "axios";

const BASE_URL = "http://localhost:3000/api"; // compatible con Vite o fallback

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
