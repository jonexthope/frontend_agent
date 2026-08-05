<script setup>
import { computed } from "vue";
import { CHAT_USER_MOCK } from "@/mocks/user.mock.js";
import { formatMessageContent } from "@/utils/messageFormat.js";
import MessageActions from "@/components/chat/MessageActions.vue";

const props = defineProps({
  message: { type: Object, required: true },
});

defineEmits(["retry"]);

const isUser = computed(() => props.message.role === "user");
const who = computed(() => (isUser.value ? "Vous" : "Cartin AI"));
const blocks = computed(() => formatMessageContent(props.message.content));
const hasError = computed(() => props.message.status === "error");
</script>

<template>
  <article
    :class="[
      'chat-msg',
      isUser ? 'user' : 'bot',
      hasError ? 'chat-msg--error' : '',
    ]"
    :aria-live="isUser ? undefined : 'polite'"
  >
    <div v-if="isUser" class="chat-av-user">{{ CHAT_USER_MOCK.initials }}</div>
    <div v-else class="chat-av-bot">AI</div>

    <div class="chat-bubble">
      <div class="chat-who">{{ who }}</div>
      <div class="chat-body">
        <template v-for="(block, index) in blocks" :key="index">
          <span
            v-if="block.type === 'kpi'"
            class="chat-kpi-chip"
          >
            {{ block.label }} {{ block.value }}
            <em v-if="block.trend" :class="block.trendDirection === 'down' ? 'down' : ''">
              {{ block.trend }}
            </em>
          </span>
          <ul v-else-if="block.type === 'list'">
            <li v-for="(item, itemIndex) in block.items" :key="itemIndex">
              <template v-for="(part, partIndex) in item" :key="partIndex">
                <strong v-if="part.type === 'bold'">{{ part.value }}</strong>
                <code v-else-if="part.type === 'code'">{{ part.value }}</code>
                <span v-else>{{ part.value }}</span>
              </template>
            </li>
          </ul>
          <p v-else>
            <template v-for="(part, partIndex) in block.parts" :key="partIndex">
              <strong v-if="part.type === 'bold'">{{ part.value }}</strong>
              <code v-else-if="part.type === 'code'">{{ part.value }}</code>
              <span v-else>{{ part.value }}</span>
            </template>
          </p>
        </template>
      </div>

      <div v-if="hasError" class="chat-msg-error">
        <p>L’envoi a échoué.</p>
        <button
          type="button"
          class="chat-retry-btn"
          aria-label="Réessayer l’envoi du message"
          @click="$emit('retry', message.id)"
        >
          Réessayer
        </button>
      </div>

      <MessageActions
        v-if="!isUser && message.status === 'sent'"
        :content="message.content"
      />
    </div>
  </article>
</template>
