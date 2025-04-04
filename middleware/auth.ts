import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useAuthStore } from "@/stores/auth";

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();

  if (!authStore.token) {
    return navigateTo("/login");
  }
});
