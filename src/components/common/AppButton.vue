<script setup>
defineProps({
  variant: { type: String, default: "primary" },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: "button" },
});

const variantClass = {
  primary: "auth-btn auth-btn--primary",
  google: "auth-btn auth-btn--google",
  ghost: "auth-btn",
};
</script>

<template>
  <button
    :class="[variantClass[variant] || variantClass.primary]"
    :disabled="disabled || loading"
    :type="type"
  >
    <span v-if="loading" class="auth-loader" aria-hidden />
    <slot />
  </button>
</template>
