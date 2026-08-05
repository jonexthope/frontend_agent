import { createRouter, createWebHistory } from "vue-router";
import { APP_ROUTES } from "@/configs/routes.config.js";
import AuthPage from "@/pages/auth/AuthPage.vue";
import ChatPage from "@/pages/chat/ChatPage.vue";

const routes = [
  { path: "/", redirect: APP_ROUTES.login },
  { path: APP_ROUTES.login, name: "login", component: AuthPage },
  { path: APP_ROUTES.chat, name: "chat", component: ChatPage },
  {
    path: APP_ROUTES.chatConversation,
    name: "conversation",
    component: ChatPage,
    props: true,
  },
  { path: "/:pathMatch(.*)*", redirect: APP_ROUTES.login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
