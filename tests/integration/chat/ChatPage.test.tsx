import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChatPage } from "@/pages/chat/ChatPage";

describe("ChatPage integration", () => {
  let setItemSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    setItemSpy = vi.spyOn(Storage.prototype, "setItem");
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("shows welcome and four suggestions", () => {
    render(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Bonjour, comment puis-je vous aider ?")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /CA HT ce mois vs M-1/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /Top 3 pays à risque/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /Segment RFM Champions/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /Brief exécutif du jour/i }).length).toBeGreaterThan(0);
  });

  it("submits message by button then shows mock reply", async () => {
    render(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>,
    );

    const textarea = screen.getByPlaceholderText("Écrivez votre message à Cartin AI…");
    fireEvent.change(textarea, { target: { value: "CA HT ce mois vs M-1" } });
    fireEvent.click(screen.getByRole("button", { name: "Envoyer" }));

    expect(screen.getByText("Vous")).toBeInTheDocument();
    expect(screen.getByLabelText("Cartin AI prépare une réponse")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText(/Voici la lecture/)).toBeInTheDocument(),
    );
  });

  it("submits with Enter", async () => {
    render(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>,
    );
    const textarea = screen.getByPlaceholderText("Écrivez votre message à Cartin AI…");

    fireEvent.change(textarea, { target: { value: "Ligne 1" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });
    await waitFor(() => expect(screen.getAllByText("Ligne 1").length).toBeGreaterThan(0));
  });

  it("creates a new conversation and does not store fake session", () => {
    render(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getAllByRole("button", { name: /Nouvelle conversation/i })[0]);
    expect(screen.getByText("Bonjour, comment puis-je vous aider ?")).toBeInTheDocument();
    expect(
      setItemSpy.mock.calls.some((call: [string, string]) => call[0] === "cartin_ai_auth"),
    ).toBe(false);
  });
});
