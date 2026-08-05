import { createRouter, createWebHistory } from "vue-router";
import AuthPage from "@/pages/auth/AuthPage.vue";
import ChatPage from "@/pages/chat/ChatPage.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "login", component: AuthPage },
  { path: "/chat", name: "chat", component: ChatPage },
  {
    path: "/chat/:conversationId",
    name: "conversation",
    component: ChatPage,
    props: true,
  },
  { path: "/:pathMatch(.*)*", redirect: "/login" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
