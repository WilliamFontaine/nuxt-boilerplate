# CLAUDE.md

## Project Overview

Nuxt 4 boilerplate with:

- TypeScript, Vue 3 Composition API
- Pinia for state management with cookie persistence
- Prisma ORM + PostgreSQL
- nuxt-security (CORS, CSP, rate limiting)
- Vitest (unit tests) + Playwright (E2E)
- Internationalization (i18n) with French default

## Directory Structure

- `/app/`: Nuxt app (components, pages, layouts, composables)
- `/shared/`: shared utilities, types, models (auto-imported)
- `/server/`: API routes and middleware
- `/prisma/`: Prisma schema and migrations
- `/tests/`: unit and E2E tests

## Key Commands

```bash
npm run dev            # start dev server
npm run build          # build for production
npm run lint           # run ESLint + Prettier
npm test               # run unit + E2E tests
docker compose up -d   # start PostgreSQL + Adminer
npx prisma migrate dev # run DB migrations
```

## Patterns & Practices

- Prisma client singleton in `lib/prisma.ts`, import via alias (`@@/lib/prisma`)
- RESTful API with standardized JSON responses `{ statusCode, data }`
- Security headers, CORS, and rate limiting applied globally
- Tests separated by unit (Vitest) and E2E (Playwright)
- Pinia stores use `@pinia-plugin-persistedstate/nuxt` for cookie persistence
- Auto-imports configured for components, composables, stores, and shared utils

## Environment Variables

- `NUXT_DATABASE_URL` for production database connection
- `TEST_DATABASE_URL` for test database
- `CORS_ORIGIN` required in production for allowed origins

## Development Guidelines

- Use Nuxt 4 auto-imports; no manual imports needed for core dirs
- Follow code style: single quotes, 2 spaces, max 100 chars per line
- Use conventional commits for git messages
