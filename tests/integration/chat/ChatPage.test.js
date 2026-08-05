import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createRouter, createWebHistory } from "vue-router";
import * as chatService from "@/services/chat/chat.service.js";

vi.mock("@/components/common/CartinLogo.vue", () => ({
  default: { name: "CartinLogo", template: "<span />"},
}));

vi.mock("@/services/chat/chat.service.js", () => ({
  sendChatMessage: vi.fn(),
}));

import ChatPage from "@/pages/chat/ChatPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/chat", component: ChatPage }],
});

describe("ChatPage integration", () => {
  beforeEach(async () => {
    setActivePinia(createPinia());
    vi.mocked(chatService.sendChatMessage).mockReset();
    vi.mocked(chatService.sendChatMessage).mockResolvedValue({
      answer: "Réponse réelle du backend Cartin AI.",
      session_id: "11111111-1111-1111-1111-111111111111",
      interaction_id: "22222222-2222-2222-2222-222222222222",
    });
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    await router.push("/chat");
    await router.isReady();
  });

  it("shows welcome and four suggestions", async () => {
    const wrapper = mount(ChatPage, {
      global: { plugins: [createPinia(), router] },
    });
    expect(wrapper.text()).toContain("Bonjour, comment puis-je vous aider ?");
    expect(wrapper.text()).toContain("CA HT ce mois vs M-1");
  });

  it("submits message and shows API reply", async () => {
    const wrapper = mount(ChatPage, {
      global: { plugins: [createPinia(), router] },
    });

    const textarea = wrapper.get("textarea");
    await textarea.setValue("Quel est le CA ?");
    await wrapper.get('[aria-label="Envoyer"]').trigger("click");

    await vi.waitFor(() =>
      expect(wrapper.text()).toMatch(/Réponse réelle du backend/i),
    );

    expect(chatService.sendChatMessage).toHaveBeenCalledWith({
      question: "Quel est le CA ?",
      external_id: "frontend-agent-temporary-user",
    });
  });
});
