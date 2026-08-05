<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  disabled: { type: Boolean, default: false },
});

defineEmits(["select"]);
</script>

<template>
  <button
    class="chat-sug"
    type="button"
    :disabled="disabled"
    @click="$emit('select', title)"
  >
    <strong>{{ title }}</strong>
    <span>{{ description }}</span>
  </button>
</template>
