<script setup>
import { onMounted, ref } from "vue";
import {
  getAccessRequests,
  approveAccessRequest,
  rejectAccessRequest,
} from "@/services/auth/adminAccessRequest.service.js";

const requests = ref([]);
const loading = ref(false);
const error = ref("");

async function loadRequests() {
  loading.value = true;
  error.value = "";

  try {
    const data = await getAccessRequests("pending");

    requests.value = Array.isArray(data)
      ? data
      : data?.items || [];
  } catch (err) {
    console.error(err);
    error.value = "Impossible de charger les demandes d’accès.";
  } finally {
    loading.value = false;
  }
}

async function approveRequest(requestId) {
  try {
    await approveAccessRequest(requestId);
    await loadRequests();
  } catch (err) {
    console.error(err);
    error.value = "Impossible d’accepter cette demande.";
  }
}

async function rejectRequest(requestId) {
  try {
    await rejectAccessRequest(requestId);
    await loadRequests();
  } catch (err) {
    console.error(err);
    error.value = "Impossible de refuser cette demande.";
  }
}

onMounted(() => {
  loadRequests();
});
</script>

<template>
  <div class="access-requests-page">
    <div class="page-header">
      <div>
        <h1>Demandes d’accès</h1>
        <p>Gérez les demandes d’accès en attente.</p>
      </div>
    </div>

    <p v-if="loading">Chargement...</p>

    <p v-else-if="error" class="error-message">
      {{ error }}
    </p>

    <p v-else-if="requests.length === 0">
      Aucune demande d’accès en attente.
    </p>

    <div v-else class="requests-list">
      <div
        v-for="request in requests"
        :key="request.id"
        class="request-card"
      >
        <div class="request-info">
          <strong>
            {{ request.first_name }} {{ request.last_name }}
          </strong>

          <span>{{ request.email }}</span>

          <small>
            Rôle demandé : {{ request.requested_role || "user" }}
          </small>
        </div>

        <div class="request-actions">
          <button
            type="button"
            class="approve-button"
            @click="approveRequest(request.id)"
          >
            Accepter
          </button>

          <button
            type="button"
            class="reject-button"
            @click="rejectRequest(request.id)"
          >
            Refuser
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.access-requests-page {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
}

.page-header p {
  margin-top: 6px;
  color: #666;
}

.requests-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.request-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.request-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.request-info span,
.request-info small {
  color: #666;
}

.request-actions {
  display: flex;
  gap: 8px;
}

.request-actions button {
  border: 0;
  border-radius: 6px;
  padding: 8px 14px;
  cursor: pointer;
  font-weight: 600;
}

.approve-button {
  background: #16a34a;
  color: white;
}

.reject-button {
  background: #dc2626;
  color: white;
}

.error-message {
  color: #dc2626;
}
</style>