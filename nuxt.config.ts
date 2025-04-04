// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@vueuse/nuxt'],
  css: ['fomantic-ui-css/semantic.min.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080/api'
    }
  },
  compatibilityDate: '2024-11-01',
  pages: true,
  devtools: { enabled: true }
})
