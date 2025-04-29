import axios from "axios";
import { getToken } from "./token";
export const axiosInstance = axios.create({
  baseURL:`${process.env.NEXT_PUBLIC_API_END_POINTS}/api`,
  // baseURL:`http://localhost:8080/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
