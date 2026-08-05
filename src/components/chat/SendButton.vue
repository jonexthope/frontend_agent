<script setup>
defineProps({
  disabled: { type: Boolean, required: true },
});

defineEmits(["click"]);
</script>

<template>
  <button
    class="chat-send"
    type="button"
    aria-label="Envoyer"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8h9M8.5 4L12.5 8 8.5 12"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</template>
