<script setup>
defineProps({
  liveDataEnabled: { type: Boolean, required: true },
  analysisEnabled: { type: Boolean, required: true },
});

defineEmits(["toggle-live-data", "toggle-analysis"]);
</script>

<template>
  <div class="chat-composer-tools">
    <button
      :class="['chat-tool', liveDataEnabled ? 'on' : '']"
      type="button"
      :aria-pressed="liveDataEnabled"
      @click="$emit('toggle-live-data')"
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M2 12.5L6 7.5l3 3 5-6.5"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      Données live
    </button>
    <button
      :class="['chat-tool', analysisEnabled ? 'on' : '']"
      type="button"
      :aria-pressed="analysisEnabled"
      @click="$emit('toggle-analysis')"
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.4" />
        <path
          d="M8 5.5v3l2 1.2"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linecap="round"
        />
      </svg>
      Analyse
    </button>
  </div>
</template>
