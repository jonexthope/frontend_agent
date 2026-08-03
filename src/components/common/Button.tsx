import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "google" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  children: ReactNode;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: "auth-btn auth-btn--primary",
  google: "auth-btn auth-btn--google",
  ghost: "auth-btn",
};

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${variantClass[variant]} ${className}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="auth-loader" aria-hidden /> : null}
      {children}
    </button>
  );
}
