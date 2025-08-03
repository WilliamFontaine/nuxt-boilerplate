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

## Architecture & Patterns

**Database & API:**

- Prisma client singleton in `lib/prisma.ts`, import via alias (`@@/lib/prisma`)
- RESTful API with standardized JSON responses `{ statusCode, data }`
- Global auth middleware protects API routes automatically
- Server services pattern in `server/services/` for business logic

**Authentication & Security:**

- JWT sessions with `nuxt-auth-utils` and `useUserSession()` composable
- bcrypt password hashing (12 rounds) for user registration
- Protected/guest route middleware (`auth.ts`, `guest.ts`)
- Security headers (CSP, HSTS, CORS) and rate limiting via `nuxt-security`

**Frontend Patterns:**

- Form composables pattern (`usePostForm`, `useLoginForm`, `useRegisterForm`)
- Reusable field components (`ui/form/`) with consistent validation
- Pinia stores with cookie persistence (`@pinia-plugin-persistedstate/nuxt`)
- Notification system (`useNotifications`) with toast feedback
- Auto-imports for components, composables, stores, and shared utilities

**Testing & Quality:**

- Unit tests (Vitest) and E2E tests (Playwright) with separate configs
- Test database isolation using `TEST_DATABASE_URL`
- Component testing with Vue Test Utils and proper mocking
- Code quality with ESLint, Prettier, and conventional commits

**SEO & I18n:**

- Localized meta tags with `@nuxtjs/seo` and `useSeo` composable
- French/English i18n with auto-detection and SEO-friendly URLs

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

**Code Standards:**

- Use Nuxt 4 auto-imports; no manual imports needed for core directories
- Code style: single quotes, 2 spaces indentation, max 100 chars per line
- TypeScript strict mode enabled; always use type annotations for props/events
- Conventional commits format for git messages with semantic versioning

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

**Documentation:**

- Comprehensive docs in `/docs/` for all patterns and implementations
- API documentation auto-generated via OpenAPI/Swagger
- README.md for setup and quick start
- CLAUDE.md for AI assistant context and guidelines

## Specialized Agents

This project includes specialized Claude agents for focused development tasks. Access via `/agents` command:

**Development Specialists:**

- `nuxt-frontend-specialist` - Vue 3 Composition API, NuxtUI, Pinia, forms, i18n (mcp**nuxt, nuxt-mcp, mcp**context7)
- `nuxt-backend-specialist` - Nitro server, REST APIs, authentication, validation (mcp**nuxt, nuxt-mcp, mcp**context7)
- `database-specialist` - Prisma ORM, PostgreSQL, migrations, query optimization (mcp**prisma, mcp**context7)

**Quality & Operations:**

- `testing-specialist` - Vitest unit tests, Playwright E2E, multi-browser testing (mcp**playwright, mcp**context7)
- `code-quality-specialist` - Performance, security, accessibility, code review (mcp**context7, mcp**sequential-thinking)
- `devops-specialist` - Docker, CI/CD, monitoring, deployment automation (mcp\_\_context7)

**Architecture & Coordination:**

- `system-architect` - Technical decisions, design patterns, performance optimization (mcp**sequential-thinking, mcp**context7)
- `technical-writer` - API docs, component docs, user guides, technical writing (mcp\_\_context7)
- `product-manager` - Requirements analysis, user stories, feature planning (mcp\_\_sequential-thinking)
- `feature-orchestrator` - Multi-agent coordination, workflow management, delivery (mcp\_\_sequential-thinking)

Each agent has focused expertise, optimized tool access (MCPs in parentheses), and project-specific context for maximum efficiency.

## MCP Configuration

Key MCPs configured for this project:

**Essential MCPs:**

- `mcp__nuxt` - Nuxt documentation and module management
- `nuxt-mcp` - Project-specific Nuxt app understanding (localhost:3000/\_\_mcp/sse)
- `mcp__prisma` - PostgreSQL database management with Prisma
- `mcp__playwright` - E2E testing automation
- `mcp__context7` - Up-to-date library documentation
- `mcp__sequential-thinking` - Complex problem solving

**Recommended Additional MCPs:**

- Docker MCP - Container management for PostgreSQL
- GitHub Actions MCP - CI/CD automation
- Monitoring MCP - Performance and error tracking
