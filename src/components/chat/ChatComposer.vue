<script setup>
import { computed } from "vue";
import { CHAT_HINT } from "@/constants/chat.constants.js";
import ChatToolbar from "@/components/chat/ChatToolbar.vue";
import SendButton from "@/components/chat/SendButton.vue";

const props = defineProps({
  modelValue: { type: String, required: true },
  isSending: { type: Boolean, required: true },
  liveDataEnabled: { type: Boolean, required: true },
  analysisEnabled: { type: Boolean, required: true },
  textareaRef: { type: Object, default: null },
});

const emit = defineEmits([
  "update:modelValue",
  "submit",
  "keydown",
  "toggle-live-data",
  "toggle-analysis",
  "input",
]);

const isDisabled = computed(() => !props.modelValue.trim() || props.isSending);
</script>

<template>
  <div class="chat-composer-wrap">
    <div class="chat-composer-inner">
      <div class="chat-composer">
        <textarea
          :ref="textareaRef"
          rows="1"
          :value="modelValue"
          placeholder="Écrivez votre message à Cartin AI…"
          @input="
            $emit('update:modelValue', $event.target.value);
            $emit('input');
          "
          @keydown="$emit('keydown', $event)"
        />
        <div class="chat-composer-bar">
          <ChatToolbar
            :live-data-enabled="liveDataEnabled"
            :analysis-enabled="analysisEnabled"
            @toggle-live-data="$emit('toggle-live-data')"
            @toggle-analysis="$emit('toggle-analysis')"
          />
          <SendButton :disabled="isDisabled" @click="$emit('submit')" />
        </div>
      </div>
      <div class="chat-hint">{{ CHAT_HINT }}</div>
    </div>
  </div>
</template>
