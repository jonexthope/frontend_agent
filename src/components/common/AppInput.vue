<script setup>
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  error: { type: String, default: "" },
  modelValue: { type: String, default: "" },
  type: { type: String, default: "text" },
});

defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="auth-form-row">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      class="auth-input"
      :type="type"
      :value="modelValue"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? `${id}-error` : undefined"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <p v-if="error" :id="`${id}-error`" class="auth-field-error" role="alert">
      {{ error }}
    </p>
  </div>
</template>
