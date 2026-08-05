<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import ChatLayout from "@/layouts/ChatLayout.vue";
import ConversationSidebar from "@/components/chat/ConversationSidebar.vue";
import ChatHeader from "@/components/chat/ChatHeader.vue";
import MessageList from "@/components/chat/MessageList.vue";
import ChatComposer from "@/components/chat/ChatComposer.vue";
import { useChatStore } from "@/stores/chat.js";
import { useUiStore } from "@/stores/ui.js";
import { useChatComposer } from "@/composables/chat/useChatComposer.js";

const chatStore = useChatStore();
const uiStore = useUiStore();

const { messages, sessionId, isSending, error } = storeToRefs(chatStore);
const { isSidebarOpen } = storeToRefs(uiStore);

const shareInfo = ref(null);

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
} = useChatComposer((question) => chatStore.sendMessage(question));

const conversations = computed(() => {
  if (!sessionId.value && messages.value.length === 0) return [];
  const firstUser = messages.value.find((message) => message.role === "user");
  const title = firstUser?.content.slice(0, 42) || "Conversation en cours";
  return [
    {
      id: sessionId.value ?? "pending",
      title: title.length > 42 ? `${title}…` : title,
      messages: messages.value,
      status: "active",
      createdAt: messages.value[0]?.createdAt ?? new Date().toISOString(),
      updatedAt:
        messages.value[messages.value.length - 1]?.createdAt ??
        new Date().toISOString(),
    },
  ];
});

const canShare = typeof window !== "undefined";

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
  chatStore.clearError();
  focus();
  uiStore.closeOnMobile();
}

async function handleSuggestion(question) {
  if (isSending.value) return;
  await chatStore.sendMessage(question);
  focus();
}
</script>

<template>
  <ChatLayout :is-sidebar-open="isSidebarOpen" @close-sidebar="uiStore.closeSidebar">
    <template #sidebar>
      <ConversationSidebar
        :conversations="conversations"
        :active-conversation-id="sessionId ?? 'pending'"
        :is-open="isSidebarOpen"
        @new-conversation="handleNewConversation"
        @select-conversation="uiStore.closeOnMobile"
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
      :suggestions-disabled="isSending"
      @select-suggestion="handleSuggestion"
      @retry="chatStore.retryMessage"
    />

    <div v-if="error" class="chat-toast" role="alert">{{ error }}</div>
    <div v-if="shareInfo" class="chat-toast">{{ shareInfo }}</div>

    <template #composer>
      <ChatComposer
        v-model="message"
        :is-sending="isSending"
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
