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
