import { computed, ref } from "vue";
import { defineStore } from "pinia";
import {
  archiveConversation,
  getConversation,
  listConversations,
} from "@/services/chat/history.service";
import { ApiError, NetworkError } from "@/services/api/apiError";
import {
  getHistoryStartDate,
  groupConversationsByPeriod,
} from "@/tools/conversationPeriods";
import { useChatStore } from "@/stores/chat";

const HISTORY_PAGE_SIZE = 100;
const FALLBACK_TITLE = "Conversation";

function mapConversationSummary(item) {
  return {
    id: String(item.session_id),
    sessionId: String(item.session_id),
    title: item.title || FALLBACK_TITLE,
    createdAt: item.created_at,
    lastActivityAt: item.last_activity_at,
    interactionCount: item.interaction_count,
    status: item.status,
  };
}

export function mapInteractionsToMessages(interactions) {
  const messages = [];
  for (const interaction of interactions ?? []) {
    const interactionId = String(interaction.interaction_id);
    messages.push({
      id: `question-${interactionId}`,
      role: "user",
      content: interaction.question,
      createdAt: interaction.created_at,
      status: "sent",
    });
    if (interaction.answer != null) {
      messages.push({
        id: `answer-${interactionId}`,
        role: "assistant",
        content: interaction.answer,
        createdAt: interaction.created_at,
        status: "sent",
        interactionId,
      });
    }
  }
  return messages;
}

function getHistoryListErrorMessage(error) {
  if (error instanceof NetworkError) {
    return "Impossible de communiquer avec Cartin AI.";
  }
  return "Impossible de charger l'historique des conversations.";
}

function getHistoryDetailErrorMessage(error) {
  if (error instanceof NetworkError) {
    return "Impossible de communiquer avec Cartin AI.";
  }
  if (error instanceof ApiError && error.status === 404) {
    return "Cette conversation n'est plus disponible.";
  }
  return "Impossible de charger l'historique des conversations.";
}

function getDeleteErrorMessage(error) {
  if (error instanceof NetworkError) {
    return "Impossible de communiquer avec Cartin AI.";
  }
  return "Impossible de supprimer cette conversation.";
}

export const useHistoryStore = defineStore("history", () => {
  const conversations = ref([]);
  const selectedConversationId = ref(null);
  const isLoadingHistory = ref(false);
  const isLoadingConversation = ref(false);
  const deletingConversationId = ref(null);
  const error = ref(null);

  const groupedConversations = computed(() =>
    groupConversationsByPeriod(conversations.value),
  );

  function clearError() {
    error.value = null;
  }

  function clearSelection() {
    selectedConversationId.value = null;
  }

  function setSelectedConversationId(sessionId) {
    selectedConversationId.value = sessionId ? String(sessionId) : null;
  }

  async function loadHistory() {
    isLoadingHistory.value = true;
    error.value = null;

    try {
      const response = await listConversations({
        status: "active",
        date_from: getHistoryStartDate().toISOString(),
        page: 1,
        page_size: HISTORY_PAGE_SIZE,
      });

      conversations.value = (response.items ?? []).map(mapConversationSummary);
      // Current feature loads a single page (page_size=100 = backend max).
      // If response.total > page_size, older in-window items may be truncated.
    } catch (caughtError) {
      conversations.value = [];
      error.value = getHistoryListErrorMessage(caughtError);
    } finally {
      isLoadingHistory.value = false;
    }
  }

  async function refreshHistory() {
    await loadHistory();
  }

  async function selectConversation(sessionId) {
    if (!sessionId || isLoadingConversation.value) return false;

    isLoadingConversation.value = true;
    error.value = null;

    try {
      const detail = await getConversation(sessionId);
      const loadedSessionId = String(detail.session_id);
      const chatStore = useChatStore();
      const mappedMessages = mapInteractionsToMessages(detail.interactions);
      const current = conversations.value.find(
        (item) => item.sessionId === loadedSessionId,
      );
      if (current && !current.title && mappedMessages.length > 0) {
        current.title = mappedMessages[0].content || FALLBACK_TITLE;
      } else if (current && current.title === FALLBACK_TITLE && mappedMessages.length > 0) {
        current.title = mappedMessages[0].content || FALLBACK_TITLE;
      }

      chatStore.loadConversation({
        sessionId: loadedSessionId,
        messages: mappedMessages,
      });

      selectedConversationId.value = loadedSessionId;
      return true;
    } catch (caughtError) {
      error.value = getHistoryDetailErrorMessage(caughtError);
      return false;
    } finally {
      isLoadingConversation.value = false;
    }
  }

  async function deleteConversation(sessionId) {
    if (!sessionId || deletingConversationId.value) return false;
    const normalizedId = String(sessionId);
    deletingConversationId.value = normalizedId;
    error.value = null;

    try {
      await archiveConversation(normalizedId);

      const wasActive = selectedConversationId.value === normalizedId;
      conversations.value = conversations.value.filter(
        (item) => item.sessionId !== normalizedId,
      );

      if (wasActive) {
        const chatStore = useChatStore();
        chatStore.startNewConversation();
        selectedConversationId.value = null;
      }
      return true;
    } catch (caughtError) {
      error.value = getDeleteErrorMessage(caughtError);
      return false;
    } finally {
      deletingConversationId.value = null;
    }
  }

  return {
    conversations,
    selectedConversationId,
    isLoadingHistory,
    isLoadingConversation,
    deletingConversationId,
    error,
    groupedConversations,
    loadHistory,
    refreshHistory,
    selectConversation,
    deleteConversation,
    clearSelection,
    clearError,
    setSelectedConversationId,
  };
});
