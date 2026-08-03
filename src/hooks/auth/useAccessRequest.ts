import { useCallback, useState } from "react";
import type { AccessRequestPayload } from "@/models/access_request";
import { requestAccess } from "@/services/access_request_service";
import { toAuthErrorMessage } from "@/tools/auth/auth_errors";

interface UseAccessRequestResult {
  isSubmitting: boolean;
  error: string | null;
  success: string | null;
  clearFeedback: () => void;
  submitAccessRequest: (payload: AccessRequestPayload) => Promise<boolean>;
}

export function useAccessRequest(): UseAccessRequestResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clearFeedback = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const submitAccessRequest = useCallback(
    async (payload: AccessRequestPayload) => {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);
      try {
        await requestAccess(payload);
        setSuccess(
          "Demande envoyée aux administrateurs. Vous serez notifié après validation.",
        );
        return true;
      } catch (err) {
        setError(toAuthErrorMessage(err));
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  return {
    isSubmitting,
    error,
    success,
    clearFeedback,
    submitAccessRequest,
  };
}
