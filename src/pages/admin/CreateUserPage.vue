```vue
<script setup>
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { register } from "@/services/auth/auth.service.js";

const router = useRouter();
const route = useRoute();

const loading = ref(false);
const error = ref("");
const success = ref("");

const form = ref({
  email: route.query.email || "",
  first_name: route.query.first_name || "",
  last_name: route.query.last_name || "",
  display_name:
    route.query.display_name ||
    `${route.query.first_name || ""} ${route.query.last_name || ""}`.trim(),
  role: route.query.role || "user",
  password: "",
});

const canSubmit = computed(() => {
  return (
    form.value.email &&
    form.value.first_name &&
    form.value.last_name &&
    form.value.password
  );
});

async function createUser() {
  if (!canSubmit.value) {
    error.value = "Veuillez compléter tous les champs obligatoires.";
    return;
  }

  loading.value = true;
  error.value = "";
  success.value = "";

  try {
    await register({
      email: form.value.email,
      password: form.value.password,
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      display_name:
        form.value.display_name ||
        `${form.value.first_name} ${form.value.last_name}`.trim(),
      role: form.value.role,
    });

    success.value = "Le compte utilisateur a été créé avec succès.";

    setTimeout(() => {
      router.push("/admin/access-requests");
    }, 1200);
  } catch (err) {
    console.error(err);

    error.value =
      err?.response?.data?.detail ||
      "Impossible de créer le compte utilisateur.";
  } finally {
    loading.value = false;
  }
}

function cancel() {
  router.push("/admin/access-requests");
}
</script>

<template>
  <div class="create-user-page">
    <div class="create-user-card">
      <div class="page-header">
        <h1>Créer le compte utilisateur</h1>
        <p>
          Complétez les informations du nouvel utilisateur avant de créer son
          compte.
        </p>
      </div>

      <form class="user-form" @submit.prevent="createUser">
        <div class="form-row">
          <div class="form-group">
            <label for="first-name">Prénom</label>

            <input
              id="first-name"
              v-model.trim="form.first_name"
              type="text"
              autocomplete="given-name"
              required
            />
          </div>

          <div class="form-group">
            <label for="last-name">Nom</label>

            <input
              id="last-name"
              v-model.trim="form.last_name"
              type="text"
              autocomplete="family-name"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="email">Adresse email</label>

          <input
            id="email"
            v-model.trim="form.email"
            type="email"
            autocomplete="email"
            required
          />
        </div>

        <div class="form-group">
          <label for="display-name">Nom affiché</label>

          <input
            id="display-name"
            v-model.trim="form.display_name"
            type="text"
            placeholder="Prénom Nom"
          />
        </div>

        <div class="form-group">
          <label for="role">Rôle</label>

          <select id="role" v-model="form.role">
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>

        <div class="form-group">
          <label for="password">Mot de passe temporaire</label>

          <input
            id="password"
            v-model="form.password"
            type="password"
            autocomplete="new-password"
            minlength="8"
            required
          />

          <small>
            Le mot de passe doit respecter les règles de sécurité définies par
            le backend.
          </small>
        </div>

        <p v-if="error" class="message error-message">
          {{ error }}
        </p>

        <p v-if="success" class="message success-message">
          {{ success }}
        </p>

        <div class="form-actions">
          <button
            type="button"
            class="secondary-button"
            :disabled="loading"
            @click="cancel"
          >
            Annuler
          </button>

          <button
            type="submit"
            class="primary-button"
            :disabled="loading || !canSubmit"
          >
            {{ loading ? "Création..." : "Créer le compte" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.create-user-page {
  min-height: 100vh;
  padding: 40px 20px;
  background: #f8fafc;
}

.create-user-card {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 28px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
}

.page-header {
  margin-bottom: 28px;
}

.page-header h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
}

.page-header p {
  margin: 8px 0 0;
  color: #64748b;
  line-height: 1.5;
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  font: inherit;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #2563eb;
}

.form-group small {
  color: #64748b;
  font-size: 12px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.form-actions button {
  padding: 10px 16px;
  border-radius: 8px;
  border: 0;
  cursor: pointer;
  font-weight: 600;
}

.form-actions button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.primary-button {
  background: #2563eb;
  color: #ffffff;
}

.secondary-button {
  background: #e2e8f0;
  color: #0f172a;
}

.message {
  margin: 0;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
}

.error-message {
  background: #fee2e2;
  color: #b91c1c;
}

.success-message {
  background: #dcfce7;
  color: #166534;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .create-user-card {
    padding: 20px;
  }
}
</style>
```
