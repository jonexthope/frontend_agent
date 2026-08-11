<script setup>
import CartinLogo from "@/components/common/CartinLogo.vue";
import NewConversationButton from "@/components/chat/NewConversationButton.vue";
import ConversationHistory from "@/components/chat/ConversationHistory.vue";
import UserProfile from "@/components/chat/UserProfile.vue";

defineProps({
  groups: { type: Object, required: true },
  activeConversationId: { type: String, default: null },
  isOpen: { type: Boolean, default: false },
  isLoading: { type: Boolean, default: false },
  isLoadingConversation: { type: Boolean, default: false },
  deletingConversationId: { type: String, default: null },
  error: { type: String, default: null },
});

defineEmits([
  "new-conversation",
  "select-conversation",
  "delete-conversation",
  "retry-history",
  "logout",
]);
</script>

<template>
  <aside :class="['chat-sidebar', isOpen ? 'open' : '']">
    <div class="chat-side-brand">
      <CartinLogo :width="128" />
      <div class="chat-side-tag">Assistant conversationnel</div>
    </div>
    <NewConversationButton @click="$emit('new-conversation')" />
    <ConversationHistory
      :groups="groups"
      :active-conversation-id="activeConversationId"
      :is-loading="isLoading"
      :is-loading-conversation="isLoadingConversation"
      :deleting-conversation-id="deletingConversationId"
      :error="error"
      @select-conversation="$emit('select-conversation', $event)"
      @delete-conversation="$emit('delete-conversation', $event)"
      @retry="$emit('retry-history')"
    />
    <UserProfile @logout="$emit('logout')" />
  </aside>
</template>
