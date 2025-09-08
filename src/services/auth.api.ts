import api from "./api";

export type Role = "ADMIN" | "USER";

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthday: string;
  gender: boolean;
  role: Role;
  accessToken: string;
}

export interface LoginValues {
  email: string;
  password: string;
}

export interface RegisterValues {
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
  gender: boolean;
  role: Role;
}

interface ApiResponse<T = any> {
  content: T;
  message?: string;
  statusCode?: number;
  [key: string]: any;
}

export const loginApi = async (
  values: LoginValues
): Promise<CurrentUser | null> => {
  try {
    const res = await api.post<ApiResponse<CurrentUser>>(
      "/api/auth/signin",
      values
    );
    return res.data.content;
  } catch (error) {
    console.error("🔥 loginApi error:", error);
    return null;
  }
};

export const registerApi = async <T = any>(
  values: RegisterValues
): Promise<T | null> => {
  try {
    const res = await api.post<ApiResponse<T>>("/api/auth/signup", values);
    return res.data.content;
  } catch (error) {
    console.error("🔥 registerApi error:", error);
    return null;
  }
};

export const AUTH_STORAGE_KEY = "user";

export const saveUser = (user: CurrentUser) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
};

export const getUser = (): CurrentUser | null => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CurrentUser;
  } catch {
    return null;
  }
};

export const clearUser = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};
