# CLAUDE.md

## Project Overview

Nuxt 4 boilerplate with:

- TypeScript, Vue 3 Composition API
- Pinia for state management with cookie persistence
- Prisma ORM + PostgreSQL
- Authentication system with JWT sessions and email verification
- nuxt-security (CORS, CSP, rate limiting)
- Vitest (unit tests) + Playwright (E2E)
- Internationalization (i18n) with French default
- Optimized auto-imports with selective tree-shaking

## Directory Structure

- `/app/`: Nuxt app (components, pages, layouts, composables)
- `/shared/`: shared utilities, types, models (auto-imported)
- `/server/`: API routes, services, and middleware
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

# Changelog & Releases
npm run changelog         # generate local changelog (optional)
npm run release:patch     # create patch release + push tag (0.0.1)
npm run release:minor     # create minor release + push tag (0.1.0)
npm run release:major     # create major release + push tag (1.0.0)
```

## Architecture & Patterns

**Database & API:**

- Prisma client singleton in `lib/prisma.ts`, import via alias (`@@/lib/prisma`)
- RESTful API with standardized JSON responses `{ statusCode, data }`
- Global auth middleware protects API routes automatically
- Server services pattern in `server/services/` for business logic

**Authentication & Security:**

- JWT sessions with `nuxt-auth-utils` and `useUserSession()` composable
- bcrypt password hashing (12 rounds) for user registration
- Email verification system with token management
- Protected/guest route middleware (`auth.ts`, `guest.ts`)
- Security headers (CSP, HSTS, CORS) and centralized rate limiting

**Frontend Patterns:**

- Form composables pattern (`usePostForm`, `useLoginForm`, `useRegisterForm`)
- Reusable field components (`ui/form/`) with consistent validation
- Pinia stores with cookie persistence (`@pinia-plugin-persistedstate/nuxt`)
- Notification system (`useNotifications`) with toast feedback
- Optimized auto-imports for components, composables, stores, and shared utilities

**Testing & Quality:**

- Unit tests (Vitest) and E2E tests (Playwright) with separate configs
- Test database isolation using `TEST_DATABASE_URL`
- Component testing with Vue Test Utils and proper mocking
- Code quality with ESLint, Prettier, and conventional commits

**Release & Deployment:**

- Automated changelog generation using git-cliff with conventional commits
- GitHub Actions workflows for release (GitHub Release) and deploy (Docker)
- Tag-triggered releases: push tag → GitHub Release with changelog → Docker build/deploy
- CHANGELOG.md generated automatically in GitHub Releases (not committed to repo)
- Semantic versioning with `npm version` commands

## Environment Variables

- `NUXT_DATABASE_URL` for production database connection
- `TEST_DATABASE_URL` for test database
- `NUXT_SESSION_PASSWORD` for JWT session encryption (32+ chars)
- `NUXT_CORS_ORIGIN` required in production for allowed origins
- `NUXT_PUBLIC_SITE_URL` for SEO canonical URL (defaults to localhost:3000)
- `NUXT_FORCE_HTTPS` set to "true" for HTTPS deployments (enables full security headers)

## Auto-imports Configuration

**Client-side (`nuxt.config.ts`):**

- `composables/**` - All Vue composables (useLoginForm, usePostForm, etc.)
- `../shared/**` - All shared resources (types, models, utils, constants)

**Server-side (`nitro.imports.dirs`):**

- `shared/**` - All shared resources available on server
- `server/constants/**`, `server/services/**`, `server/utils/**`, `server/types/**`

**Benefits:**

- Tree-shaking optimized with selective imports
- Server-only types excluded from client bundle
- All composables and utilities auto-available
- Global auto-import: `z` from Zod

## Development Guidelines

**Code Standards:**

- Use Nuxt 4 auto-imports; no manual imports needed for core directories
- Code style: single quotes, 2 spaces indentation, max 100 chars per line
- TypeScript strict mode enabled; always use type annotations for props/events
- Conventional commits format for git messages

**Component Patterns:**

- Follow single responsibility principle for components
- Use composition API with `<script setup>` syntax
- Props via `defineProps<T>()` interface, events via `defineEmits<T>()`
- Use `defineModel()` for v-model bindings

**Testing Requirements:**

- Unit tests for all composables and utilities
- Component tests for interactive components
- E2E tests for critical user flows (auth, CRUD operations)
- Maintain test coverage above 80%

## Documentation

- Comprehensive docs in `/docs/` for all patterns and implementations
- README.md for setup and quick start
- CLAUDE.md for AI assistant context and guidelines
