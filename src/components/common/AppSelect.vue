<script setup>
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  options: { type: Array, required: true },
  placeholder: { type: String, default: "Sélectionner…" },
  error: { type: String, default: "" },
  modelValue: { type: String, default: "" },
});

defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="auth-form-row">
    <label :for="id">{{ label }}</label>
    <select
      :id="id"
      class="auth-select"
      :value="modelValue"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? `${id}-error` : undefined"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" :id="`${id}-error`" class="auth-field-error" role="alert">
      {{ error }}
    </p>
  </div>
</template>
