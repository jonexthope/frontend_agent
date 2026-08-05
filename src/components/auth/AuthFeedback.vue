<script setup>
import AppAlert from "@/components/common/AppAlert.vue";

defineProps({
  error: { type: String, default: "" },
  success: { type: String, default: "" },
});
</script>

<template>
  <AppAlert v-if="error" type="error" :message="error" />
  <AppAlert v-else-if="success" type="success" :message="success" />
</template>
