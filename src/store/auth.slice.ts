import type { CurrentUser } from "@/interfaces/auth.interface";
import { create } from "zustand";
const userLocal = localStorage.getItem("user");
const parsedUser: CurrentUser | null = userLocal ? JSON.parse(userLocal) : null;
type AuthStore = {
  user: CurrentUser | null;
  setUser: (user: CurrentUser | null) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: parsedUser,
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
}));
