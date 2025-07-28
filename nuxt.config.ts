// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@nuxt/test-utils/module',
    '@prisma/nuxt',
    'nuxt-security',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],

  app: {
    head: {
      htmlAttrs: {
        lang: 'fr'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },

  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.json',
        language: 'en-US'
      },
      {
        code: 'fr',
        name: 'Français',
        file: 'fr.json',
        language: 'fr-FR'
      }
    ],
    defaultLocale: 'fr',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },

  css: ['/assets/css/main.css'],

  imports: {
    dirs: ['../shared/**', 'composables/**']
  },

  nitro: {
    imports: {
      dirs: ['shared/**', 'server/constants/**', 'server/validations/**']
    }
  },

  vite: {
    resolve: {
      alias: {
        '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js'
      }
    }
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        'base-uri': ['\'self\''],
        'font-src': ['\'self\'', 'https:', 'data:'],
        'form-action': ['\'self\''],
        'frame-ancestors': ['\'none\''],
        'img-src': ['\'self\'', 'data:', 'https:'],
        'object-src': ['\'none\''],
        'script-src': ['\'self\'', '\'unsafe-inline\'', '\'unsafe-eval\''],
        'style-src': ['\'self\'', 'https:', '\'unsafe-inline\''],
        'upgrade-insecure-requests': true
      },
      crossOriginEmbedderPolicy:
        process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',
      referrerPolicy: 'no-referrer',
      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubdomains: true
      },
      xContentTypeOptions: 'nosniff',
      xFrameOptions: 'DENY',
      xXSSProtection: '1; mode=block'
    },

    corsHandler: {
      origin:
        process.env.NODE_ENV === 'development'
          ? ['http://localhost:3000', 'http://127.0.0.1:3000']
          : process.env.CORS_ORIGIN?.split(','),
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials: true
    },

    rateLimiter: {
      tokensPerInterval: 150,
      interval: 300000,
      throwError: true
    },

    hidePoweredBy: true
  },

  routeRules: {
    '/api/**': {
      headers: {
        'Access-Control-Max-Age': '86400'
      }
    }
  },

  compatibilityDate: '2025-07-16'
})
