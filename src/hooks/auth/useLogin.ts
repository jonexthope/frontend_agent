import { useCallback, useState } from "react";
import type { LoginPayload } from "@/models/auth";
import {
  login,
  loginWithGoogle,
  requestPasswordReset,
} from "@/services/auth_service";
import { toAuthErrorMessage } from "@/tools/auth/auth_errors";

interface UseLoginResult {
  isSubmitting: boolean;
  error: string | null;
  success: string | null;
  clearFeedback: () => void;
  submitLogin: (payload: LoginPayload) => Promise<boolean>;
  submitGoogleLogin: () => Promise<boolean>;
  submitPasswordReset: (email: string) => Promise<boolean>;
}

export function useLogin(): UseLoginResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clearFeedback = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const submitLogin = useCallback(async (payload: LoginPayload) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await login(payload);
      setSuccess("Connexion réussie.");
      return true;
    } catch (err) {
      setError(toAuthErrorMessage(err));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const submitGoogleLogin = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await loginWithGoogle();
      setSuccess("Connexion Google réussie.");
      return true;
    } catch (err) {
      setError(toAuthErrorMessage(err));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const submitPasswordReset = useCallback(async (email: string) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await requestPasswordReset(email);
      setSuccess("Lien de réinitialisation envoyé.");
      return true;
    } catch (err) {
      setError(toAuthErrorMessage(err));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    isSubmitting,
    error,
    success,
    clearFeedback,
    submitLogin,
    submitGoogleLogin,
    submitPasswordReset,
  };
}
