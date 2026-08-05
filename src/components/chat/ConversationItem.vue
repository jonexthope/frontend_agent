<script setup>
defineProps({
  conversation: { type: Object, required: true },
  active: { type: Boolean, default: false },
});

defineEmits(["select"]);
</script>

<template>
  <button
    :class="['chat-hist-item', active ? 'on' : '']"
    type="button"
    @click="$emit('select', conversation.id)"
  >
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2.5 3.5h11v8.5H6l-3.5 2.5V3.5z"
        stroke="currentColor"
        stroke-width="1.3"
        stroke-linejoin="round"
      />
    </svg>
    <span>{{ conversation.title }}</span>
  </button>
</template>
