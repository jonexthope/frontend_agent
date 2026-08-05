<script setup>
defineEmits(["click"]);
defineProps({
  disabled: { type: Boolean, default: false },
});
</script>

<template>
  <button
    class="chat-btn-new"
    type="button"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 3v10M3 8h10"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
      />
    </svg>
    Nouvelle conversation
  </button>
</template>
