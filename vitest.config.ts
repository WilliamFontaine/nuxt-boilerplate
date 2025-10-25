import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['test/unit/**/*.{test,spec}.ts'],
    exclude: ['test/e2e/**'],
    setupFiles: ['./test/unit/setup.ts'],
    globals: true,
    testTimeout: 10_000,
    hookTimeout: 10_000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: '../coverage',
      exclude: [
        'coverage/**',
        'dist/**',
        '**/node_modules/**',
        '**/*.d.ts',
        'test/**',
        '**/*.config.*',
        '**/.nuxt/**'
      ]
    }
  },
  resolve: {
    alias: {
      // Nuxt aliases - app directory
      '~': fileURLToPath(new URL('./app', import.meta.url)),
      '@': fileURLToPath(new URL('./app', import.meta.url)),
      // Nuxt aliases - project root
      '~~': fileURLToPath(new URL('.', import.meta.url)),
      '@@': fileURLToPath(new URL('.', import.meta.url)),
      // Assets aliases
      assets: fileURLToPath(new URL('./app/assets', import.meta.url)),
      public: fileURLToPath(new URL('./public', import.meta.url)),
      // Nuxt auto-imports for shared directory
      '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
      // Nuxt auto-imports (mock it)
      '#app': fileURLToPath(new URL('./test/unit/mocks/nuxt-app.ts', import.meta.url))
    }
  }
})
