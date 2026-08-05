<script setup>
defineProps({
  className: { type: String, default: "" },
  title: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  ariaLabel: { type: String, default: "" },
});
</script>

<template>
  <button
    :class="['chat-icon-btn', className].filter(Boolean).join(' ')"
    type="button"
    :title="title"
    :disabled="disabled"
    :aria-label="ariaLabel || title"
  >
    <slot />
  </button>
</template>
