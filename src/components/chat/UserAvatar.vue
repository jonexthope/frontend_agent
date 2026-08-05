<script setup>
defineProps({
  initials: { type: String, required: true },
});
</script>

<template>
  <div class="chat-user-av">{{ initials }}</div>
</template>
