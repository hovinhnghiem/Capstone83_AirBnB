import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

type AuthUser = {
  accessToken?: string;
};

export const USER_STORAGE_KEY = "user";

const api = axios.create({
  baseURL: "https://airbnbnew.cybersoft.edu.vn/api",
  headers: {
    TokenCybersoft:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4",
  },
});
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const user = localStorage.getItem(USER_STORAGE_KEY);

  if (user) {
    try {
      const { accessToken } = JSON.parse(user) as AuthUser;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.error("❌ Failed to parse user from localStorage:", error);
    }
  }

  return config;
});

export default api;
