import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "@/store/auth.slice";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
});

api.interceptors.request.use(async (config: any) => {
  const { user, refreshAdminToken, clearUser } = useAuthStore.getState();
  let accessToken = user?.accessToken;

  if (!config.headers) {
    config.headers = {};
  }

  config.headers["tokenCybersoft"] = import.meta.env.VITE_TOKEN_CYBERSOFT;
  config.headers["token"] =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU0ODAyIiwiZW1haWwiOiJuZ29jbmd1eWVuNDU2QGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsIm5iZiI6MTc1OTEzNDAzMCwiZXhwIjoxNzU5NzM4ODMwfQ.W7CpYMOfswX6bCyCUnWEZbLFwdaFxIRMDud2hRuzgQ4";
  if (accessToken) {
    try {
      const [header, payload] = accessToken.split(".");
      const decodedHeader = JSON.parse(atob(header));
      const decodedPayload = JSON.parse(atob(payload));
      console.log(" Header:", decodedHeader);
      console.log(" Payload:", decodedPayload);

      const isExpired = decodedPayload.exp * 1000 < Date.now();

      if (isExpired && user?.role === "ADMIN") {
        console.warn("Token expired, refreshing...");
        await refreshAdminToken();
        accessToken = useAuthStore.getState().user?.accessToken;
      }
    } catch (err) {
      console.error("Invalid token decode:", err);
      clearUser();
    }
  }

  if (
    accessToken &&
    !config.url?.includes("/auth/signin") &&
    !config.url?.includes("/auth/signup")
  ) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    console.log("Sending Authorization header:", config.headers.Authorization);
  }

  if (config.method && config.method.toLowerCase() !== "get") {
    config.headers["Content-Type"] ??= "application/json";
  }

  return config;
});

export default api;
