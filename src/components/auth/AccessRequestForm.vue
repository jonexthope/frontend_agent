<script setup>
import { reactive } from "vue";
import AppInput from "@/components/common/AppInput.vue";
import AppSelect from "@/components/common/AppSelect.vue";
import AppTextarea from "@/components/common/AppTextarea.vue";
import AppButton from "@/components/common/AppButton.vue";
import { ACCESS_ROLES } from "@/configs/auth.constants";
import { validateAccessRequest } from "@/tools/validation";

const props = defineProps({
  isSubmitting: { type: Boolean, default: false },
  onSubmit: { type: Function, required: true },
});

const form = reactive({ email: "", role: "", message: "" });
const errors = reactive({ email: "", role: "", message: "" });

const roleOptions = ACCESS_ROLES.map((role) => ({ value: role, label: role }));

function resetForm() {
  form.email = "";
  form.role = "";
  form.message = "";
}

async function handleSubmit() {
  const result = validateAccessRequest(form);
  errors.email = result.errors.email || "";
  errors.role = result.errors.role || "";
  errors.message = result.errors.message || "";
  if (!result.success) return;
  const ok = await props.onSubmit({ ...result.data });
  if (ok) resetForm();
}
</script>

<template>
  <form
    id="panel-access"
    role="tabpanel"
    aria-labelledby="tab-access"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <AppInput
      id="accEmail"
      v-model="form.email"
      label="Email professionnel"
      type="email"
      autocomplete="email"
      placeholder="prenom.nom@entreprise.com"
      :error="errors.email"
    />

    <AppSelect
      id="accRole"
      v-model="form.role"
      label="Rôle souhaité"
      :options="roleOptions"
      :error="errors.role"
    />

    <AppTextarea
      id="accMsg"
      v-model="form.message"
      label="Message aux administrateurs"
      placeholder="Pourquoi avez-vous besoin de Cartin AI ? (équipe, cas d’usage…)"
      :error="errors.message"
    />

    <AppButton type="submit" :loading="isSubmitting">Envoyer la demande</AppButton>

    <p class="auth-access-note">
      Un administrateur validera votre accès. Vous recevrez un email une fois approuvé.
    </p>
  </form>
</template>
