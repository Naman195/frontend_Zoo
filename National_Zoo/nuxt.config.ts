// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  devServer: {
    host: "zoo.in",
    port: 3000,
  },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  runtimeConfig: {
    public: {
      baseUrl: "http://localhost:8080/api",
    },
  },
  css: ["@fortawesome/fontawesome-free/css/all.css"],
});
