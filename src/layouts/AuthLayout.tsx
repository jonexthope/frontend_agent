import type { ReactNode } from "react";
import { AuthHero } from "@/components/auth/AuthHero";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      <AuthHero />
      <section className="auth-panel">{children}</section>
    </div>
  );
}
