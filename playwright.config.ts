import { defineConfig, devices } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const authFile = path.join(__dirname, 'playwright/.auth/user.json')

const isCI = !!process.env.CI

export default defineConfig({
  testDir: './test/e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI ? [['github'], ['html']] : 'html',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  globalSetup: './test/e2e/db.setup.ts',

  projects: [
    {
      name: 'setup',
      testMatch: '**/auth.setup.ts',
      retries: 2,
      timeout: 60_000
    },
    {
      name: 'auth',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/auth/*.spec.ts'
    },
    {
      name: 'app',
      use: { ...devices['Desktop Chrome'], storageState: authFile },
      dependencies: ['setup'],
      testIgnore: '**/auth/*.spec.ts'
    }
  ],

  webServer: {
    command: 'pnpm dev',
    port: 3000,
    timeout: 120_000,
    reuseExistingServer: !isCI,
    env: {
      NUXT_DATABASE_URL:
        process.env.TEST_DATABASE_URL ||
        'postgresql://postgres:P@ssw0rd@localhost:5432/test_database',
      CI: process.env.CI || 'true',
      NODE_ENV: 'test'
    },
    stdout: 'pipe',
    stderr: 'pipe'
  }
})
