
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

const withSuspense = (Component: LazyExoticComponent<FC>): JSX.Element => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
};

export const routes: RouteObject[] = [
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
    element: withSuspense(AdminTemplates),
    children: [
      { index: true, element: withSuspense(Dashboard) },
      { path: "dashboard", element: withSuspense(Dashboard) },
      { path: "room-management", element: withSuspense(RoomManagement) },

    ],
  },
];
