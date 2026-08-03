import { Navigate, Route, Routes } from "react-router-dom";
import { APP_ROUTES } from "@/configs/routes.config";
import { AuthPage } from "@/pages/auth/AuthPage";
import { PublicRoute } from "@routers/PublicRoute";
import { ProtectedRoute } from "@routers/ProtectedRoute";

function ChatPlaceholder() {
  return (
    <div className="chat-placeholder">
      <h1>Cartin AI — Chat</h1>
      <p>L’interface conversationnelle sera branchée dans une prochaine itération.</p>
      <a href={APP_ROUTES.login}>Retour à la connexion</a>
    </div>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path={APP_ROUTES.login} element={<AuthPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path={APP_ROUTES.chat} element={<ChatPlaceholder />} />
        <Route
          path={APP_ROUTES.chatConversation}
          element={<ChatPlaceholder />}
        />
      </Route>

      <Route path="/" element={<Navigate to={APP_ROUTES.login} replace />} />
      <Route path="*" element={<Navigate to={APP_ROUTES.login} replace />} />
    </Routes>
  );
}
