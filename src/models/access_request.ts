import type { AccessRole } from "@/configs/auth.config";

export interface AccessRequestPayload {
  email: string;
  role: AccessRole | string;
  message: string;
}

export interface AccessRequestResponse {
  id: string;
  email: string;
  role: string;
  status: "pending" | "approved" | "refused";
  createdAt: string;
}
