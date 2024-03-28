// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['@/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  imports: {
    dirs: ['./stores', './services'],
  },
  colorMode: {
    preference: 'light',
  },
  modules: ['@nuxt/ui'],

  ui: {
    global: true,
  },
  runtimeConfig: {
    public: {
      baseUrl: 'https://api-school-mng-dev.vais.vn/api',
    },
  },
  vite: {
    server: {
      hmr: {
        overlay: false,
      },
    },
  },
})
