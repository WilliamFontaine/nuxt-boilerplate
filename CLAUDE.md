# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 4 boilerplate featuring TypeScript, Nuxt UI, Prisma ORM, PostgreSQL, testing with Vitest/Playwright, and i18n support. The project uses a monorepo-like structure with shared utilities and comprehensive testing setup.

## Expert Agents avec Intégration MCP

Chaque agent expert utilise des MCP (Model Context Protocols) spécialisés pour des workflows optimisés :

### **1. Vue-Nuxt Expert Agent** 🎨

**MCP Principal**: `nuxt` (search_nuxt_docs, list_nuxt_modules)  
**MCP Secondaire**: `context7` (documentation Vue/Nuxt UI)

- **Key Files**: `app/components/`, `app/composables/`, `app/layouts/`, `app/pages/`, `i18n/`
- **Spécialités**: Composants Vue 3 Composition API, Nuxt UI + Tailwind, i18n (FR/EN), Forms avec Yup, Routing
- **Workflow**: Recherche docs Nuxt → Context7 pour libs → Implémentation avec patterns projet

### **2. Database-Prisma Expert Agent** 🗄️

**MCP Principal**: `prisma` (gestion complète database Postgres)  
**MCP Secondaire**: `context7` (patterns Prisma avancés)

- **Key Files**: `prisma/schema.prisma`, `lib/prisma.ts`, `prisma/migrations/`
- **Spécialités**: Création/gestion databases, Schema design, Migrations, Queries optimisées, Backup/restore
- **Workflow**: Introspection DB → Modification schema → Migration MCP → Tests validation

### **3. Testing-Playwright Expert Agent** 🧪

**MCP Principal**: `playwright` (automation browser complète)  
**MCP Secondaire**: `ide` (diagnostics pour debug)

- **Key Files**: `tests/`, `playwright.config.ts`, `tests/setup/`, `tests/e2e/`
- **Spécialités**: E2E multi-browser, Visual testing, Debug interactif, Intégration CI/CD
- **Workflow**: Snapshot analysis → Navigation/interactions → Diagnostics IDE → Visual validation

### **4. Backend-API Expert Agent** ⚙️

**MCP Principal**: `context7` (Node.js/Nuxt server patterns)  
**MCP Secondaire**: `ide` (validation et diagnostics)

- **Key Files**: `server/api/`, `server/middleware/`, `server/utils/`, `server/validations/`
- **Spécialités**: Event handlers RESTful, Validation Yup server-side, Error handling, Response formatting
- **Workflow**: Context7 patterns → Implémentation validation → IDE diagnostics → Tests API

### **5. DevOps-Infrastructure Expert Agent** 🚀

**MCP Principal**: `context7` (Docker, GitHub Actions, CI/CD)

- **Key Files**: `Dockerfile`, `.github/workflows/`, `docker-compose.yml`
- **Spécialités**: Docker multi-stage, GitHub Actions matrix testing, Déploiement automatisé, Monitoring
- **Workflow**: Context7 best practices → Configuration pipelines → Optimisation build → Monitoring

### **6. Architecture-Performance Expert Agent** 🏗️

**MCP Principal**: `sequential-thinking` (décisions complexes structurées)  
**MCP Secondaire**: `context7` (patterns architecturaux)

- **Key Files**: `nuxt.config.ts`, `shared/`, `eslint.config.mts`, `tsconfig.json`
- **Spécialités**: Décisions architecturales, Optimisation performance, Patterns de code, Migration/refactoring
- **Workflow**: Thinking structuré → Recherche patterns → Proposition alternatives → Plan implémentation

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
npm run test:coverage       # Run unit tests with coverage report
npx playwright install     # Install Playwright browsers (one-time)
```

### API Documentation

```bash
npm run docs:api            # Show API documentation URL
npm run test:security       # Test API documentation security (production protection)
```

### Deployment

```bash
npm run tag:patch           # Version bump and deploy (patch)
npm run tag:minor           # Version bump and deploy (minor)
npm run tag:major           # Version bump and deploy (major)
npm run changelog:generate  # Generate conventional changelog
npm run changelog:preview   # Preview changelog changes
npm run version:check       # Check for available updates
```

## Architecture

### Directory Structure

- `/app/` - Main Nuxt application (components, pages, layouts, composables, assets)
- `/shared/` - Shared utilities, models, and types (auto-imported via nuxt.config.ts)
- `/server/` - API routes and server middleware
- `/lib/` - Utility libraries (Prisma client, Swagger configuration)
- `/prisma/` - Database schema and migrations
- `/tests/` - Test files (unit and E2E tests)
- `/.github/` - CI/CD workflows and GitHub configuration
- `/i18n/` - Internationalization configuration and locales
- `/docs/` - API documentation (auto-generated)
- `/scripts/` - Utility scripts (security testing, etc.)

### Key Patterns & Conventions

#### **Database Layer**

- **Prisma Singleton**: Database client managed through `lib/prisma.ts` with global singleton pattern
- **Import Pattern**: `import prisma from '@@/lib/prisma'` (using alias for absolute path)
- **Models**: TypeScript interfaces in `shared/models/` mirroring Prisma schema
- **API Types**: Consistent response format via `shared/types/api.ts`

#### **Frontend Architecture**

- **Composables**: Reusable logic in `app/composables/` (forms, notifications, business logic)
- **Form Components**: Standardized form fields in `app/components/form/field/`
- **Validation**: Yup schemas with i18n integration for error messages
- **State Management**: Reactive composables with computed properties

#### **API Design**

- **Event Handlers**: RESTful endpoints following Nuxt 3 conventions
- **Response Format**: Consistent `{ statusCode: number, data: T }` structure
- **Error Handling**: Centralized error patterns with proper HTTP status codes
- **Import Pattern**: `shared/` utilities auto-imported in server context

#### **Component Patterns**

- **Form Fields**: Reusable with props for label, placeholder, validation
- **Event Emission**: Type-safe event definitions with `defineEmits<>`
- **Composition API**: Preferred over Options API for all components
- **Scoped Styling**: Component-specific styles when needed

#### **API Documentation**

- **Auto-Generated**: Documentation generated automatically from JSDoc annotations
- **Swagger UI**: Interactive documentation interface at `/api/docs/ui` (development only)
- **Security**: Documentation endpoints disabled in production (NODE_ENV check)
- **Configuration**: Auto-sync with package.json (title, version, description)
- **Pattern**: Simple JSDoc annotations inline with endpoint code

### Tech Stack

- **Framework**: Nuxt 4 with Vue 3 Composition API
- **UI Library**: Nuxt UI components with Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM (v6.12.0)
- **Internationalization**: French default, English support, prefix strategy except default
- **Validation**: Yup for form validation with i18n integration
- **API Documentation**: swagger-jsdoc for auto-generated OpenAPI specification
- **Testing**: Vitest (unit tests) + Playwright (E2E tests, multi-browser)
- **Package Manager**: npm
- **Deployment**: Docker + GitHub Actions + GitHub Container Registry

### Environment Setup

#### **Development**

- `NUXT_DATABASE_URL` - Main database connection
- `TEST_DATABASE_URL` - Test database (defaults to test_database)
- Docker Compose manages PostgreSQL + Adminer (port 8000)

#### **Production**

- Automated deployment via GitHub Actions on version tags
- Docker multi-stage build for optimized images
- Database migrations run automatically during deployment

### Code Style & Quality

#### **Formatting Rules**

- Single quotes, no semicolons, 100 character line width
- Prettier + ESLint with comprehensive formatting rules
- 2-space indentation, strict spacing rules
- Vue-specific formatting (max 5 attributes per line)

#### **TypeScript Configuration**

- Relaxed rules for Vue components (`@typescript-eslint/no-unused-vars: off`)
- Strict type checking for business logic
- Auto-imports for composables and shared utilities

#### **Git Workflow**

- Husky pre-commit hooks with CommitLint
- Conventional commit format required
- Supported types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`
- Automated changelog generation on releases

## Development Guidelines

### Working with MCP-Enhanced Agents

Pour utiliser efficacement les agents experts avec MCP :

1. **Identifier le domaine** de votre tâche (frontend, database, testing, etc.)
2. **Utiliser l'agent approprié** qui possède le MCP spécialisé pour ce domaine
3. **Laisser l'agent utiliser son workflow MCP** pour recherche documentaire et validation
4. **Suivre les patterns spécifiques** du projet découverts via MCP

**Exemples d'utilisation** :

- **Frontend Vue/Nuxt** : L'agent utilise automatiquement `nuxt.search_nuxt_docs()` puis `context7` pour composants
- **Database Prisma** : L'agent utilise `prisma.introspect_database_schema()` avant toute modification
- **Testing E2E** : L'agent utilise `playwright.browser_snapshot()` pour analyser l'état avant interaction
- **Backend API** : L'agent recherche dans `context7` les patterns Node.js puis valide avec `ide.getDiagnostics()`

**Avantages MCP** :

- Documentation toujours à jour via MCP
- Workflows optimisés par domaine d'expertise
- Réduction du contexte grâce à la spécialisation
- Validation automatique via diagnostic tools

### Database Development

#### **Schema & Migrations**

- Simple Post model (id, title, content) as example
- Always run `npx prisma migrate dev` after schema changes
- Use descriptive migration names for clarity
- Test migrations with `npm run test:e2e` before committing

#### **Prisma Patterns**

- Import singleton: `import prisma from '@@/lib/prisma'`
- Client singleton prevents connection pool issues
- Use transactions for complex operations
- Always handle database errors properly

### API Development

#### **Endpoint Structure**

- RESTful conventions: GET, POST, PUT, DELETE
- File-based routing in `server/api/`
- Consistent response: `{ statusCode: number, data: T }`
- Error handling with proper HTTP status codes

#### **Event Handler Patterns**

```typescript
export default defineEventHandler(async (event) => {
  // Validation, business logic, database operations
  return { statusCode: 200, data: result }
})
```

### Frontend Development

#### **Component Architecture**

- Composition API preferred over Options API
- Form components in `app/components/form/field/`
- Reusable patterns with proper prop validation
- Type-safe event emissions with `defineEmits<>()`

#### **State Management**

- Composables for shared logic (`app/composables/`)
- Reactive state with `reactive()` and `ref()`
- Computed properties for derived state
- Form handling with Yup validation

### Internationalization

#### **Configuration**

- Locales in `i18n/locales/` (en.json, fr.json)
- Default language: French, strategy: `prefix_except_default`
- Cookie-based persistence with browser detection

#### **Usage Patterns**

- Components: `const { t } = useI18n()`
- Validation messages: Integration with Yup schemas
- Language switcher: `LanguageSwitcher.vue` component

### Testing Strategy

#### **Unit Tests (Vitest)**

- Location: `tests/unit/components/`
- Setup: `tests/setup/vitest.ts` with global mocks
- Coverage: Available via `npm run test:unit:coverage`
- TDD workflow: `npm run test:unit:watch`

#### **E2E Tests (Playwright)**

- Location: `tests/e2e/`
- Multi-browser: Chromium, Firefox, WebKit
- Database isolation: Dedicated `test_database`
- Debug mode: `npm run test:e2e:debug`
- UI mode: `npm run test:e2e:ui`

#### **CI/CD Testing**

- Parallel execution: lint, unit tests, E2E tests
- Artifact collection: coverage reports, test results
- Multi-browser testing in GitHub Actions

### Deployment Process

#### **Automated Workflow**

1. Version tag creation triggers deployment
2. Docker multi-stage build (Node.js 22 Alpine)
3. Automatic database migrations
4. Container deployment with health checks

#### **Manual Steps**

- Use `npm run tag:patch/minor/major` for releases
- Check `npm run version:check` before releases
- Monitor deployment logs for issues

### API Documentation Workflow

#### **Adding New Endpoints**

1. **Create endpoint file** in `server/api/`
2. **Add JSDoc annotation** with OpenAPI spec:
   ```typescript
   /**
    * @openapi
    * /api/users:
    *   post:
    *     summary: Create user
    *     tags: [Users]
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             required: [name, email]
    *             properties:
    *               name:
    *                 type: string
    *               email:
    *                 type: string
    *     responses:
    *       201:
    *         description: Created
    */
   ```
3. **Documentation auto-updates** - no manual maintenance required

#### **Testing Documentation Security**

```bash
npm run test:security       # Test production protection
npm run test:unit -- tests/unit/swagger-protection.test.ts
npm run test:e2e tests/e2e/swagger-protection.spec.ts
```

### Best Practices

#### **Code Quality**

- Always run `npm run lint` before committing
- Use meaningful commit messages (conventional format)
- Write tests for new features
- Document complex business logic
- Add JSDoc OpenAPI annotations for new endpoints

#### **API Documentation**

- Keep JSDoc annotations minimal and focused
- Use inline schemas for simple types
- Test documentation security with `npm run test:security`
- Access documentation only in development at `/api/docs/ui`

#### **Performance**

- Optimize imports: use shared utilities
- Lazy load components when appropriate
- Monitor bundle size and lighthouse scores
- Use Prisma efficiently (avoid N+1 queries)
