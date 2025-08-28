import api from "./api";

interface LoginValues {
  taiKhoan: string;
  matKhau: string;
}

interface LoginResponse<T = any> {
  content: T;
  [key: string]: any;
}

export const loginApi = async <T = any>(
  values: LoginValues
): Promise<T | null> => {
  try {
    const response = await api.post<LoginResponse<T>>(
      "/api/auth/signin",
      values
    );
    return response.data.content;
  } catch (error) {
    console.error("🔥 ~ loginApi ~ error:", error);
    return null;
  }
};
