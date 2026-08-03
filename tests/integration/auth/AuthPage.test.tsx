import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AuthPage } from "@/pages/auth/AuthPage";
import { AUTH_MESSAGES } from "@/configs/auth.config";

function renderAuth(initialEntry = "/login") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AuthPage />
    </MemoryRouter>,
  );
}

describe("AuthPage integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows the login tab by default", () => {
    renderAuth();
    expect(screen.getByRole("heading", { name: "Connexion" })).toBeInTheDocument();
    expect(
      screen.getByText("Accédez à Cartin AI, votre assistant business."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("switches to access request and back", async () => {
    const user = userEvent.setup();
    renderAuth();

    await user.click(screen.getByRole("tab", { name: "Demander un accès" }));
    expect(
      screen.getByRole("heading", { name: "Demander un accès" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Votre demande sera examinée par un administrateur Cartin.",
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Se connecter" }));
    expect(screen.getByRole("heading", { name: "Connexion" })).toBeInTheDocument();
  });

  it("opens access mode from query string", () => {
    renderAuth("/login?mode=access");
    expect(
      screen.getByRole("heading", { name: "Demander un accès" }),
    ).toBeInTheDocument();
  });

  it("shows unavailable message on login submit without fake redirect", async () => {
    const user = userEvent.setup();
    renderAuth();

    await user.type(screen.getByLabelText("Email"), "user@cartin.com");
    await user.type(screen.getByLabelText("Mot de passe"), "secret");
    await user.click(
      screen.getByRole("button", { name: "Entrer dans Cartin AI" }),
    );

    expect(
      await screen.findByText(AUTH_MESSAGES.loginUnavailable),
    ).toBeInTheDocument();
    expect(window.location.pathname).not.toMatch(/chat/);
    expect(localStorage.getItem("cartin_ai_auth")).toBeNull();
  });

  it("shows unavailable message on access request", async () => {
    const user = userEvent.setup();
    renderAuth("/login?mode=access");

    await user.type(
      screen.getByLabelText("Email professionnel"),
      "ops@entreprise.com",
    );
    await user.selectOptions(screen.getByLabelText("Rôle souhaité"), "Direction");
    await user.type(
      screen.getByLabelText("Message aux administrateurs"),
      "Besoin dashboard",
    );
    await user.click(screen.getByRole("button", { name: "Envoyer la demande" }));

    expect(
      await screen.findByText(AUTH_MESSAGES.accessUnavailable),
    ).toBeInTheDocument();
    expect(localStorage.getItem("cartin_ai_access_requests")).toBeNull();
  });

  it("disables submit while login is pending", async () => {
    const user = userEvent.setup();
    renderAuth();

    await user.type(screen.getByLabelText("Email"), "user@cartin.com");
    await user.type(screen.getByLabelText("Mot de passe"), "secret");
    const submit = screen.getByRole("button", { name: "Entrer dans Cartin AI" });
    await user.click(submit);

    await waitFor(() => {
      expect(
        screen.getByText(AUTH_MESSAGES.loginUnavailable),
      ).toBeInTheDocument();
    });
  });

  it("shows Google unavailable message", async () => {
    const user = userEvent.setup();
    renderAuth();
    await user.click(
      screen.getByRole("button", { name: /Continuer avec Google/i }),
    );
    expect(
      await screen.findByText(AUTH_MESSAGES.googleUnavailable),
    ).toBeInTheDocument();
  });
});
