# CLAUDE.md

## Project Overview

Nuxt 4 boilerplate with:

- TypeScript, Vue 3 Composition API
- Pinia for state management with cookie persistence
- Prisma ORM + PostgreSQL
- Authentication system with nuxt-auth-utils (JWT sessions)
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
docker compose up -d   # start PostgreSQL
npx prisma migrate dev # run DB migrations
```

## Patterns & Practices

- Prisma client singleton in `lib/prisma.ts`, import via alias (`@@/lib/prisma`)
- RESTful API with standardized JSON responses `{ statusCode, data }`
- Authentication with JWT sessions using `nuxt-auth-utils`
- Protected API routes via global auth middleware
- User session management with `useUserSession()` composable
- Form composables pattern for consistent validation and state management
- Security headers, CORS, and rate limiting applied globally
- Tests separated by unit (Vitest) and E2E (Playwright)
- Pinia stores use `@pinia-plugin-persistedstate/nuxt` for cookie persistence
- Auto-imports configured for components, composables, stores, and shared utils
- SEO with `@nuxtjs/seo` module and `useSeo` composable for localized meta tags

## Environment Variables

- `NUXT_DATABASE_URL` for production database connection
- `TEST_DATABASE_URL` for test database
- `NUXT_SESSION_PASSWORD` for JWT session encryption (32+ chars)
- `CORS_ORIGIN` required in production for allowed origins
- `NUXT_PUBLIC_SITE_URL` for SEO canonical URL (defaults to localhost:3000)

## Authentication

- Built with `nuxt-auth-utils` for JWT session management
- Login/register pages at `/auth/login` and `/auth/register`
- Authentication middleware protects API routes automatically
- Use `useUserSession()` composable to access current user
- Form composables (`useLoginForm`, `useRegisterForm`) follow the same pattern as `usePostForm`
- Protected routes use `auth.ts` middleware, guest routes use `guest.ts` middleware

## Development Guidelines

- Use Nuxt 4 auto-imports; no manual imports needed for core dirs
- Follow code style: single quotes, 2 spaces, max 100 chars per line
- Use conventional commits for git messages
