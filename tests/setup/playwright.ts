import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)
const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || 'postgresql://postgres:P@ssw0rd@localhost:5432/test_database'

async function globalSetup() {
  // eslint-disable-next-line no-console
  console.log('🗄️ Setting up E2E test environment...')

  try {
    // Set environment variable for all commands
    process.env.NUXT_DATABASE_URL = TEST_DATABASE_URL

    // Setup test database with force reset to avoid P3005 errors
    // eslint-disable-next-line no-console
    console.log('📦 Generating Prisma client...')
    await execAsync('npx prisma generate')

    // eslint-disable-next-line no-console
    console.log('🗄️ Setting up test database...')
    await execAsync(`NUXT_DATABASE_URL=${TEST_DATABASE_URL} npx prisma db push --force-reset`)

    // eslint-disable-next-line no-console
    console.log('✅ E2E test environment ready')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ E2E test setup failed:', error)
    // Don't throw to allow tests to continue with fallback
  }
}

export default globalSetup
