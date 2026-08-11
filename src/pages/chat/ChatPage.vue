<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import ChatLayout from "@/layouts/ChatLayout.vue";
import ConversationSidebar from "@/components/chat/ConversationSidebar.vue";
import ChatHeader from "@/components/chat/ChatHeader.vue";
import MessageList from "@/components/chat/MessageList.vue";
import ChatComposer from "@/components/chat/ChatComposer.vue";
import { useChatStore } from "@/stores/chat.js";
import { useHistoryStore } from "@/stores/history.js";
import { useUiStore } from "@/stores/ui.js";
import { useChatComposer } from "@/composables/chat/useChatComposer.js";

const chatStore = useChatStore();
const historyStore = useHistoryStore();
const uiStore = useUiStore();

const { messages, isSending, error } = storeToRefs(chatStore);
const {
  groupedConversations,
  selectedConversationId,
  isLoadingHistory,
  isLoadingConversation,
  deletingConversationId,
  error: historyError,
} = storeToRefs(historyStore);
const { isSidebarOpen } = storeToRefs(uiStore);

const shareInfo = ref(null);

async function handleSend(question) {
  const success = await chatStore.sendMessage(question);
  if (!success) return;

  await historyStore.refreshHistory();
  if (chatStore.sessionId) {
    historyStore.setSelectedConversationId(chatStore.sessionId);
  }
}

const {
  message,
  textareaRef,
  liveDataEnabled,
  analysisEnabled,
  handleInput,
  submit,
  handleKeydown,
  toggleLiveData,
  toggleAnalysis,
  focus,
} = useChatComposer(handleSend);

const canShare = typeof window !== "undefined";

onMounted(() => {
  void historyStore.loadHistory();
});

async function handleShare() {
  if (!canShare) return;
  await navigator.clipboard.writeText(window.location.href);
  shareInfo.value = "Lien copié";
  setTimeout(() => {
    shareInfo.value = null;
  }, 1400);
}

function handleNewConversation() {
  chatStore.startNewConversation();
  historyStore.clearSelection();
  chatStore.clearError();
  focus();
  uiStore.closeOnMobile();
}

async function handleSelectConversation(sessionId) {
  const ok = await historyStore.selectConversation(sessionId);
  if (ok) uiStore.closeOnMobile();
}

async function handleDeleteConversation(sessionId) {
  const ok = await historyStore.deleteConversation(sessionId);
  if (ok) uiStore.closeOnMobile();
}

async function handleSuggestion(question) {
  if (isSending.value) return;
  await handleSend(question);
  focus();
}
</script>

<template>
  <ChatLayout :is-sidebar-open="isSidebarOpen" @close-sidebar="uiStore.closeSidebar">
    <template #sidebar>
      <ConversationSidebar
        :groups="groupedConversations"
        :active-conversation-id="selectedConversationId"
        :is-open="isSidebarOpen"
        :is-loading="isLoadingHistory"
        :is-loading-conversation="isLoadingConversation"
        :deleting-conversation-id="deletingConversationId"
        :error="historyError"
        @new-conversation="handleNewConversation"
        @select-conversation="handleSelectConversation"
        @delete-conversation="handleDeleteConversation"
        @retry-history="historyStore.loadHistory"
        @logout="shareInfo = 'Authentification non connectée'"
      />
    </template>

    <template #header>
      <ChatHeader
        :can-share="canShare"
        @open-sidebar="uiStore.openSidebar"
        @share="handleShare"
      />
    </template>

    <MessageList
      :messages="messages"
      :is-sending="isSending"
      :suggestions-disabled="isSending || isLoadingConversation"
      @select-suggestion="handleSuggestion"
      @retry="chatStore.retryMessage"
    />

    <div v-if="error" class="chat-toast" role="alert">{{ error }}</div>
    <div v-if="shareInfo" class="chat-toast">{{ shareInfo }}</div>

    <template #composer>
      <ChatComposer
        v-model="message"
        :is-sending="isSending || isLoadingConversation"
        :live-data-enabled="liveDataEnabled"
        :analysis-enabled="analysisEnabled"
        :textarea-ref="textareaRef"
        @input="handleInput"
        @submit="submit"
        @keydown="handleKeydown"
        @toggle-live-data="toggleLiveData"
        @toggle-analysis="toggleAnalysis"
      />
    </template>
  </ChatLayout>
</template>
