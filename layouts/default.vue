<script setup>
import { useAuthStore } from "@/stores/auth";
import { useRoute, useRouter } from "vue-router";
import { onMounted, watch } from "vue";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
};

// Daftar halaman yang tidak butuh login
const publicPages = ["/", "/login", "/register"];

onMounted(() => {
  if (!authStore.token && !publicPages.includes(route.path)) {
    router.push("/");
  }
});

watch(() => route.path, (newPath) => {
  if (!authStore.token && !publicPages.includes(newPath)) {
    router.push("/");
  }
});
</script>

<template>
  <div>
    <div class="ui menu">
        <NuxtLink to="/" class="header item">Warehouse System</NuxtLink>
        <NuxtLink v-if="authStore.token" to="/dashboard" class="item">Dashboard</NuxtLink>
        <NuxtLink v-if="authStore.token" to="/products" class="item">Produk</NuxtLink>

        <div class="right menu">
            <NuxtLink v-if="!authStore.token" to="/login" class="item">Login</NuxtLink>
            <a v-else @click="handleLogout" class="item">Logout</a>
      </div>
    </div>

    <slot />
  </div>
</template>
