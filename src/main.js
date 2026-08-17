import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "@/stores/auth.js";

import "./assets/styles/global.css";
import "./assets/styles/auth.css";
import "./assets/styles/chat.css";

async function bootstrap() {
  const app = createApp(App);
  const pinia = createPinia();

  app.use(pinia);

  const authStore = useAuthStore();

  await authStore.restoreSession();

  app.use(router);
  app.mount("#app");
}

bootstrap();