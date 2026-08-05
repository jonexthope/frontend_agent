import { createRouter, createWebHistory } from "vue-router";
import AuthView from "@/views/auth/AuthView.vue";
import ChatView from "@/views/chat/ChatView.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "login", component: AuthView },
  { path: "/chat", name: "chat", component: ChatView },
  {
    path: "/chat/:conversationId",
    name: "conversation",
    component: ChatView,
    props: true,
  },
  { path: "/:pathMatch(.*)*", redirect: "/login" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
