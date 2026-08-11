<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  confirmLabel: { type: String, default: "Confirmer" },
  cancelLabel: { type: String, default: "Annuler" },
  isBusy: { type: Boolean, default: false },
});

defineEmits(["confirm", "cancel"]);
</script>

<template>
  <div v-if="open" class="confirm-backdrop" @click.self="$emit('cancel')">
    <section
      class="confirm-dialog"
      role="dialog"
      aria-modal="true"
      aria-label="Confirmation"
    >
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
      <div class="confirm-actions">
        <button type="button" class="confirm-cancel" :disabled="isBusy" @click="$emit('cancel')">
          {{ cancelLabel }}
        </button>
        <button type="button" class="confirm-submit" :disabled="isBusy" @click="$emit('confirm')">
          {{ isBusy ? "Suppression..." : confirmLabel }}
        </button>
      </div>
    </section>
  </div>
</template>
