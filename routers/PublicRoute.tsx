import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

/** Public routes (login). Authenticated redirect will be added with real auth. */
export function PublicRoute() {
  return <Outlet />;
}

export function PublicRouteShell({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
