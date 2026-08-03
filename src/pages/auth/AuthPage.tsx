import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AuthCard } from "@/components/auth/AuthCard";
import { useAuthMode } from "@/hooks/auth/useAuthMode";
import { useLogin } from "@/hooks/auth/useLogin";
import { useAccessRequest } from "@/hooks/auth/useAccessRequest";
import type { AuthMode } from "@/models/auth";
import type { LoginFormValues } from "@/schemas/login";
import type { AccessRequestFormValues } from "@/schemas/access_request";

function parseMode(value: string | null): AuthMode {
  return value === "access" ? "access" : "login";
}

export function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = useMemo(
    () => parseMode(searchParams.get("mode")),
    [searchParams],
  );
  const { mode, setMode } = useAuthMode(initialMode);
  const login = useLogin();
  const access = useAccessRequest();

  useEffect(() => {
    setMode(parseMode(searchParams.get("mode")));
  }, [searchParams, setMode]);

  const handleModeChange = (next: AuthMode) => {
    login.clearFeedback();
    access.clearFeedback();
    setMode(next);
    setSearchParams(next === "login" ? {} : { mode: next }, { replace: true });
  };

  const handleLogin = async (values: LoginFormValues) => {
    await login.submitLogin(values);
  };

  const handleAccess = async (values: AccessRequestFormValues) => {
    return access.submitAccessRequest(values);
  };

  const error = mode === "login" ? login.error : access.error;
  const success = mode === "login" ? login.success : access.success;
  const isSubmitting =
    mode === "login" ? login.isSubmitting : access.isSubmitting;

  return (
    <AuthLayout>
      <AuthCard
        mode={mode}
        onModeChange={handleModeChange}
        error={error}
        success={success}
        isSubmitting={isSubmitting}
        onLogin={handleLogin}
        onGoogleLogin={login.submitGoogleLogin}
        onForgotPassword={login.submitPasswordReset}
        onAccessRequest={handleAccess}
      />
    </AuthLayout>
  );
}
