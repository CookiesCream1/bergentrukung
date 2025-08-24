// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config' // <<--- must import this

export default defineNuxtConfig({
  devtools: {
    enabled: true,
    timeline: {
      enabled: true
    }
  },

  modules: [
    '@pinia/nuxt',
    'nuxt-rating',
    '@nuxtjs/eslint-module',
    '@nuxt/image',
    '@nuxt/ui',
    '@sidebase/nuxt-auth',
    '@unlok-co/nuxt-stripe'
  ],

  pinia: {
    storesDirs: ['./data/**']
  },

  auth: {
    isEnabled: true,
    provider: {
      type: 'authjs'
    },
    globalAppMiddleware: {
      isEnabled: true
    }
  },

  eslint: {
    fix: true
  },

  stripe: {
    server: {
      key: process.env.STRIPE_SECRET_KEY,
      options: {}
    },
    client: {
      key: process.env.STRIPE_PUBLIC_KEY,
      options: {}
    }
  },

  runtimeConfig: {
    mariadb: {
      host: process.env.db_host ?? (() => { throw new Error('db_host is undefined') })(),
      user: process.env.db_user ?? (() => { throw new Error('db_user is undefined') })(),
      password: process.env.db_pwd ?? (() => { throw new Error('db_pwd is undefined') })(),
      port: Number(process.env.MYSQLPORT) ?? (() => { throw new Error('MYSQLPORT is undefined') })()
    },
    public: {
      stripe: {
        key: process.env.STRIPE_PUBLIC_KEY
      }
    },
    mail: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'luky.pospa04@gmail.com',
        pass: 'gmuo irzh ydlq jmah'
      },
      tls: {
        ciphers: 'SSLv3'
      }
    }
  },

  compatibilityDate: '2025-03-15'
})
