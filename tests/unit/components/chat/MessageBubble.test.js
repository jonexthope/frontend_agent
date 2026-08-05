import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MessageBubble from "@/components/chat/MessageBubble.vue";

describe("MessageBubble", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("renders user bubble", () => {
    const wrapper = mount(MessageBubble, {
      props: {
        message: {
          id: "m1",
          role: "user",
          content: "Bonjour",
          createdAt: new Date().toISOString(),
          status: "sent",
        },
      },
    });
    expect(wrapper.text()).toContain("Vous");
    expect(wrapper.text()).toContain("Bonjour");
  });

  it("shows retry on error user message", async () => {
    const onRetry = vi.fn();
    const wrapper = mount(MessageBubble, {
      props: {
        message: {
          id: "m1",
          role: "user",
          content: "Question",
          createdAt: new Date().toISOString(),
          status: "error",
          originalQuestion: "Question",
        },
        onRetry,
      },
    });
    await wrapper.get('[aria-label="Réessayer l’envoi du message"]').trigger("click");
    expect(onRetry).toHaveBeenCalledWith("m1");
  });
});
