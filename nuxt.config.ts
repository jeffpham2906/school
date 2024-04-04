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
  modules: ['@nuxt/ui', '@nuxtjs/i18n'],
  i18n: {
    lazy: true,
    langDir: 'locales',
    strategy: 'no_prefix',
    locales: [
      {
        code: 'en-US',
        iso: 'en-US',
        name: 'English(US)',
        file: 'en-US.json',
      },
      {
        code: 'vi-VN',
        iso: 'vi-VN',
        name: 'Tiếng Việt',
        file: 'vi.json',
      },
    ],
    defaultLocale: 'en-US',
  },
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
