import type { SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: readonly SelectOption[];
  placeholder?: string;
  error?: string;
}

export function Select({
  id,
  label,
  options,
  placeholder = "Sélectionner…",
  error,
  ...props
}: SelectProps) {
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className="auth-form-row">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        className="auth-select"
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={describedBy} className="auth-field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
