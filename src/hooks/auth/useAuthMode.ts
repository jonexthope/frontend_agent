import { useCallback, useState } from "react";
import type { AuthMode } from "@/models/auth";

export function useAuthMode(initialMode: AuthMode = "login") {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  const switchMode = useCallback((next: AuthMode) => {
    setMode(next);
  }, []);

  return { mode, setMode: switchMode };
}
