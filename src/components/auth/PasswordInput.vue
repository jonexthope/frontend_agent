<script setup>
import { ref } from "vue";

defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  error: { type: String, default: "" },
  modelValue: { type: String, default: "" },
  autoComplete: { type: String, default: "" },
  placeholder: { type: String, default: "" },
});

defineEmits(["update:modelValue"]);

const visible = ref(false);
</script>

<template>
  <div class="auth-form-row">
    <label :for="id">{{ label }}</label>
    <div class="auth-password">
      <input
        :id="id"
        :type="visible ? 'text' : 'password'"
        class="auth-input"
        :value="modelValue"
        :autocomplete="autoComplete"
        :placeholder="placeholder"
        :aria-invalid="Boolean(error)"
        :aria-describedby="error ? `${id}-error` : undefined"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <button
        type="button"
        class="auth-password__toggle"
        :aria-label="visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
        :aria-pressed="visible"
        @click="visible = !visible"
      >
        <svg v-if="visible" viewBox="0 0 16 16" width="16" height="16" aria-hidden>
          <path
            d="M2 2l12 12M6.5 6.7A3 3 0 009.3 9.5M3.2 3.8C2 4.9 1.2 6.3 1 8c.5 3 3.4 5.5 7 5.5 1.2 0 2.3-.3 3.3-.8M6.1 3.3A6.7 6.7 0 018 3c3.6 0 6.5 2.5 7 5.5-.2.8-.5 1.5-1 2.1"
            fill="none"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
          />
        </svg>
        <svg v-else viewBox="0 0 16 16" width="16" height="16" aria-hidden>
          <path
            d="M1 8c.5-3 3.4-5.5 7-5.5S14.5 5 15 8c-.5 3-3.4 5.5-7 5.5S1.5 11 1 8z"
            fill="none"
            stroke="currentColor"
            stroke-width="1.4"
          />
          <circle
            cx="8"
            cy="8"
            r="2.2"
            fill="none"
            stroke="currentColor"
            stroke-width="1.4"
          />
        </svg>
      </button>
    </div>
    <p v-if="error" :id="`${id}-error`" class="auth-field-error" role="alert">
      {{ error }}
    </p>
  </div>
</template>
