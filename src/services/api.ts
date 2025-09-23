import axios from "axios";
import type { AxiosInstance } from "axios";
import type { CurrentUser } from "@/interfaces/auth.interface";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
});
api.interceptors.request.use((config: any) => {
  const userLocal: string | null = localStorage.getItem("user");
  const userParsed: CurrentUser | null = userLocal
    ? JSON.parse(userLocal)
    : null;
  const accessToken = userParsed?.accessToken;
  if (!config.headers) {
    config.headers = {};
  }
  config.headers["TokenCybersoft"] = import.meta.env.VITE_TOKEN_CYBERSOFT;

  console.log("Headers being sent:", config.headers);
  if (
    accessToken &&
    !config.url?.includes("/auth/signin") &&
    !config.url?.includes("/auth/signup")
  ) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  if (config.method && config.method.toLowerCase() !== "get") {
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
  }
  const token = userParsed?.accessToken;
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("Decoded token:", payload);
  }
  return config;
});

export default api;
