import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(null);
  const user = ref<any>(null);

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const { data } = await axios.post("http://localhost:8080/api/auth/login", credentials);
      token.value = data.token;
      user.value = data.user;
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      if (process.client) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (error) {
      throw new Error("Login gagal");
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    delete axios.defaults.headers.common["Authorization"];

    if (process.client) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    window.location.reload();
  };

  const checkAuth = () => {
    if (process.client) {
      const savedToken = localStorage.getItem("token") || null;
      const savedUser = localStorage.getItem("user");

      if (savedToken) {
        token.value = savedToken;
        axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      }

      if (savedUser) {
        try {
          user.value = JSON.parse(savedUser);
        } catch (error) {
          console.error("Error parsing user data:", error);
          user.value = null;
          localStorage.removeItem("user"); // Bersihkan data jika rusak
        }
      } else {
        user.value = null;
      }
    }
  };

  return { token, user, login, logout, checkAuth };
});
