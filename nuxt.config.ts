import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: {
    enabled: true
  },

  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxt/image',
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
    baseURL: '/api/auth',
    provider: {
      type: 'local',
      pages: {
        login: '/login'
      },
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        signUp: { path: '/register', method: 'post' },
        signOut: { path: '/logout', method: 'post' },
        getSession: { path: '/session', method: 'get' }
      },
      token: {
        signInResponseTokenPointer: '/token',
        maxAgeInSeconds: Number(process.env.AUTH_TOKEN_MAX_AGE ?? 60 * 60 * 24 * 7),
        sameSiteAttribute: 'lax',
        secureCookieAttribute: process.env.NODE_ENV === 'production'
      },
      session: {
        dataType: {
          id: 'string',
          email: 'string',
          name: 'string',
          role: 'string'
        }
      }
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
    authSecret: process.env.auth_secret,
    authTokenMaxAgeInSeconds: Number(process.env.AUTH_TOKEN_MAX_AGE ?? 60 * 60 * 24 * 7),
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
