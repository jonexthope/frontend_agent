import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChatPage } from "@/pages/chat/ChatPage";
import * as chatService from "@/services/chat/chat.service";

vi.mock("@/services/chat/chat.service", () => ({
  sendChatMessage: vi.fn(),
}));

describe("ChatPage integration", () => {
  let setItemSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    setItemSpy = vi.spyOn(Storage.prototype, "setItem");
    vi.mocked(chatService.sendChatMessage).mockReset();
    vi.mocked(chatService.sendChatMessage).mockResolvedValue({
      answer: "Réponse réelle du backend Cartin AI.",
      session_id: "11111111-1111-1111-1111-111111111111",
      interaction_id: "22222222-2222-2222-2222-222222222222",
    });
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

  it("submits message by button then shows API reply", async () => {
    render(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>,
    );

    const textarea = screen.getByPlaceholderText("Écrivez votre message à Cartin AI…");
    fireEvent.change(textarea, { target: { value: "Quel est le CA ?" } });
    fireEvent.click(screen.getByRole("button", { name: "Envoyer" }));

    expect(screen.getByText("Vous")).toBeInTheDocument();
    expect(screen.getByLabelText("Cartin AI prépare une réponse")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText(/Réponse réelle du backend/i)).toBeInTheDocument(),
    );

    expect(chatService.sendChatMessage).toHaveBeenCalledWith({
      question: "Quel est le CA ?",
      external_id: "frontend-agent-temporary-user",
    });
  });

  it("reuses session_id on second message", async () => {
    render(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>,
    );

    const textarea = screen.getByPlaceholderText("Écrivez votre message à Cartin AI…");
    fireEvent.change(textarea, { target: { value: "Première question" } });
    fireEvent.click(screen.getByRole("button", { name: "Envoyer" }));

    await waitFor(() =>
      expect(screen.getByText(/Réponse réelle du backend/i)).toBeInTheDocument(),
    );

    fireEvent.change(textarea, { target: { value: "Deuxième question" } });
    fireEvent.click(screen.getByRole("button", { name: "Envoyer" }));

    await waitFor(() =>
      expect(chatService.sendChatMessage).toHaveBeenLastCalledWith(
        expect.objectContaining({
          question: "Deuxième question",
          session_id: "11111111-1111-1111-1111-111111111111",
        }),
      ),
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

  it("creates a new conversation and does not store fake session", async () => {
    render(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>,
    );

    const textarea = screen.getByPlaceholderText("Écrivez votre message à Cartin AI…");
    fireEvent.change(textarea, { target: { value: "Question" } });
    fireEvent.click(screen.getByRole("button", { name: "Envoyer" }));
    await waitFor(() =>
      expect(screen.getByText(/Réponse réelle du backend/i)).toBeInTheDocument(),
    );

    fireEvent.click(screen.getAllByRole("button", { name: /Nouvelle conversation/i })[0]);
    expect(screen.getByText("Bonjour, comment puis-je vous aider ?")).toBeInTheDocument();
    expect(
      setItemSpy.mock.calls.some((call: [string, string]) => call[0] === "cartin_ai_auth"),
    ).toBe(false);
  });

  it("suggestions call the same API flow", async () => {
    render(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getAllByRole("button", { name: /CA HT ce mois vs M-1/i })[0]);

    await waitFor(() =>
      expect(chatService.sendChatMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          question: "CA HT ce mois vs M-1",
          external_id: "frontend-agent-temporary-user",
        }),
      ),
    );
  });
});
