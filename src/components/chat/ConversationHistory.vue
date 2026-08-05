<script setup>
import ConversationGroup from "@/components/chat/ConversationGroup.vue";

defineProps({
  conversations: { type: Array, required: true },
  activeConversationId: { type: String, required: true },
});

defineEmits(["select-conversation"]);
</script>

<template>
  <div class="chat-hist">
    <template v-if="conversations.length === 0">
      <div class="chat-hist-label">Conversations</div>
      <p class="chat-hist-empty">Aucune conversation.</p>
    </template>
    <ConversationGroup
      v-else
      label="Conversations"
      :conversations="conversations"
      :active-conversation-id="activeConversationId"
      @select-conversation="$emit('select-conversation', $event)"
    />
  </div>
</template>
