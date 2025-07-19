# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 4 boilerplate featuring TypeScript, Nuxt UI, Prisma ORM, PostgreSQL, testing with Vitest/Playwright, and i18n support. The project uses a monorepo-like structure with shared utilities and comprehensive testing setup.

## Essential Commands

### Development

```bash
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm preview                # Preview production build
```

### Database Operations

```bash
docker compose up -d        # Start PostgreSQL database (includes Adminer at :8000)
npx prisma migrate dev      # Run database migrations
pnpm db:generate           # Generate Prisma client
pnpm db:push               # Push schema changes to database
pnpm db:studio             # Open Prisma Studio
```

### Code Quality

```bash
pnpm lint                  # Run both ESLint and Prettier
pnpm lint:eslint           # Run ESLint only
pnpm lint:prettier         # Run Prettier only
```

### Testing

```bash
pnpm test                  # Run all tests (unit + E2E)
pnpm test:unit             # Run unit tests only (Vitest)
pnpm test:unit:watch       # Run unit tests in watch mode
pnpm test:unit:coverage    # Run unit tests with coverage
pnpm test:e2e              # Run E2E tests (all browsers)
pnpm test:e2e:ui           # Run E2E tests with Playwright UI
pnpm test:e2e:debug        # Run E2E tests in debug mode
pnpm test:coverage         # Run unit tests with coverage report
npx playwright install     # Install Playwright browsers (one-time)
```

### Deployment

```bash
pnpm tag:patch             # Version bump and deploy (patch)
pnpm tag:minor             # Version bump and deploy (minor)
pnpm tag:major             # Version bump and deploy (major)
pnpm changelog:generate    # Generate conventional changelog
pnpm changelog:preview     # Preview changelog changes
pnpm version:check         # Check for available updates
```

## Architecture

### Directory Structure

- `/app/` - Main Nuxt application (components, pages, layouts, composables, assets)
- `/shared/` - Shared utilities, models, and types (imported via nuxt.config.ts)
- `/server/` - API routes and server middleware
- `/lib/` - Utility libraries (Prisma client singleton)
- `/prisma/` - Database schema and migrations
- `/tests/` - Test files (unit and E2E tests)

### Key Patterns

- **Prisma Singleton**: Database client is managed through `lib/prisma.ts` with global singleton pattern (`import prisma from '@@/lib/prisma'`)
- **Shared Imports**: `shared/` directory is auto-imported in both client and server via nuxt.config.ts
- **Form Components**: Reusable form components in `app/components/form/` with validation
- **Composables**: Shared logic in `app/composables/` (notifications, form handling)

### Tech Stack

- **Framework**: Nuxt 4 with Vue 3 Composition API
- **UI**: Nuxt UI components with Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM (v6.12.0)
- **i18n**: French default, English support, prefix strategy except default
- **Validation**: Yup for form validation
- **Testing**: Vitest (unit tests) + Playwright (E2E tests, multi-browser)
- **Package Manager**: pnpm

### Environment Setup

- Requires `NUXT_DATABASE_URL` environment variable for development
- Requires `TEST_DATABASE_URL` environment variable for testing (defaults to test_database)
- Database runs in Docker via `docker compose up -d` (creates both main and test databases)
- Auto-migration on deployment via GitHub Actions

### Code Style

- Single quotes, no semicolons, 100 character line width
- Prettier + ESLint with strict formatting rules
- TypeScript with relaxed rules for Vue components
- Husky for pre-commit hooks with CommitLint (conventional commits)
- Supported commit types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert

## Development Notes

### Database

- Simple Post model (id, title, content) as example
- Prisma client singleton prevents connection pool issues
- Migrations managed via `npx prisma migrate dev`

### API Design

- RESTful endpoints in `server/api/`
- Consistent response format with statusCode and data
- Event handlers follow Nuxt 3 conventions

### Internationalization

- Configuration in `app/i18n/locales/`
- Language switcher component available
- Lazy loading with browser detection and cookie persistence

### Testing

- **Unit Tests**: Vitest with Nuxt environment, auto-imports enabled
- **E2E Tests**: Playwright with Chromium/Firefox/WebKit support
- **Coverage**: Available via `pnpm test:coverage` or `pnpm test:unit:coverage`
- **Test Structure**:
  - `tests/setup/` - Global test setup files (vitest.ts, playwright.ts)
  - `tests/unit/components/` - Component unit tests
  - `tests/e2e/` - End-to-end browser tests
- **Database Isolation**: Tests use dedicated `test_database` for data isolation
- **Global Mocks**: Auto-configured mocks for i18n, router, notifications, etc.
- **CI/CD**: GitHub Actions with parallel execution (lint, unit tests, E2E tests)
- **Multi-Browser Testing**: E2E tests run on Chromium, Firefox, and WebKit in CI
- **Test Commands**:
  - Local development: `pnpm test:unit:watch` for TDD
  - Debug E2E: `pnpm test:e2e:debug` for step-by-step debugging
  - UI Mode: `pnpm test:e2e:ui` for visual test runner

### Deployment

- Automated via GitHub Actions on version tags
- Multi-stage Docker build with Node.js 22 Alpine
- GitHub Container Registry for image storage
