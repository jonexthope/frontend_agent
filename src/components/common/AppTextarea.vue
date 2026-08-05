<script setup>
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  error: { type: String, default: "" },
  modelValue: { type: String, default: "" },
  placeholder: { type: String, default: "" },
});

defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="auth-form-row">
    <label :for="id">{{ label }}</label>
    <textarea
      :id="id"
      class="auth-textarea"
      :value="modelValue"
      :placeholder="placeholder"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? `${id}-error` : undefined"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <p v-if="error" :id="`${id}-error`" class="auth-field-error" role="alert">
      {{ error }}
    </p>
  </div>
</template>
