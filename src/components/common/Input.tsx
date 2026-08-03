import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({
  id,
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className="auth-form-row">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className={`auth-input ${className}`.trim()}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...props}
      />
      {error ? (
        <p id={describedBy} className="auth-field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
