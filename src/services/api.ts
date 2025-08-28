import axios, { InternalAxiosRequestConfig } from "axios"


const api = axios.create({
  baseURL: "https://airbnbnew.cybersoft.edu.vn/api",
  headers: {
    TokenCybersoft:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4",
  },
})

// interceptor gắn accessToken của user nếu có
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const user = localStorage.getItem("user")
  if (user) {
    try {
      const { accessToken } = JSON.parse(user) as { accessToken?: string }
      if (accessToken) {
        if (!config.headers) {
          config.headers = {}
        }
        config.headers.Authorization = `Bearer ${accessToken}`
      }
    } catch (error) {
      console.error("❌ Lỗi parse user từ localStorage:", error)
    }
  }
  return config
})

export default api
