import axios from "axios";
import { useAuthStore } from "@/store/use-auth-store";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/v1", // Assuming the API is running on this port
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
