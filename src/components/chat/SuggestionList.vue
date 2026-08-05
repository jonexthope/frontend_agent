<script setup>
import { CHAT_SUGGESTIONS } from "@/constants/chat.constants.js";
import SuggestionCard from "@/components/chat/SuggestionCard.vue";

defineProps({
  disabled: { type: Boolean, default: false },
});

defineEmits(["select"]);
</script>

<template>
  <div class="chat-suggestions">
    <SuggestionCard
      v-for="suggestion in CHAT_SUGGESTIONS"
      :key="suggestion.title"
      :title="suggestion.title"
      :description="suggestion.description"
      :disabled="disabled"
      @select="$emit('select', $event)"
    />
  </div>
</template>
