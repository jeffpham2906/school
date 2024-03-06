// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    // editorSupport: true,
  },
  pages: true,
  modules: ['@nuxt/ui'],
  ui: {
    global: true,
  },
})
