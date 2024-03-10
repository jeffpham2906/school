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
  colorMode: {
    preference: 'light',
  },
  pages: true,
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  alias: {
    pinia: '/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs',
  },
  pinia: {
    storesDirs: ['./stores/**.ts'],
  },
  ui: {
    global: true,
  },
  runtimeConfig: {
    public: {
      baseUrl: 'https://api-school-mng-dev.vais.vn/api/v2',
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
