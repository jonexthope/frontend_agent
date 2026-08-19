import { apiClient } from "@/services/api/apiClient.js";

export async function getAccessRequests(status = "pending") {
  const response = await apiClient.get("/admin/access-requests", {
    params: {
      status,
    },
  });

  return response.data;
}

export async function approveAccessRequest(requestId) {
  const response = await apiClient.patch(
    `/admin/access-requests/${requestId}/approve`
  );

  return response.data;
}

export async function rejectAccessRequest(requestId) {
  const response = await apiClient.patch(
    `/admin/access-requests/${requestId}/reject`
  );

  return response.data;
}