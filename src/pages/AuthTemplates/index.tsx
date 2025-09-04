import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.slice";
export default function AuthTemplates() {
  const { user } = useAuthStore();
  if (user && user.role === "ADMIN") {
    return <Navigate to="/admin" />;
  }
  if (user && user.role === "USER") {
    return <Navigate to="/" />;
  }
  return (
    <div>
      <h1>Auth Templates</h1>
      <Outlet />
      <div>
        <h1>Auth Templates Footer</h1>
      </div>
    </div>
  );
}
