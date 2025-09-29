import type { CurrentUser } from "@/interfaces/auth.interface";
import { create } from "zustand";
import api from "@/services/api";

const userLocal = localStorage.getItem("user");

type AuthStore = {
  user: CurrentUser | null;
  setUser: (user: CurrentUser | null) => void;
  clearUser: () => void;
  refreshAdminToken: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),

  setUser: (user: CurrentUser | null) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
    set({ user });
  },

  clearUser: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },
  refreshAdminToken: async () => {
    const user = get().user;
    if (!user) return;
    try {
      const response = await api.post("/auth/sign-in", {
        email: user.email,
        password: user.password,
      });
      const newUser: CurrentUser = response.data.content;
      localStorage.setItem("user", JSON.stringify(newUser));
      set({ user: newUser });
    } catch (error) {
      console.error("Failed to refresh token:", error);
    }
  },
}));
