<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const email = ref("");
const password = ref("");
const errorMsg = ref("");

const handleLogin = async () => {
  try {
    await authStore.login({ email: email.value, password: password.value });
    router.push("/dashboard");
  } catch (error) {
    errorMsg.value = "Login gagal. Periksa kembali email dan password.";
  }
};
</script>

<template>
  <div class="ui middle aligned center aligned grid" style="height: 50vh;">
    <div class="column" style="max-width: 450px;">
      <h2 class="ui teal image header">
        <div class="content">Login ke Warehouse</div>
      </h2>
      <form class="ui large form" @submit.prevent="handleLogin">
        <div class="ui stacked segment">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" placeholder="Email" v-model="email" required />
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input type="password" placeholder="Password" v-model="password" required />
            </div>
          </div>
          <button class="ui fluid large teal submit button">Login</button>
        </div>
        <div v-if="errorMsg" class="ui negative message">{{ errorMsg }}</div>
      </form>
    </div>
  </div>
</template>
