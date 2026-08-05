<script setup>
defineProps({
  type: { type: String, required: true },
  message: { type: String, required: true },
});
</script>

<template>
  <div
    :class="`auth-alert auth-alert--${type}`"
    :role="type === 'error' ? 'alert' : 'status'"
    :aria-live="type === 'error' ? 'assertive' : 'polite'"
  >
    {{ message }}
  </div>
</template>
