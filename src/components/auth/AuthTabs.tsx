import type { AuthMode } from "@/models/auth";

interface AuthTabsProps {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
}

export function AuthTabs({ mode, onChange }: AuthTabsProps) {
  return (
    <div className="auth-tabs" role="tablist" aria-label="Modes d’authentification">
      <button
        type="button"
        role="tab"
        id="tab-login"
        className={`auth-tab${mode === "login" ? " auth-tab--active" : ""}`}
        aria-selected={mode === "login"}
        aria-controls="panel-login"
        tabIndex={mode === "login" ? 0 : -1}
        onClick={() => onChange("login")}
      >
        Se connecter
      </button>
      <button
        type="button"
        role="tab"
        id="tab-access"
        className={`auth-tab${mode === "access" ? " auth-tab--active" : ""}`}
        aria-selected={mode === "access"}
        aria-controls="panel-access"
        tabIndex={mode === "access" ? 0 : -1}
        onClick={() => onChange("access")}
      >
        Demander un accès
      </button>
    </div>
  );
}
