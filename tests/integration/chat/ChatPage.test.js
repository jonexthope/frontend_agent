import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createRouter, createWebHistory } from "vue-router";
import * as chatService from "@/services/chat/chat.service.js";
import * as historyService from "@/services/chat/history.service.js";

vi.mock("@/components/common/CartinLogo.vue", () => ({
  default: { name: "CartinLogo", template: "<span />" },
}));

vi.mock("@/services/chat/chat.service.js", () => ({
  sendChatMessage: vi.fn(),
}));

vi.mock("@/services/chat/history.service.js", () => ({
  archiveConversation: vi.fn(),
  listConversations: vi.fn(),
  getConversation: vi.fn(),
}));

import ChatPage from "@/pages/chat/ChatPage.vue";
import { useChatStore } from "@/stores/chat.js";
import { useHistoryStore } from "@/stores/history.js";

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/chat", component: ChatPage }],
});

function atLocalDaysAgo(days, hour = 12) {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function atLocalHoursAgo(hours) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

describe("ChatPage integration", () => {
  beforeEach(async () => {
    setActivePinia(createPinia());
    vi.mocked(chatService.sendChatMessage).mockReset();
    vi.mocked(historyService.listConversations).mockReset();
    vi.mocked(historyService.getConversation).mockReset();
    vi.mocked(historyService.archiveConversation).mockReset();

    vi.mocked(chatService.sendChatMessage).mockResolvedValue({
      answer: "Réponse réelle du backend Cartin AI.",
      session_id: "11111111-1111-1111-1111-111111111111",
      interaction_id: "22222222-2222-2222-2222-222222222222",
    });

    vi.mocked(historyService.listConversations).mockResolvedValue({
      items: [
        {
          session_id: "sess-today",
          title: "Conversation du jour",
          created_at: atLocalHoursAgo(1),
          last_activity_at: atLocalHoursAgo(1),
          status: "active",
          interaction_count: 1,
        },
        {
          session_id: "sess-yesterday",
          title: "Conversation d'hier",
          created_at: atLocalDaysAgo(1),
          last_activity_at: atLocalDaysAgo(1),
          status: "active",
          interaction_count: 1,
        },
        {
          session_id: "sess-old",
          title: "Trop ancienne",
          created_at: atLocalDaysAgo(20),
          last_activity_at: atLocalDaysAgo(20),
          status: "active",
          interaction_count: 1,
        },
      ],
      total: 3,
      page: 1,
      page_size: 100,
    });
    vi.mocked(historyService.archiveConversation).mockResolvedValue({
      session_id: "sess-yesterday",
      title: "Conversation d'hier",
      created_at: atLocalDaysAgo(1),
      last_activity_at: atLocalDaysAgo(1),
      status: "archived",
      interactions: [],
    });

    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    await router.push("/chat");
    await router.isReady();
  });

  async function mountPage() {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(ChatPage, {
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    return wrapper;
  }

  it("loads conversations on mount and shows period groups", async () => {
    const wrapper = await mountPage();

    expect(historyService.listConversations).toHaveBeenCalledWith(
      expect.objectContaining({
        external_id: "frontend-agent-temporary-user",
        status: "active",
        page: 1,
        page_size: 100,
      }),
    );
    expect(wrapper.text()).toContain("Aujourd'hui");
    expect(wrapper.text()).toContain("Conversation du jour");
    expect(wrapper.text()).toContain("Hier");
    expect(wrapper.text()).toContain("Conversation d'hier");
    expect(wrapper.text()).not.toContain("Trop ancienne");
  });

  it("loads conversation detail on click and continues with same session_id", async () => {
    vi.mocked(historyService.getConversation).mockResolvedValue({
      session_id: "sess-today",
      title: "Conversation du jour",
      created_at: atLocalHoursAgo(1),
      last_activity_at: atLocalHoursAgo(1),
      status: "active",
      interactions: [
        {
          interaction_id: "i-old",
          question: "Ancienne question",
          answer: "Ancienne réponse",
          status: "success",
          created_at: atLocalHoursAgo(1),
        },
      ],
    });

    const wrapper = await mountPage();
    const items = wrapper.findAll(".chat-hist-item");
    const todayItem = items.find((item) =>
      item.text().includes("Conversation du jour"),
    );
    expect(todayItem).toBeTruthy();
    await todayItem.trigger("click");
    await flushPromises();

    expect(historyService.getConversation).toHaveBeenCalledWith("sess-today");
    expect(wrapper.text()).toContain("Ancienne question");
    expect(wrapper.text()).toContain("Ancienne réponse");

    const textarea = wrapper.get("textarea");
    await textarea.setValue("Suite");
    await wrapper.get('[aria-label="Envoyer"]').trigger("click");
    await flushPromises();

    expect(chatService.sendChatMessage).toHaveBeenCalledWith({
      question: "Suite",
      session_id: "sess-today",
      external_id: "frontend-agent-temporary-user",
    });
  });

  it("refreshes history after a successful POST /chat", async () => {
    const wrapper = await mountPage();
    expect(historyService.listConversations).toHaveBeenCalledTimes(1);

    const textarea = wrapper.get("textarea");
    await textarea.setValue("Quel est le CA ?");
    await wrapper.get('[aria-label="Envoyer"]').trigger("click");
    await flushPromises();

    expect(chatService.sendChatMessage).toHaveBeenCalled();
    expect(historyService.listConversations).toHaveBeenCalledTimes(2);
  });

  it("clears chat on new conversation without calling POST /chat", async () => {
    const wrapper = await mountPage();
    const chat = useChatStore();
    const history = useHistoryStore();

    chat.loadConversation({
      sessionId: "sess-today",
      messages: [
        {
          id: "q1",
          role: "user",
          content: "Hello",
          createdAt: atLocalHoursAgo(1),
          status: "sent",
        },
      ],
    });
    history.setSelectedConversationId("sess-today");
    vi.mocked(chatService.sendChatMessage).mockClear();

    await wrapper.get(".chat-btn-new").trigger("click");
    await flushPromises();

    expect(chat.messages).toEqual([]);
    expect(chat.sessionId).toBeNull();
    expect(history.selectedConversationId).toBeNull();
    expect(chatService.sendChatMessage).not.toHaveBeenCalled();
  });

  it("shows welcome and four suggestions", async () => {
    const wrapper = await mountPage();
    expect(wrapper.text()).toContain("Bonjour, comment puis-je vous aider ?");
    expect(wrapper.text()).toContain("CA HT ce mois vs M-1");
  });

  it("shows delete confirmation and archives conversation", async () => {
    const wrapper = await mountPage();
    const row = wrapper
      .findAll(".chat-hist-row")
      .find((item) => item.text().includes("Conversation d'hier"));
    expect(row).toBeTruthy();

    await row.find(".chat-hist-actions-btn").trigger("click");
    await row.find(".chat-hist-menu-delete").trigger("click");
    expect(wrapper.text()).toContain("Supprimer cette conversation ?");

    const confirmButtons = wrapper.findAll(".confirm-submit");
    await confirmButtons[0].trigger("click");
    await flushPromises();

    expect(historyService.archiveConversation).toHaveBeenCalledWith(
      "sess-yesterday",
    );
    expect(wrapper.text()).not.toContain("Conversation d'hier");
  });

  it("does not remove conversation when archive fails", async () => {
    vi.mocked(historyService.archiveConversation).mockRejectedValue(
      new Error("fail"),
    );
    const wrapper = await mountPage();
    const row = wrapper
      .findAll(".chat-hist-row")
      .find((item) => item.text().includes("Conversation d'hier"));
    await row.find(".chat-hist-actions-btn").trigger("click");
    await row.find(".chat-hist-menu-delete").trigger("click");
    await wrapper.find(".confirm-submit").trigger("click");
    await flushPromises();

    expect(wrapper.text()).toContain("Impossible de supprimer cette conversation.");
    expect(wrapper.text()).toContain("Conversation d'hier");
  });
});
