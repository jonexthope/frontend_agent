import { nextTick, ref, watch } from "vue";

export function useChatAutoScroll(messages, isSending) {
  const endElement = ref(null);

  watch(
    [messages, isSending],
    async () => {
      await nextTick();
      endElement.value?.scrollIntoView({ behavior: "smooth" });
    },
    { deep: true },
  );

  return { endElement };
}
