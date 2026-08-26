<script setup>
import { ref } from "vue";
import AccessRequestsPage from "@/pages/admin/AccessRequestsPage.vue";
import CreateUserPage from "@/pages/admin/CreateUserPage.vue";

const activeTab = ref("requests");
</script>

<template>
  <div class="account-management-page">
    <div class="page-header">
      <h1>Gestion des comptes</h1>
      <p>
        Gérez les demandes d’accès et la création des comptes utilisateurs.
      </p>
    </div>

    <div class="tabs">
      <button
        type="button"
        :class="{ active: activeTab === 'requests' }"
        @click="activeTab = 'requests'"
      >
        Demandes d’accès
      </button>

      <button
        type="button"
        :class="{ active: activeTab === 'create' }"
        @click="activeTab = 'create'"
      >
        Créer un compte
      </button>
    </div>

    <div class="tab-content">
      <AccessRequestsPage v-if="activeTab === 'requests'" />
      <CreateUserPage v-else-if="activeTab === 'create'" />
    </div>
  </div>
</template>
