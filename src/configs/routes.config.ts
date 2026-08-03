export const APP_ROUTES = {
  login: "/login",
  chat: "/chat",
  chatConversation: "/chat/:conversationId",
} as const;

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];
