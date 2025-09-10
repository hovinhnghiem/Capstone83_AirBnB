import api from "./api";
import type { BaseApiResponse } from "@/interfaces/base.interface";
import type { CurrentUser } from "@/interfaces/auth.interface";

export type Role = "ADMIN" | "USER";

export interface LoginDataRequest {
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

<<<<<<< HEAD
export const loginApi = async (
  data: LoginDataRequest
): Promise<CurrentUser | null> => {
  try {
    const response = await api.post("/auth/signin", data);
    const { user, token } = response.data.content;
    const fullUser: CurrentUser = {
      ...user,
      accessToken: token,
    };

    localStorage.setItem("user", JSON.stringify(fullUser));
    return fullUser;
  } catch (error: any) {
    console.error("🔥 loginApi error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return null;
  }
};

export const updateUserApi = async (
  userId: number,
  updatedUser: Partial<CurrentUser>
): Promise<CurrentUser | null> => {
  try {
    const response = await api.put<BaseApiResponse<CurrentUser>>(
      `/users/${userId}`,
      updatedUser
    );
    return response.data.content;
  } catch (error: any) {
    console.error("🔥 updateUserApi error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return null;
  }
=======
export const loginApi = async (values: LoginDataRequest) => {
  const res = await api.post<BaseApiResponse<CurrentUser>>("/auth/signin", values);
  return res.data.content; // content chứa { accessToken, user: { id, name, email, role } }
>>>>>>> 624ea43 (proccesging fix login)
};

export const registerApi = async (
  values: RegisterValues
): Promise<RegisterValues | null> => {
  try {
    const res = await api.post<BaseApiResponse<RegisterValues>>(
      "/auth/signup",
      values
    );
    return res.data.content;
  } catch (error: any) {
    console.error("🔥 registerApi error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
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