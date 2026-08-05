<script setup>
import { computed } from "vue";
import AppButton from "@/components/common/AppButton.vue";
import { APP_CONFIG } from "@/configs/app.config";

defineProps({
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
});

defineEmits(["click"]);

const unavailable = computed(
  () => !APP_CONFIG.googleAuthEnabled || !APP_CONFIG.authApiEnabled,
);
</script>

<template>
  <AppButton
    variant="google"
    :disabled="disabled"
    :loading="loading"
    :title="
      unavailable
        ? 'La connexion Google n’est pas encore disponible.'
        : 'Continuer avec Google'
    "
    @click="$emit('click')"
  >
    <svg viewBox="0 0 16 16" aria-hidden>
      <path
        fill="#4285F4"
        d="M15.7 8.2c0-.5-.05-1.1-.14-1.6H8v3h4.3c-.18 1-.75 1.85-1.6 2.42v2h2.6C14.9 12.6 15.7 10.6 15.7 8.2z"
      />
      <path
        fill="#34A853"
        d="M8 16c2.16 0 3.98-.72 5.3-1.94l-2.6-2c-.72.48-1.64.76-2.7.76-2.08 0-3.84-1.4-4.47-3.3H.85v2.07C2.16 14.2 4.88 16 8 16z"
      />
      <path
        fill="#FBBC05"
        d="M3.53 9.52A4.8 4.8 0 013.26 8c0-.53.1-1.04.27-1.52V4.41H.85A8 8 0 000 8c0 1.29.31 2.51.85 3.59l2.68-2.07z"
      />
      <path
        fill="#EA4335"
        d="M8 3.18c1.18 0 2.24.4 3.07 1.2l2.3-2.3C11.97.8 10.16 0 8 0 4.88 0 2.16 1.8.85 4.41l2.68 2.07C4.16 4.58 5.92 3.18 8 3.18z"
      />
    </svg>
    Continuer avec Google
  </AppButton>
</template>
