import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function IconButton({ children, className = "", ...props }: IconButtonProps) {
  return (
    <button className={`chat-icon-btn ${className}`.trim()} type="button" {...props}>
      {children}
    </button>
  );
}
