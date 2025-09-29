import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.slice";
import type { JSX } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user, clearUser } = useAuthStore();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const token = user.accessToken;
  let isExpired = false;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp * 1000 < Date.now()) {
        isExpired = true;
      }
    } catch (error) {
      console.error("Failed to decode token:", error);
      isExpired = true;
    }
  } else {
    isExpired = true;
  }

  if (isExpired) {
    clearUser();
    return <Navigate to="/auth/login" replace />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}
