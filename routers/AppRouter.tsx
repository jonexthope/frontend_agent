import { Navigate, Route, Routes } from "react-router-dom";
import { APP_ROUTES } from "@/configs/routes.config";
import { AuthPage } from "@/pages/auth/AuthPage";
import { ChatPage } from "@/pages/chat/ChatPage";
import { PublicRoute } from "@routers/PublicRoute";
import { ProtectedRoute } from "@routers/ProtectedRoute";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path={APP_ROUTES.login} element={<AuthPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path={APP_ROUTES.chat} element={<ChatPage />} />
        <Route path={APP_ROUTES.chatConversation} element={<ChatPage />} />
      </Route>

      <Route path="/" element={<Navigate to={APP_ROUTES.login} replace />} />
      <Route path="*" element={<Navigate to={APP_ROUTES.login} replace />} />
    </Routes>
  );
}
