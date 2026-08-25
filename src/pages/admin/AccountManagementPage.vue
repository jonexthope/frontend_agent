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

<style scoped>
.account-management-page {
  min-height: 100vh;
  padding: 32px;
  background: #f8fafc;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 28px;
}

.page-header p {
  margin-top: 8px;
  color: #64748b;
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.tabs button {
  padding: 10px 16px;
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
  color: #64748b;
}

.tabs button.active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

.tab-content {
  background: #ffffff;
  border-radius: 12px;
}
</style>