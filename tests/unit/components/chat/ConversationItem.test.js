import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ConversationItem from "@/components/chat/ConversationItem.vue";

const conversation = {
  id: "sess-1",
  title: "Quel est le CA par pays sur 2026 ?",
};

describe("ConversationItem", () => {
  it("emits select when clicking the main row", async () => {
    const wrapper = mount(ConversationItem, {
      props: { conversation, active: false, deleting: false },
    });

    await wrapper.get(".chat-hist-item").trigger("click");
    expect(wrapper.emitted("select")?.[0]).toEqual(["sess-1"]);
  });

  it("opens actions menu without selecting conversation", async () => {
    const wrapper = mount(ConversationItem, {
      props: { conversation, active: false, deleting: false },
    });

    await wrapper.get(".chat-hist-actions-btn").trigger("click");
    expect(wrapper.find(".chat-hist-menu").exists()).toBe(true);
    expect(wrapper.emitted("select")).toBeUndefined();
  });

  it("emits request-delete when delete is clicked", async () => {
    const wrapper = mount(ConversationItem, {
      props: { conversation, active: false, deleting: false },
    });

    await wrapper.get(".chat-hist-actions-btn").trigger("click");
    await wrapper.get(".chat-hist-menu-delete").trigger("click");

    expect(wrapper.emitted("request-delete")?.[0]).toEqual(["sess-1"]);
  });
});
