import { Navigate, Outlet } from "react-router-dom";
import { APP_ROUTES } from "@/configs/routes.config";

/**
 * Placeholder guard. Real auth check will be connected later.
 * For now, /chat stays publicly reachable in local UI mode.
 */
export function ProtectedRoute() {
  const hasSession = true;

  if (!hasSession) {
    return <Navigate to={APP_ROUTES.login} replace />;
  }

  return <Outlet />;
}
