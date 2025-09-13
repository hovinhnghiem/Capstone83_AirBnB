import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthTemplates() {
  const { user } = useAuthStore();

  if (user?.role === "ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user?.role === "USER") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:to-slate-950 px-4">
      <div className="flex flex-col items-center mb-6">
    
      </div>  
        <CardHeader>
          <CardTitle className="text-center text-lg font-semibold">
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Outlet />
        </CardContent>
     

      <footer className="mt-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} MyApp. All rights reserved.
      </footer>
    </div>
  );
}
