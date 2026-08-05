<script setup>
import IconButton from "@/components/common/IconButton.vue";

defineEmits(["click"]);
</script>

<template>
  <IconButton title="Déconnexion non disponible" @click="$emit('click')">
    <svg viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden>
      <path
        d="M6 3H3.5A1.5 1.5 0 002 4.5v7A1.5 1.5 0 003.5 13H6M10.5 11.5L14 8l-3.5-3.5M14 8H6"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </IconButton>
</template>
