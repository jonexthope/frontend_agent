<script setup>
import { toRefs } from "vue";
import MessageBubble from "@/components/chat/MessageBubble.vue";
import WelcomeScreen from "@/components/chat/WelcomeScreen.vue";
import TypingIndicator from "@/components/chat/TypingIndicator.vue";
import { useChatAutoScroll } from "@/composables/chat/useChatAutoScroll.js";

const props = defineProps({
  messages: { type: Array, required: true },
  isSending: { type: Boolean, required: true },
  suggestionsDisabled: { type: Boolean, default: false },
});

defineEmits(["select-suggestion", "retry"]);

const { messages, isSending } = toRefs(props);
const { endElement } = useChatAutoScroll(messages, isSending);
</script>

<template>
  <div class="chat-thread" :aria-busy="isSending">
    <div class="chat-thread-inner">
      <WelcomeScreen
        v-if="messages.length === 0"
        :disabled="suggestionsDisabled || isSending"
        @select-suggestion="$emit('select-suggestion', $event)"
      />
      <template v-else>
        <MessageBubble
          v-for="message in messages"
          :key="message.id"
          :message="message"
          @retry="$emit('retry', $event)"
        />
        <article v-if="isSending" class="chat-msg bot">
          <div class="chat-av-bot">AI</div>
          <div class="chat-bubble">
            <div class="chat-who">Cartin AI</div>
            <div class="chat-body">
              <TypingIndicator />
            </div>
          </div>
        </article>
      </template>
      <div ref="endElement" />
    </div>
  </div>
</template>
