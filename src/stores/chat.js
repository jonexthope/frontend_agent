import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { sendChatMessage } from "@/services/chat/chat.service";
import { getChatExternalId } from "@/services/identity/chatIdentity.service";
import { getChatErrorMessage } from "@/utils/chatErrors";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const useChatStore = defineStore("chat", () => {
  const messages = ref([]);
  const sessionId = ref(null);
  const isSending = ref(false);
  const error = ref(null);
  let sessionIdRef = null;

  const hasMessages = computed(() => messages.value.length > 0);

  function clearError() {
    error.value = null;
  }

  function startNewConversation() {
    sessionIdRef = null;
    sessionId.value = null;
    messages.value = [];
    error.value = null;
    isSending.value = false;
  }

  async function sendMessage(rawQuestion) {
    const question = String(rawQuestion ?? "").trim();
    if (!question || isSending.value) return false;

    const userMessageId = createId();
    messages.value.push({
      id: userMessageId,
      role: "user",
      content: question,
      createdAt: new Date().toISOString(),
      status: "sending",
      originalQuestion: question,
    });

    isSending.value = true;
    error.value = null;

    try {
      const startedAt = performance.now();
      const response = await sendChatMessage({
        question,
        external_id: getChatExternalId(),
        ...(sessionIdRef ? { session_id: sessionIdRef } : {}),
      });
      const durationMs = Math.round(performance.now() - startedAt);

      sessionIdRef = response.session_id;
      sessionId.value = response.session_id;

      const userMessage = messages.value.find((m) => m.id === userMessageId);
      if (userMessage) userMessage.status = "sent";

      messages.value.push({
        id: createId(),
        role: "assistant",
        content: response.answer,
        createdAt: new Date().toISOString(),
        status: "sent",
        interactionId: response.interaction_id,
        durationMs,
      });

      return true;
    } catch (caughtError) {
      const userMessage = messages.value.find((m) => m.id === userMessageId);
      if (userMessage) userMessage.status = "error";
      error.value = getChatErrorMessage(caughtError);
      return false;
    } finally {
      isSending.value = false;
    }
  }

  async function retryMessage(messageId) {
    if (isSending.value) return;
    const message = messages.value.find((item) => item.id === messageId);
    if (!message || message.role !== "user" || !message.originalQuestion) return;
    messages.value = messages.value.filter((item) => item.id !== messageId);
    await sendMessage(message.originalQuestion);
  }

  return {
    messages,
    sessionId,
    isSending,
    error,
    hasMessages,
    sendMessage,
    retryMessage,
    startNewConversation,
    clearError,
  };
});
