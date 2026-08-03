export type AuthMode = "login" | "access";

export interface LoginPayload {
  email: string;
  password: string;
  remember: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  initials?: string;
  provider?: "email" | "google";
}

export interface LoginResponse {
  user: AuthUser;
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthFeedbackState {
  type: "error" | "success" | null;
  message: string | null;
}
