<script setup>
import {
  CHAT_INTRO_DESCRIPTION,
  CHAT_INTRO_TITLE,
} from "@/constants/chat.constants.js";
import SuggestionList from "@/components/chat/SuggestionList.vue";

defineProps({
  disabled: { type: Boolean, default: false },
});

defineEmits(["select-suggestion"]);
</script>

<template>
  <div class="chat-welcome">
    <div class="chat-mark">AI</div>
    <h1>{{ CHAT_INTRO_TITLE }}</h1>
    <p>{{ CHAT_INTRO_DESCRIPTION }}</p>
    <SuggestionList :disabled="disabled" @select="$emit('select-suggestion', $event)" />
  </div>
</template>
