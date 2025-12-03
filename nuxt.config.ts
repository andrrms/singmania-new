import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      titleTemplate: '%s | SingMania',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'SingMania - Your Karaoke Companion' },
        { name: 'color-scheme', content: 'dark' },
      ]
    },
  },

  fonts: {
    defaults: {
      weights: ['100 900'],
      styles: ['normal', 'italic'],
    },
    families: [
      {
        name: 'Montserrat',
        weight: [100, 900],
      },
      {
        name: 'Roboto',
        weight: [100, 900],
      }
    ],
  },

  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/hints',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'vue-sonner/nuxt',
  ],

  build: {
    transpile: ['@supabase/supabase-js'],
  },
});
