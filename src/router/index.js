import { createRouter, createWebHistory } from "vue-router";
import { APP_ROUTES } from "@/configs/routes.config.js";
import AuthPage from "@/pages/auth/AuthPage.vue";
import ChatPage from "@/pages/chat/ChatPage.vue";
import AccessRequestsPage from "@/pages/admin/AccessRequestsPage.vue";
import { useAuthStore } from "@/stores/auth.js";

const routes = [
  {
    path: "/",
    redirect: APP_ROUTES.login,
  },
  {
    path: APP_ROUTES.login,
    name: "login",
    component: AuthPage,
  },
  {
    path: APP_ROUTES.chat,
    name: "chat",
    component: ChatPage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: APP_ROUTES.chatConversation,
    name: "conversation",
    component: ChatPage,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/admin/access-requests",
    name: "admin-access-requests",
    component: AccessRequestsPage,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: APP_ROUTES.login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return APP_ROUTES.login;
  }

  if (
    to.meta.requiresAuth &&
    authStore.isAuthenticated &&
    !authStore.user
  ) {
    try {
      await authStore.restoreSession();
    } catch (error) {
      return APP_ROUTES.login;
    }
  }

  if (to.meta.requiresAdmin && authStore.user?.role !== "admin") {
    return APP_ROUTES.chat;
  }

  return true;
});

export default router;