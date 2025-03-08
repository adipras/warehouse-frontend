<script setup>
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
authStore.checkAuth();
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
