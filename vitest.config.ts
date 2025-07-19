import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    setupFiles: ['./tests/setup/vitest.ts'],
    include: ['tests/**/*.{test,spec}.ts'],
    exclude: ['tests/e2e/**'],
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
        'tests/**',
        '**/*.config.*',
        '**/.nuxt/**'
      ]
    }
  }
})
