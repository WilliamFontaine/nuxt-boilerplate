// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@nuxt/image',
    '@nuxt/test-utils/module',
    '@prisma/nuxt',
    'nuxt-security',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-auth-utils',
    'nuxt-mcp',
    'nuxt-nodemailer'
  ],

  // App Configuration
  app: {
    head: {
      htmlAttrs: {
        lang: 'fr'
      },
      titleTemplate: '%s | Nuxt Boilerplate',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },

  // Nodemailer Configuration
  nodemailer: {
    host: process.env.NUXT_NODEMAILER_HOST,
    port: parseInt(process.env.NUXT_NODEMAILER_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.NUXT_NODEMAILER_AUTH_USER,
      pass: process.env.NUXT_NODEMAILER_AUTH_PASS
    },
    from: process.env.NUXT_NODEMAILER_FROM || process.env.NUXT_NODEMAILER_AUTH_USER
  },

  // I18n Configuration
  i18n: {
    langDir: 'locales',
    locales: [
      {
        code: 'en',
        name: 'English',
        files: ['en/common.json', 'en/seo.json', 'en/email.json'],
        language: 'en-US'
      },
      {
        code: 'fr',
        name: 'Français',
        files: ['fr/common.json', 'fr/seo.json', 'fr/email.json'],
        language: 'fr-FR'
      }
    ],
    defaultLocale: 'fr',
    strategy: 'prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    },
    experimental: {
      localeDetector: 'localeDetector.ts'
    }
  },

  css: ['/assets/css/main.css'],

  imports: {
    // Selective auto-imports for better tree-shaking
    dirs: [
      // App composables
      'composables/**',
      // All shared resources
      '../shared/**'
    ],
    imports: [
      // Essential third-party imports
      { name: 'z', from: 'zod' }
    ]
  },

  nitro: {
    imports: {
      // Server-side auto-imports
      dirs: [
        // All shared resources available on server
        'shared/**',
        // Server-specific imports
        'server/constants/**',
        'server/services/**',
        'server/utils/**',
        'server/types/**'
      ]
    }
  },

  vite: {
    resolve: {
      alias: {
        '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js'
      }
    },
    build: {
      chunkSizeWarningLimit: 600
    }
  },

  // Security Configuration
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
        'upgrade-insecure-requests': false
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
      xXSSProtection: '1; mode=block',
      // Disable problematic headers for HTTP deployment
      crossOriginOpenerPolicy: false,
      originAgentCluster: false
    },

    corsHandler: {
      origin:
        process.env.NODE_ENV === 'development'
          ? ['http://localhost:3000', 'http://127.0.0.1:3000']
          : process.env.NUXT_CORS_ORIGIN?.split(','),
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials: true
    },

    rateLimiter: {
      tokensPerInterval: parseInt(process.env.NUXT_RATE_LIMIT_GLOBAL_MAX || '150'),
      interval: parseInt(process.env.NUXT_RATE_LIMIT_GLOBAL_WINDOW || '5') * 60 * 1000,
      throwError: true
    },

    hidePoweredBy: true
  },

  routeRules: {
    '/api/**': {
      cors: true,
      headers: {
        'Access-Control-Max-Age': '86400'
      }
    }
  },

  // SEO Configuration
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    defaultLocale: 'fr'
  },

  seo: {
    meta: {
      twitterCard: 'summary_large_image'
    }
  },

  compatibilityDate: '2025-07-16'
})
