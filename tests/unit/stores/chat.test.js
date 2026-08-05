import { beforeEach, describe, expect, it, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useChatStore } from "@/stores/chat.js";
import * as chatService from "@/services/chat/chat.service.js";
import { ApiError, NetworkError } from "@/services/api/apiError.js";

vi.mock("@/services/chat/chat.service.js", () => ({
  sendChatMessage: vi.fn(),
}));

describe("useChatStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.mocked(chatService.sendChatMessage).mockReset();
  });

  it("adds user message immediately and then assistant reply", async () => {
    vi.mocked(chatService.sendChatMessage).mockResolvedValue({
      answer: "Réponse API",
      session_id: "session-1",
      interaction_id: "interaction-1",
    });

    const store = useChatStore();
    await store.sendMessage("  Bonjour  ");

    expect(store.messages).toHaveLength(2);
    expect(store.messages[0]).toMatchObject({
      role: "user",
      content: "Bonjour",
      status: "sent",
    });
    expect(store.messages[1]).toMatchObject({
      role: "assistant",
      content: "Réponse API",
      interactionId: "interaction-1",
      status: "sent",
    });
    expect(typeof store.messages[1].durationMs).toBe("number");
    expect(store.messages[1].durationMs).toBeGreaterThanOrEqual(0);
    expect(store.sessionId).toBe("session-1");
    expect(chatService.sendChatMessage).toHaveBeenCalledWith({
      question: "Bonjour",
      external_id: "frontend-agent-temporary-user",
    });
  });

  it("reuses session_id on next message", async () => {
    vi.mocked(chatService.sendChatMessage).mockResolvedValue({
      answer: "ok",
      session_id: "session-1",
      interaction_id: "i1",
    });

    const store = useChatStore();
    await store.sendMessage("Q1");
    await store.sendMessage("Q2");

    expect(chatService.sendChatMessage).toHaveBeenLastCalledWith({
      question: "Q2",
      session_id: "session-1",
      external_id: "frontend-agent-temporary-user",
    });
  });

  it("marks user message as error on failure", async () => {
    vi.mocked(chatService.sendChatMessage).mockRejectedValue(
      new NetworkError("Impossible de contacter le serveur."),
    );

    const store = useChatStore();
    await store.sendMessage("Q");

    expect(store.messages[0]?.status).toBe("error");
    expect(store.error).toMatch(/Impossible de communiquer/i);
  });

  it("resets conversation with startNewConversation", async () => {
    vi.mocked(chatService.sendChatMessage).mockResolvedValue({
      answer: "ok",
      session_id: "session-1",
      interaction_id: "i1",
    });

    const store = useChatStore();
    await store.sendMessage("Q");
    store.startNewConversation();

    expect(store.messages).toEqual([]);
    expect(store.sessionId).toBeNull();
    expect(store.error).toBeNull();
  });

  it("prevents double send while busy", async () => {
    let resolveRequest;
    vi.mocked(chatService.sendChatMessage).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
    );

    const store = useChatStore();
    void store.sendMessage("Q1");
    void store.sendMessage("Q2");

    expect(chatService.sendChatMessage).toHaveBeenCalledTimes(1);

    resolveRequest?.({
      answer: "ok",
      session_id: "s1",
      interaction_id: "i1",
    });
    await vi.waitFor(() => expect(store.isSending).toBe(false));
  });
});
