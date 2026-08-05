<script setup>
import CartinLogo from "@/components/common/CartinLogo.vue";
import NewConversationButton from "@/components/chat/NewConversationButton.vue";
import ConversationHistory from "@/components/chat/ConversationHistory.vue";
import UserProfile from "@/components/chat/UserProfile.vue";

defineProps({
  conversations: { type: Array, required: true },
  activeConversationId: { type: String, required: true },
  isOpen: { type: Boolean, default: false },
});

defineEmits(["new-conversation", "select-conversation", "logout"]);
</script>

<template>
  <aside :class="['chat-sidebar', isOpen ? 'open' : '']">
    <div class="chat-side-brand">
      <CartinLogo :width="128" />
      <div class="chat-side-tag">Assistant conversationnel</div>
    </div>
    <NewConversationButton @click="$emit('new-conversation')" />
    <ConversationHistory
      :conversations="conversations"
      :active-conversation-id="activeConversationId"
      @select-conversation="$emit('select-conversation', $event)"
    />
    <UserProfile @logout="$emit('logout')" />
  </aside>
</template>
