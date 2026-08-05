<script setup>
import { ref } from "vue";

const props = defineProps({
  content: { type: String, required: true },
});

const helpful = ref(false);
const copied = ref(false);

async function handleCopy() {
  await navigator.clipboard.writeText(props.content);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 1200);
}
</script>

<template>
  <div class="chat-msg-actions">
    <button type="button" title="Copier le message" @click="handleCopy">
      {{ copied ? "Copié" : "Copier" }}
    </button>
    <button
      type="button"
      title="Réponse utile"
      :aria-pressed="helpful"
      @click="helpful = !helpful"
    >
      {{ helpful ? "Utile ✓" : "Utile" }}
    </button>
  </div>
</template>
