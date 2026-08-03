import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({
  id,
  label,
  error,
  ...props
}: TextareaProps) {
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className="auth-form-row">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        className="auth-textarea"
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
