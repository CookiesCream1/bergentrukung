import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: {
    enabled: true
  },

  modules: [
    '@pinia/nuxt',
    'nuxt-rating',
    '@nuxtjs/eslint-module',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@nuxt/ui',
    '@sidebase/nuxt-auth',
    '@unlok-co/nuxt-stripe'
  ],

  css: ['~/assets/css/main.css'],

  pinia: {
    storesDirs: ['./data/**']
  },

  auth: {
    isEnabled: true,
    provider: {
      type: 'authjs'
    },
    globalAppMiddleware: true
  },

  eslint: {
    fix: true
  },

  // ✅ ADD THIS BLOCK
  nitro: {
    preset: 'node-server',
    externals: {
      external: ['mariadb']
    }
  },

  // ✅ STRIPE
  stripe: {
    server: {
      key: process.env.STRIPE_SECRET_KEY
    },
    client: {
      key: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    }
  },

  // ✅ RUNTIME CONFIG
  runtimeConfig: {
    mariadb: {
      host: process.env.db_host,
      user: process.env.db_user,
      password: process.env.db_pwd,
      port: Number(process.env.MYSQLPORT),
      database: process.env.DB_DATABASE
    },

    public: {
      stripe: {
        key: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      }
    },

    mail: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'luky.pospa04@gmail.com',
        pass: 'gmuo irzh ydlq jmah'
      }
    }
  },

  compatibilityDate: '2025-03-15'
})
