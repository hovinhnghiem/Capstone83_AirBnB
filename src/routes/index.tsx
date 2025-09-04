import { Suspense, lazy, type FC, type JSX, type LazyExoticComponent } from "react";
import { type RouteObject } from "react-router-dom";

const Dashboard = lazy(() => import("../pages/AdminTemplates/Dashboard"));
const LoginPage = lazy(() => import("../pages/AdminTemplates/LoginPage"));
const LocationInformation = lazy(() => import("../pages/AdminTemplates/Location-Information"));
const RegisterPage = lazy(() => import("../pages/AdminTemplates/RegisterPage"));
const RoomInformation = lazy(() => import("../pages/AdminTemplates/Room-Information"));
const RoomManagement = lazy(() => import("../pages/AdminTemplates/Room-Management"));

const withSuspense = (Component: LazyExoticComponent<FC>): JSX.Element => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
};

export const routes: RouteObject[] = [
  {
    path: "/dashboard",
    element: withSuspense(Dashboard),
  },
];
