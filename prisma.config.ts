// Prisma 7 configuration
// dotenv loads NUXT_DATABASE_URL from .env in dev, in production env vars are set by hosting platform
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts'
  },
  datasource: {
    url: env('NUXT_DATABASE_URL')
  }
})
