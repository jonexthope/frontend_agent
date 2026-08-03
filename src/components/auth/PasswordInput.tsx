import { useState, type InputHTMLAttributes } from "react";

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
}

export function PasswordInput({
  id,
  label,
  error,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className="auth-form-row">
      <label htmlFor={id}>{label}</label>
      <div className="auth-password">
        <input
          id={id}
          type={visible ? "text" : "password"}
          className="auth-input"
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          {...props}
        />
        <button
          type="button"
          className="auth-password__toggle"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          aria-pressed={visible}
        >
          {visible ? (
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
              <path
                d="M2 2l12 12M6.5 6.7A3 3 0 009.3 9.5M3.2 3.8C2 4.9 1.2 6.3 1 8c.5 3 3.4 5.5 7 5.5 1.2 0 2.3-.3 3.3-.8M6.1 3.3A6.7 6.7 0 018 3c3.6 0 6.5 2.5 7 5.5-.2.8-.5 1.5-1 2.1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
              <path
                d="M1 8c.5-3 3.4-5.5 7-5.5S14.5 5 15 8c-.5 3-3.4 5.5-7 5.5S1.5 11 1 8z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <circle
                cx="8"
                cy="8"
                r="2.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
          )}
        </button>
      </div>
      {error ? (
        <p id={describedBy} className="auth-field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
