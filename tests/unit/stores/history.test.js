import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import {
  mapInteractionsToMessages,
  useHistoryStore,
} from "@/stores/history.js";
import { useChatStore } from "@/stores/chat.js";
import * as historyService from "@/services/chat/history.service.js";
import { ApiError, NetworkError } from "@/services/api/apiError.js";

vi.mock("@/services/chat/history.service.js", () => ({
  archiveConversation: vi.fn(),
  listConversations: vi.fn(),
  getConversation: vi.fn(),
}));

vi.mock("@/services/chat/chat.service.js", () => ({
  sendChatMessage: vi.fn(),
}));

describe("useHistoryStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.mocked(historyService.listConversations).mockReset();
    vi.mocked(historyService.getConversation).mockReset();
    vi.mocked(historyService.archiveConversation).mockReset();
  });

  it("has an empty initial state", () => {
    const store = useHistoryStore();
    expect(store.conversations).toEqual([]);
    expect(store.selectedConversationId).toBeNull();
    expect(store.isLoadingHistory).toBe(false);
    expect(store.error).toBeNull();
    expect(store.groupedConversations).toEqual({
      today: [],
      yesterday: [],
      thisWeek: [],
      thisMonth: [],
    });
  });

  it("loadHistory maps items and clears loading", async () => {
    const now = new Date();
    vi.mocked(historyService.listConversations).mockResolvedValue({
      items: [
        {
          session_id: "s-today",
          title: null,
          created_at: now.toISOString(),
          last_activity_at: now.toISOString(),
          status: "active",
          interaction_count: 2,
        },
      ],
      total: 1,
      page: 1,
      page_size: 100,
    });

    const store = useHistoryStore();
    const pending = store.loadHistory();
    expect(store.isLoadingHistory).toBe(true);
    await pending;

    expect(store.isLoadingHistory).toBe(false);
    expect(store.conversations).toHaveLength(1);
    expect(store.conversations[0]).toMatchObject({
      id: "s-today",
      title: "Conversation",
    });
    expect(store.groupedConversations.today).toHaveLength(1);
    expect(historyService.listConversations).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "active",
        page: 1,
        page_size: 100,
        date_from: expect.any(String),
      }),
    );
  });

  it("loadHistory stores a friendly error on failure", async () => {
    vi.mocked(historyService.listConversations).mockRejectedValue(
      new NetworkError("down"),
    );
    const store = useHistoryStore();
    await store.loadHistory();
    expect(store.error).toBe("Impossible de communiquer avec Cartin AI.");
    expect(store.conversations).toEqual([]);
  });

  it("selectConversation loads detail into the chat store", async () => {
    vi.mocked(historyService.getConversation).mockResolvedValue({
      session_id: "hist-1",
      title: null,
      created_at: "2026-08-03T08:00:00Z",
      last_activity_at: "2026-08-03T09:30:00Z",
      status: "active",
      interactions: [
        {
          interaction_id: "i1",
          question: "CA ?",
          answer: "125k",
          status: "success",
          created_at: "2026-08-03T09:30:00Z",
        },
      ],
    });

    const history = useHistoryStore();
    const chat = useChatStore();
    const ok = await history.selectConversation("hist-1");

    expect(ok).toBe(true);
    expect(history.selectedConversationId).toBe("hist-1");
    expect(chat.sessionId).toBe("hist-1");
    expect(chat.messages).toHaveLength(2);
    expect(chat.messages[0]).toMatchObject({
      role: "user",
      content: "CA ?",
    });
    expect(chat.messages[1]).toMatchObject({
      role: "assistant",
      content: "125k",
      interactionId: "i1",
    });
  });

  it("selectConversation maps 404 to a dedicated message", async () => {
    vi.mocked(historyService.getConversation).mockRejectedValue(
      new ApiError("gone", 404),
    );
    const store = useHistoryStore();
    const ok = await store.selectConversation("missing");
    expect(ok).toBe(false);
    expect(store.error).toBe("Cette conversation n'est plus disponible.");
  });

  it("clearSelection resets selectedConversationId", () => {
    const store = useHistoryStore();
    store.setSelectedConversationId("abc");
    store.clearSelection();
    expect(store.selectedConversationId).toBeNull();
  });

  it("mapInteractionsToMessages skips null answers", () => {
    const messages = mapInteractionsToMessages([
      {
        interaction_id: "i1",
        question: "Q",
        answer: null,
        status: "no_data",
        created_at: "2026-08-03T09:30:00Z",
      },
    ]);
    expect(messages).toHaveLength(1);
    expect(messages[0].role).toBe("user");
  });

  it("deletes an inactive conversation without resetting chat", async () => {
    vi.mocked(historyService.archiveConversation).mockResolvedValue({
      session_id: "b",
      title: "B",
      created_at: "2026-08-03T08:00:00Z",
      last_activity_at: "2026-08-03T09:30:00Z",
      status: "archived",
      interactions: [],
    });
    const store = useHistoryStore();
    store.conversations = [
      { id: "a", sessionId: "a", title: "A", lastActivityAt: new Date().toISOString() },
      { id: "b", sessionId: "b", title: "B", lastActivityAt: new Date().toISOString() },
    ];
    store.setSelectedConversationId("a");
    const chat = useChatStore();
    const spy = vi.spyOn(chat, "startNewConversation");

    const ok = await store.deleteConversation("b");

    expect(ok).toBe(true);
    expect(historyService.archiveConversation).toHaveBeenCalledWith("b");
    expect(store.conversations.map((c) => c.id)).toEqual(["a"]);
    expect(spy).not.toHaveBeenCalled();
    expect(store.selectedConversationId).toBe("a");
  });

  it("deletes an active conversation and resets chat", async () => {
    vi.mocked(historyService.archiveConversation).mockResolvedValue({
      session_id: "a",
      title: "A",
      created_at: "2026-08-03T08:00:00Z",
      last_activity_at: "2026-08-03T09:30:00Z",
      status: "archived",
      interactions: [],
    });
    const store = useHistoryStore();
    store.conversations = [
      { id: "a", sessionId: "a", title: "A", lastActivityAt: new Date().toISOString() },
    ];
    store.setSelectedConversationId("a");
    const chat = useChatStore();
    const spy = vi.spyOn(chat, "startNewConversation");

    const ok = await store.deleteConversation("a");

    expect(ok).toBe(true);
    expect(spy).toHaveBeenCalledOnce();
    expect(store.conversations).toEqual([]);
    expect(store.selectedConversationId).toBeNull();
  });

  it("keeps conversation when archive fails", async () => {
    vi.mocked(historyService.archiveConversation).mockRejectedValue(
      new ApiError("boom", 500),
    );
    const store = useHistoryStore();
    store.conversations = [
      { id: "a", sessionId: "a", title: "A", lastActivityAt: new Date().toISOString() },
    ];

    const ok = await store.deleteConversation("a");

    expect(ok).toBe(false);
    expect(store.conversations).toHaveLength(1);
    expect(store.error).toBe("Impossible de supprimer cette conversation.");
  });
});
