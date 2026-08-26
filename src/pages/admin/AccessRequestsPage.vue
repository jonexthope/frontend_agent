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
