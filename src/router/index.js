import { createRouter, createWebHistory } from "vue-router";
import { APP_ROUTES } from "@/configs/routes.config.js";
import AuthPage from "@/pages/auth/AuthPage.vue";
import ChatPage from "@/pages/chat/ChatPage.vue";
import { useAuthStore } from "@/stores/auth.js";

const routes = [
  { path: "/", redirect: APP_ROUTES.login },
  { path: APP_ROUTES.login, name: "login", component: AuthPage },
  {
    path: APP_ROUTES.chat,
    name: "chat",
    component: ChatPage,
    meta: { requiresAuth: true },
  },
  {
    path: APP_ROUTES.chatConversation,
    name: "conversation",
    component: ChatPage,
    props: true,
    meta: { requiresAuth: true },
  },
  { path: "/:pathMatch(.*)*", redirect: APP_ROUTES.login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: "login",
      query: {
        redirect: to.fullPath,
      },
    };
  }

  return true;
});

export default router;