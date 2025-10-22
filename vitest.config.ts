import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
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
  }
})
