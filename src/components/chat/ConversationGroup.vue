<script setup>
import ConversationItem from "@/components/chat/ConversationItem.vue";

defineProps({
  label: { type: String, required: true },
  conversations: { type: Array, required: true },
  activeConversationId: { type: String, required: true },
  deletingConversationId: { type: String, default: null },
});

defineEmits(["select-conversation", "request-delete"]);
</script>

<template>
  <div class="chat-hist-label">{{ label }}</div>
  <ConversationItem
    v-for="conversation in conversations"
    :key="conversation.id"
    :conversation="conversation"
    :active="conversation.id === activeConversationId"
    :deleting="conversation.id === deletingConversationId"
    @select="$emit('select-conversation', $event)"
    @request-delete="$emit('request-delete', $event)"
  />
</template>
