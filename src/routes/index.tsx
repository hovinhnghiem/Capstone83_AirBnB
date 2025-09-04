import { Suspense, lazy, type FC, type JSX, type LazyExoticComponent } from "react";
import { type RouteObject } from "react-router-dom";

const Dashboard = lazy(() => import("../pages/AdminTemplates/Dashboard"));


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
