# Nuxt Boilerplate

A modern **Nuxt 4** boilerplate with TypeScript, Nuxt UI, Prisma, and PostgreSQL. Built with a monorepo-like structure featuring shared utilities and optimized for rapid development.

> **⚠️ This is a template project.** After cloning, use the included `rename-project.sh` script to customize it for your needs.

## ✨ Features

- **[Nuxt 4](https://nuxt.com/)** with Vue 3 Composition API and TypeScript
- **[Nuxt UI](https://ui.nuxt.com/)** components with Tailwind CSS
- **[Prisma ORM](https://www.prisma.io/)** with PostgreSQL and Docker setup
- **[i18n](https://i18n.nuxtjs.org/)** support (French/English)
- **API Documentation** with OpenAPI/Swagger (development only)
- **Testing** with Vitest (unit) and Playwright (E2E)
- **Code Quality** with ESLint, Prettier, and Husky hooks
- **CI/CD** with GitHub Actions and automated deployment

## 🚀 Quick Start

1. **Clone and setup**

   ```bash
   git clone <repository-url> my-project
   cd my-project
   ./rename-project.sh my-awesome-project  # Optional: Rename project
   ```

2. **Setup environment**

   ```bash
   npm install                   # Install dependencies
   cp .env.example .env          # Copy environment variables
   docker compose up -d          # Start PostgreSQL database
   ```

3. **Initialize database and run**

   ```bash
   npx prisma migrate dev        # Initialize database with schema
   npm run dev                   # Start development server
   ```

4. **Access your app**
   - **Application**: http://localhost:3000
   - **API Documentation**: http://localhost:3000/api/docs/ui
   - **Database Admin**: http://localhost:8000 (Adminer)
   - **Prisma Studio**: `npx prisma studio`

> **💡 First time setup**: The steps above will create two databases (`database` and `test_database`) as defined in your `.env` file.

## 📁 Project Structure

```
├── app/                   # Main Nuxt 4 application
│   ├── components/        # Vue components (auto-imported)
│   ├── composables/       # Vue composables (auto-imported)
│   ├── pages/             # Application routes
│   └── layouts/           # Page layouts
├── shared/                # Shared utilities (auto-imported)
│   ├── models/            # TypeScript models
│   ├── types/             # Type definitions
│   └── utils/             # Utility functions
├── server/api/            # API routes
├── lib/                   # Utility libraries (Prisma, Swagger)
├── docs/                  # Documentation
├── prisma/                # Database schema and migrations
├── tests/                 # Unit and E2E tests
├── .server-config/        # Server deployment configuration (HAProxy, Docker)
└── i18n/locales/          # Language files
```

## 🔧 Development Commands

| Command                 | Description              |
| ----------------------- | ------------------------ |
| `npm run dev`           | Start development server |
| `npm run build`         | Build for production     |
| `npm run lint`          | Run ESLint + Prettier    |
| `npm test`              | Run all tests            |
| `npm run test:unit`     | Run unit tests only      |
| `npm run test:e2e`      | Run E2E tests only       |
| `npm run test:coverage` | Run tests with coverage  |

### API Documentation

```bash
# Access Swagger UI (development only)
open http://localhost:3000/api/docs/ui
```

### Database Commands

```bash
# Database operations
docker compose up -d             # Start PostgreSQL
npx prisma migrate dev           # Run migrations
npx prisma db push               # Push schema changes
npx prisma studio                # Open database editor

# Generate Prisma client
npm run db:generate
```

## 🏗️ Architecture

### Auto-imports

The `shared/` directory provides auto-imported utilities across the entire stack:

```typescript
// Automatically available everywhere
import { Post } from '~/shared/models/post'
import type { ApiResponse } from '~/shared/types/api'
```

### API Design

Consistent response format across all endpoints:

```typescript
type ApiResponse<T> = {
  statusCode: number
  data: T
}
```

### API Documentation

Automatic OpenAPI/Swagger documentation generated from JSDoc annotations:

```typescript
/**
 * @openapi
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Success
 */
export default defineEventHandler(async () => {
  // API implementation
})
```

- **Development**: Access Swagger UI at http://localhost:3000/api/docs/ui
- **Production**: Documentation endpoints are disabled for security
- **Auto-generated**: Spec updates automatically with code changes

### Built-in Components

- **Forms**: `FormFieldInput`, `FormFieldTextarea`, `FormFieldPassword` with Yup validation
- **Layout**: `ThemeSwitcher`, `LanguageSwitcher`, responsive navigation
- **Content**: `PostCard` with delete confirmation modal
- **Notifications**: Toast system via `useNotifications()` composable

### Key Patterns

- **Prisma Singleton**: Database client prevents connection pool issues
- **Auto-imports**: Shared utilities available everywhere without explicit imports
- **Composables**: `usePostForm()` for form state, `useNotifications()` for alerts
- **i18n Strategy**: French default (no prefix), English with `/en` prefix

## 🧪 Testing

### Unit Tests (Vitest)

```bash
npm run test:unit:watch           # TDD with auto-reload
npm run test:unit:coverage        # With coverage report
```

### E2E Tests (Playwright)

```bash
npm run test:e2e:ui               # Visual test runner
npm run test:e2e:debug            # Debug mode
```

**Test Features:**

- Database isolation with dedicated `test_database`
- Multi-browser testing (Chromium, Firefox, WebKit)
- Auto-imports and global mocks pre-configured
- Coverage reports with V8 provider

## 🚀 Deployment

### Server Configuration

The `.server-config/` directory contains production deployment files:

- **HAProxy Configuration**: Load balancer and reverse proxy setup
- **Docker Compose**: PostgreSQL database service configuration
- **Installation Guide**: Step-by-step server setup instructions

> ⚠️ **Security Notice**: These are basic configurations for testing. Production deployments require SSL certificates, secure passwords, firewalls, and monitoring.

### Versioning

Use conventional commits for automated changelog generation:

```bash
# Create releases
npm run tag:patch                 # Bug fixes (0.0.x)
npm run tag:minor                 # New features (0.x.0)
npm run tag:major                 # Breaking changes (x.0.0)

# Preview changes
npm run version:check
npm run changelog:preview
```

### Commit Types

- `feat:` - New features (minor bump)
- `fix:` - Bug fixes (patch bump)
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code improvements
- `test:` - Tests
- `chore:` - Maintenance

### Production

Required environment variables:

```bash
NUXT_DATABASE_URL="postgresql://user:password@host:5432/database"
NODE_ENV="production"
```

## 💡 Development Tips

### Working with Forms

```vue
<!-- Use built-in form components -->
<FormFieldInput v-model="title" name="title" :label="$t('post.title')" />
<FormFieldTextarea v-model="content" name="content" />

<!-- Or create custom forms with usePostForm() -->
<script setup>
const { form, handleSubmit } = usePostForm()
</script>
```

### Database Best Practices

```typescript
// Use the Prisma singleton (lib/prisma.ts)
import prisma from '@@/lib/prisma'

// For complex queries, add to server/api/
export default defineEventHandler(async (event) => {
  const posts = await prisma.post.findMany()
  return { statusCode: 200, data: posts }
})
```

### Adding New Models

1. Update `prisma/schema.prisma`
2. Create model in `shared/models/`
3. Run `npx prisma migrate dev`
4. Add API routes in `server/api/`

## 📦 Customization

### Project Rename

```bash
./rename-project.sh my-awesome-project
```

Updates package.json, i18n files, Docker names, and GitHub workflows.

### Remove Example Code

1. Delete `shared/models/post.ts`
2. Delete `server/api/posts/` directory
3. Remove Post model from `prisma/schema.prisma`
4. Run `npx prisma migrate dev`

## 🔧 Troubleshooting

### Environment Setup Issues

**Missing .env file**

```bash
# Copy the example file and edit as needed
cp .env.example .env
```

**Database connection errors**

```bash
# Ensure Docker is running
docker compose up -d

# Check if databases exist
docker exec nuxt-boilerplate-postgres-1 psql -U postgres -l

# Reset databases if needed
docker compose down -v
docker compose up -d
npx prisma migrate dev
```

**Prisma client issues**

```bash
# Regenerate Prisma client after schema changes
npx prisma generate

# Reset database completely
npx prisma migrate reset
```

### Common Development Issues

- **Database connection**: Ensure Docker is running and `NUXT_DATABASE_URL` is correctly set in `.env`
- **Prisma errors**: Run `npx prisma generate` after any schema changes
- **Test failures**: Check that `test_database` exists and is accessible
- **Build errors**: Clear `.nuxt` directory and reinstall dependencies with `rm -rf .nuxt node_modules && npm install`
- **Port conflicts**: Change `PORT` in `.env` if port 3000 is already in use
- **Missing packages**: Ensure all dependencies are installed with `npm install`

## 📚 Resources

- [Nuxt 4 Documentation](https://nuxt.com/)
- [Nuxt UI Components](https://ui.nuxt.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vue 3 Guide](https://vuejs.org/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes following conventional commits
4. Run `npm run lint` and `npm run test`
5. Submit a Pull Request

---

**Built with ❤️ using Nuxt 4**
