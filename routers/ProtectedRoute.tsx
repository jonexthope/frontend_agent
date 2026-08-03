import { Navigate, Outlet } from "react-router-dom";
import { APP_ROUTES } from "@/configs/routes.config";

/**
 * Protects /chat routes once backend auth is available.
 * Currently redirects to login because no session mechanism exists.
 */
export function ProtectedRoute() {
  const hasSession = false;

  if (!hasSession) {
    return <Navigate to={APP_ROUTES.login} replace />;
  }

  return <Outlet />;
}
