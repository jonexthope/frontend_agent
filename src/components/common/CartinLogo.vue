<script setup>
defineProps({
  className: { type: String, default: "" },
  width: { type: Number, default: 124 },
});
</script>

<template>
  <img
    :class="className"
    src="/images/cartin-logo.svg"
    alt="Cartin"
    :width="width"
    height="auto"
    style="display: block; height: auto"
  />
</template>
