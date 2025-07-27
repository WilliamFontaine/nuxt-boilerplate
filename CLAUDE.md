# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 4 boilerplate featuring TypeScript, Nuxt UI, Prisma ORM, PostgreSQL, testing with Vitest/Playwright, and i18n support. The project uses a monorepo-like structure with shared utilities and comprehensive testing setup.

## Specialized Agents

For detailed expertise in specific domains, refer to specialized agents in `.claude/agents/`:

- **Frontend**: `frontend.md` - Vue/Nuxt components, UI, i18n
- **Backend**: `backend.md` - API routes, validation, server logic
- **Database**: `database.md` - Prisma, PostgreSQL, migrations
- **Testing**: `testing.md` - Vitest unit tests, Playwright E2E
- **DevOps**: `devops.md` - Docker, CI/CD, deployment
- **Architecture**: `architecture.md` - System design, performance
- **Documentation**: `documentation.md` - API docs, technical writing
- **Quality**: `quality.md` - Code review, best practices
- **Product**: `product.md` - Requirements, user stories, features
- **Orchestrator**: `orchestrator.md` - Multi-agent coordination, workflows

Each agent has specialized MCP integrations and detailed workflows for their domain.

## Essential Commands

### Development

```bash
npm run dev                 # Start development server
npm run build               # Build for production
npm run preview             # Preview production build
```

### Database Operations

```bash
docker compose up -d        # Start PostgreSQL database (includes Adminer at :8000)
npx prisma migrate dev      # Run database migrations
npm run db:generate         # Generate Prisma client
npm run db:push             # Push schema changes to database
npm run db:studio           # Open Prisma Studio
```

### Code Quality

```bash
npm run lint                # Run both ESLint and Prettier
npm run lint:eslint         # Run ESLint only
npm run lint:prettier       # Run Prettier only
```

### Testing

```bash
npm test                    # Run all tests (unit + E2E)
npm run test:unit           # Run unit tests only (Vitest)
npm run test:unit:watch     # Run unit tests in watch mode
npm run test:unit:coverage  # Run unit tests with coverage
npm run test:e2e            # Run E2E tests (all browsers)
npm run test:e2e:ui         # Run E2E tests with Playwright UI
npm run test:e2e:debug      # Run E2E tests in debug mode
npx playwright install     # Install Playwright browsers (one-time)
```

### API Documentation

```bash
# Access Swagger UI (development only)
open http://localhost:3000/api/docs/ui
```

### Deployment

```bash
npm run tag:patch           # Version bump and deploy (patch)
npm run tag:minor           # Version bump and deploy (minor)
npm run tag:major           # Version bump and deploy (major)
```

## Architecture

### Directory Structure

- `/app/` - Main Nuxt application (components, pages, layouts, composables, assets)
- `/shared/` - Shared utilities, models, and types (auto-imported via nuxt.config.ts)
- `/server/` - API routes and server middleware
- `/lib/` - Utility libraries (Prisma client singleton, Swagger config)
- `/docs/` - API documentation
- `/prisma/` - Database schema and migrations
- `/tests/` - Test files (unit and E2E tests)
- `/.github/` - CI/CD workflows and GitHub configuration
- `/.server-config/` - Server deployment configuration (HAProxy, Docker)
- `/i18n/` - Internationalization configuration and locales

### Key Patterns & Conventions

#### Database Layer

- **Prisma Singleton**: Database client managed through `lib/prisma.ts` with global singleton pattern
- **Import Pattern**: `import prisma from '@@/lib/prisma'` (using alias for absolute path)
- **Models**: TypeScript interfaces in `shared/models/` mirroring Prisma schema
- **API Types**: Consistent response format via `shared/types/api.ts`

#### Frontend Architecture

- **Composables**: Reusable logic in `app/composables/` (forms, notifications, business logic)
- **Form Components**: Standardized form fields in `app/components/form/field/`
- **Validation**: Yup schemas with i18n integration for error messages
- **State Management**: Reactive composables with computed properties

#### API Design

- **Event Handlers**: RESTful endpoints following Nuxt 3 conventions
- **Response Format**: Consistent `{ statusCode: number, data: T }` structure
- **Error Handling**: Centralized error patterns with proper HTTP status codes
- **Documentation**: Auto-generated OpenAPI/Swagger from JSDoc annotations

#### Component Patterns

- **Form Fields**: Reusable with props for label, placeholder, validation
- **Event Emission**: Type-safe event definitions with `defineEmits<>`
- **Composition API**: Preferred over Options API for all components
- **Scoped Styling**: Component-specific styles when needed

### Tech Stack

- **Framework**: Nuxt 4 with Vue 3 Composition API
- **UI Library**: Nuxt UI components with Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM (v6.12.0)
- **Internationalization**: French default, English support, prefix strategy except default
- **Validation**: Yup for form validation with i18n integration
- **Testing**: Vitest (unit tests) + Playwright (E2E tests, multi-browser)
- **API Documentation**: OpenAPI/Swagger with development-only access
- **Package Manager**: npm
- **Deployment**: Docker + GitHub Actions + GitHub Container Registry

### Environment Setup

#### Development

- `NUXT_DATABASE_URL` - Main database connection
- `TEST_DATABASE_URL` - Test database (defaults to test_database)
- Docker Compose manages PostgreSQL + Adminer (port 8000)

#### Production

- Automated deployment via GitHub Actions on version tags
- Docker multi-stage build for optimized images
- Database migrations run automatically during deployment

## Development Guidelines

### Code Style & Quality

- Single quotes, no semicolons, 100 character line width
- Prettier + ESLint with comprehensive formatting rules
- 2-space indentation, strict spacing rules
- Vue-specific formatting (max 5 attributes per line)
- TypeScript with relaxed rules for Vue components
- Conventional commit format required

### Database Development

- Simple Post model (id, title, content) as example
- Always run `npx prisma migrate dev` after schema changes
- Use descriptive migration names for clarity
- Test migrations with `npm run test:e2e` before committing

### API Development

- RESTful conventions: GET, POST, PUT, DELETE
- File-based routing in `server/api/`
- Consistent response: `{ statusCode: number, data: T }`
- JSDoc annotations for OpenAPI documentation

### Frontend Development

- Composition API preferred over Options API
- Form components in `app/components/form/field/`
- Reusable patterns with proper prop validation
- Type-safe event emissions with `defineEmits<>()`

### Testing Strategy

- Unit tests in `tests/unit/components/`
- E2E tests in `tests/e2e/`
- Multi-browser testing with database isolation
- Coverage reports available via `npm run test:unit:coverage`

## Best Practices

- Always run `npm run lint` before committing
- Use meaningful commit messages (conventional format)
- Write tests for new features
- Document complex business logic
- Follow existing patterns and conventions
- Use shared utilities and auto-imports
- Monitor bundle size and performance

## Important Instructions

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.
