import ProtectedRoute from "@/pages/AdminTemplates/_components/protected-route";
import { Suspense, lazy, type FC, type JSX, type LazyExoticComponent } from "react";
import { type RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

const AdminTemplates = lazy(() => import("../pages/AdminTemplates"));
const Dashboard = lazy(() => import("../pages/AdminTemplates/Dashboard"));
const LocationInformation = lazy(() => import("../pages/AdminTemplates/Location-Information"));
const RegisterPage = lazy(() => import("../pages/AuthTemplates/RegisterPage"));
const RoomInformation = lazy(() => import("../pages/AdminTemplates/Room-Information"));
const RoomManagement = lazy(() => import("../pages/AdminTemplates/Room-Management"));
const AuthTemplates = lazy(() => import("../pages/AuthTemplates"));
const LoginPage = lazy(() => import("../pages/AuthTemplates/LoginPage"));
const UserManagement = lazy(() => import("../pages/AdminTemplates/User-Management"));
// 👉 Thêm RoomPage
const RoomsPage = lazy(() => import("../pages/HomeTemplate/ListRoom"));
const HomeTemplate = lazy(() => import("../pages/HomeTemplate"));
const DetailBookingRoom = lazy(() => import("../pages/HomeTemplate/Detail-BookingRoom"));

const withSuspense = (Component: LazyExoticComponent<FC>): JSX.Element => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
};

export const routes: RouteObject[] = [
  {
    path: "/",
    element: withSuspense(HomeTemplate),
    children: [
      // { index: true, element: withSuspense(HomePage) }, // "/" load HomePage
      // có thể thêm các page con khác ở đây, ví dụ:
      // { path: "about", element: withSuspense(AboutPage) },
    ],
  },
  // 🔹 Đưa RoomsPage ra route top-level để không render trong HomeTemplate
  { path: "/rooms", element: withSuspense(RoomsPage) },
  { path: "/rooms/:id", element: withSuspense(DetailBookingRoom) },
  {
    path: "/auth",
    element: withSuspense(AuthTemplates),
    children: [
      { path: "login", element: withSuspense(LoginPage) },
      { path: "register", element: withSuspense(RegisterPage) },
    ],
  },
  { path: "/login", element: <Navigate to="/auth/login" replace /> },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        {withSuspense(AdminTemplates)}
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: withSuspense(Dashboard) },
      { path: "dashboard", element: withSuspense(Dashboard) },
      { path: "room-management", element: withSuspense(RoomManagement) },
      { path: "user-management", element: withSuspense(UserManagement) },
    ],
  },
];
