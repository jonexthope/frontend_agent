import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/components/auth/LoginForm";

describe("LoginForm", () => {
  it("shows validation errors for empty fields", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <LoginForm
        onSubmit={onSubmit}
        onGoogleLogin={vi.fn()}
        onForgotPassword={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Entrer dans Cartin AI" }),
    );

    expect(await screen.findByText(/email est obligatoire/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits a valid payload", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <LoginForm
        onSubmit={onSubmit}
        onGoogleLogin={vi.fn()}
        onForgotPassword={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText("Email"), "user@cartin.com");
    await user.type(screen.getByLabelText("Mot de passe"), "secret");
    await user.click(
      screen.getByRole("button", { name: "Entrer dans Cartin AI" }),
    );

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "user@cartin.com",
        password: "secret",
        remember: true,
      }),
    );
  });
});
