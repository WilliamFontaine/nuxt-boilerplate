// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // ========================================
  // Core Configuration
  // ========================================
  compatibilityDate: '2025-07-16',

  devtools: {
    enabled: true,
    timeline: {
      enabled: true
    }
  },

  // ========================================
  // Modules
  // ========================================
  modules: [
    // UI & Styling
    '@nuxt/ui',
    '@nuxt/image',

    // Development & Quality
    '@nuxt/eslint',
    '@nuxt/test-utils/module',

    // Internationalization & SEO
    '@nuxtjs/i18n',
    '@nuxtjs/seo',

    // Database & Backend
    '@prisma/nuxt',
    'nuxt-auth-utils',
    'nuxt-nodemailer',

    // Security
    'nuxt-security',

    // State Management
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',

    // Development Tools
    'nuxt-mcp'
  ],

  // ========================================
  // App & Meta Configuration
  // ========================================
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

  // ========================================
  // Internationalization (i18n)
  // ========================================
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

  // ========================================
  // Styling
  // ========================================
  css: ['/assets/css/main.css'],

  // ========================================
  // Auto-imports Configuration
  // ========================================
  imports: {
    // Selective auto-imports for better tree-shaking
    dirs: [
      'composables/**', // App composables
      '../shared/**' // Shared resources
    ],
    imports: [
      { name: 'z', from: 'zod' } // Zod for validation
    ]
  },

  // ========================================
  // Nitro Server Configuration
  // ========================================
  nitro: {
    imports: {
      dirs: [
        'shared/**', // Shared resources
        'server/constants/**', // Server constants
        'server/services/**', // Server services
        'server/utils/**', // Server utilities
        'server/types/**' // Server types
      ]
    },
    serverAssets: [
      {
        baseName: 'templates',
        dir: './templates'
      }
    ]
  },

  // ========================================
  // Vite Configuration
  // ========================================
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

  // ========================================
  // Security Configuration
  // ========================================
  security: {
    headers: {
      // Content Security Policy
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

      // Other security headers (configured at runtime)
      crossOriginEmbedderPolicy: 'unsafe-none',
      referrerPolicy: 'no-referrer',
      strictTransportSecurity: false,
      xContentTypeOptions: 'nosniff',
      xFrameOptions: 'DENY',
      xXSSProtection: '1; mode=block',
      crossOriginOpenerPolicy: false,
      originAgentCluster: false
    },

    // CORS - Disabled, using Nitro's built-in CORS instead (see routeRules)
    corsHandler: false,

    // Rate Limiting
    rateLimiter: {
      tokensPerInterval: 150, // 150 requests
      interval: 5 * 60 * 1000, // 5 minutes
      throwError: true
    },

    hidePoweredBy: true
  },

  // ========================================
  // Routing & API Configuration
  // ========================================
  routeRules: {
    '/api/**': {
      cors: true, // This enables Nitro's built-in CORS handling
      headers: {
        'Access-Control-Max-Age': '86400'
      }
    }
  },

  seo: {
    meta: {
      twitterCard: 'summary_large_image'
    }
  },

  // ========================================
  // Runtime Configuration
  // ========================================
  // All values here can be overridden by environment variables at runtime
  // Format: NUXT_[nested_key] (e.g., NUXT_NODEMAILER_HOST)
  runtimeConfig: {
    // ====== Server-only Configuration ======

    // Email Configuration - Used by useMailer() utility
    nodemailer: {
      host: '', // NUXT_NODEMAILER_HOST
      port: 587, // NUXT_NODEMAILER_PORT
      auth: {
        user: '', // NUXT_NODEMAILER_AUTH_USER
        pass: '' // NUXT_NODEMAILER_AUTH_PASS
      },
      from: '' // NUXT_NODEMAILER_FROM
    },

    // Rate Limiting Configuration
    rateLimit: {
      loginMax: 5, // NUXT_RATE_LIMIT_LOGIN_MAX
      loginWindow: 15, // NUXT_RATE_LIMIT_LOGIN_WINDOW (minutes)
      tokenCooldown: 5 // NUXT_RATE_LIMIT_TOKEN_COOLDOWN (minutes)
    }
  }
})
