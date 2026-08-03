import { AuthTabs } from "@/components/auth/AuthTabs";
import { AuthFeedback } from "@/components/auth/AuthFeedback";
import { LoginForm } from "@/components/auth/LoginForm";
import { AccessRequestForm } from "@/components/auth/AccessRequestForm";
import { CartinLogo } from "@/components/common/CartinLogo";
import type { AuthMode } from "@/models/auth";
import type { LoginFormValues } from "@/schemas/login";
import type { AccessRequestFormValues } from "@/schemas/access_request";

interface AuthCardProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  error?: string | null;
  success?: string | null;
  isSubmitting?: boolean;
  onLogin: (values: LoginFormValues) => Promise<void> | void;
  onGoogleLogin: () => Promise<boolean | void> | boolean | void;
  onForgotPassword: (
    email: string,
  ) => Promise<boolean | void> | boolean | void;
  onAccessRequest: (
    values: AccessRequestFormValues,
  ) => Promise<boolean> | boolean;
}

const COPY: Record<AuthMode, { title: string; subtitle: string }> = {
  login: {
    title: "Connexion",
    subtitle: "Accédez à Cartin AI, votre assistant business.",
  },
  access: {
    title: "Demander un accès",
    subtitle: "Votre demande sera examinée par un administrateur Cartin.",
  },
};

export function AuthCard({
  mode,
  onModeChange,
  error,
  success,
  isSubmitting,
  onLogin,
  onGoogleLogin,
  onForgotPassword,
  onAccessRequest,
}: AuthCardProps) {
  const copy = COPY[mode];

  return (
    <div className="auth-card">
      <div className="auth-card__logo">
        <CartinLogo width={110} />
      </div>

      <div className="auth-card__badge">
        <span className="auth-card__badge-dot" aria-hidden />
        Accès Cartin AI
      </div>

      <h2>{copy.title}</h2>
      <p className="auth-card__sub">{copy.subtitle}</p>

      <AuthTabs mode={mode} onChange={onModeChange} />
      <AuthFeedback error={error} success={success} />

      {mode === "login" ? (
        <LoginForm
          onSubmit={onLogin}
          onGoogleLogin={onGoogleLogin}
          onForgotPassword={onForgotPassword}
          isSubmitting={isSubmitting}
        />
      ) : (
        <AccessRequestForm
          onSubmit={onAccessRequest}
          isSubmitting={isSubmitting}
        />
      )}

      <div className="auth-foot">Accès réservé aux utilisateurs validés</div>
    </div>
  );
}
