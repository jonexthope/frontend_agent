<script setup>
defineProps({
  dark: { type: Boolean, default: false },
  label: { type: String, default: "Chargement" },
});
</script>

<template>
  <span
    :class="['auth-loader', dark ? 'auth-loader--dark' : '']"
    role="status"
    :aria-label="label"
  />
</template>
