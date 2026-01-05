// Prisma 7 configuration
// dotenv loads NUXT_DATABASE_URL from .env in dev, in production env vars are set by hosting platform
import 'dotenv/config'
import { defineConfig } from 'prisma/config'

// Use dummy URL for prisma generate in CI (no actual connection needed)
const databaseUrl = process.env.NUXT_DATABASE_URL || 'postgresql://localhost:5432/dummy'

export default defineConfig({
  schema: 'prisma/schema',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts'
  },
  datasource: {
    url: databaseUrl
  }
})
