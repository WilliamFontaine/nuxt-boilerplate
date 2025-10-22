import { defineConfig } from 'prisma/config'

try {
  process.loadEnvFile?.()
} catch {
  // Silently ignore if .env doesn't exist (CI, production, etc.)
}

export default defineConfig({
  migrations: {
    seed: 'tsx prisma/seed.ts'
  }
})
