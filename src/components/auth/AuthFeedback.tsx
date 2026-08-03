import { Alert } from "@/components/common/Alert";

interface AuthFeedbackProps {
  error?: string | null;
  success?: string | null;
}

export function AuthFeedback({ error, success }: AuthFeedbackProps) {
  if (error) {
    return <Alert type="error" message={error} />;
  }
  if (success) {
    return <Alert type="success" message={success} />;
  }
  return null;
}
