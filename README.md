# Nuxt Boilerplate

A modern **Nuxt 4** boilerplate with TypeScript, Nuxt UI, Prisma, and PostgreSQL. Built with a monorepo-like structure featuring shared utilities and optimized for rapid development.

> **⚠️ This is a template project.** After cloning, use the included `rename-project.sh` script to customize it for your needs.

## ✨ Features

- **[Nuxt 4](https://nuxt.com/)** with Vue 3 Composition API and TypeScript
- **[Nuxt UI](https://ui.nuxt.com/)** components with Tailwind CSS
- **[Prisma ORM](https://www.prisma.io/)** with PostgreSQL and Docker setup
- **[i18n](https://i18n.nuxtjs.org/)** support (French/English)
- **Testing** with Vitest (unit) and Playwright (E2E)
- **Code Quality** with ESLint, Prettier, and Husky hooks
- **CI/CD** with GitHub Actions and automated deployment

## 🚀 Quick Start

1. **Clone and setup**

   ```bash
   git clone <repository-url> my-project
   cd my-project
   ./rename-project.sh my-awesome-project  # Optional
   ```

2. **Install and run**

   ```bash
   pnpm install
   docker compose up -d
   npx prisma migrate dev
   pnpm dev
   ```

3. **Access your app**
   - Application: http://localhost:3000
   - Database Admin: http://localhost:8000
   - Prisma Studio: `npx prisma studio`

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
├── prisma/                # Database schema and migrations
├── tests/                 # Unit and E2E tests
└── i18n/locales/          # Language files
```

## 🔧 Development Commands

| Command              | Description              |
| -------------------- | ------------------------ |
| `pnpm dev`           | Start development server |
| `pnpm build`         | Build for production     |
| `pnpm lint`          | Run ESLint + Prettier    |
| `pnpm test`          | Run all tests            |
| `pnpm test:unit`     | Run unit tests only      |
| `pnpm test:e2e`      | Run E2E tests only       |
| `pnpm test:coverage` | Run tests with coverage  |

### Database Commands

```bash
# Database operations
docker compose up -d             # Start PostgreSQL
npx prisma migrate dev           # Run migrations
npx prisma db push               # Push schema changes
npx prisma studio                # Open database editor

# Generate Prisma client
pnpm db:generate
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
pnpm test:unit:watch              # TDD with auto-reload
pnpm test:unit:coverage           # With coverage report
```

### E2E Tests (Playwright)

```bash
pnpm test:e2e:ui                  # Visual test runner
pnpm test:e2e:debug               # Debug mode
```

**Test Features:**

- Database isolation with dedicated `test_database`
- Multi-browser testing (Chromium, Firefox, WebKit)
- Auto-imports and global mocks pre-configured
- Coverage reports with V8 provider

## 🚀 Deployment

### Versioning

Use conventional commits for automated changelog generation:

```bash
# Create releases
pnpm tag:patch                    # Bug fixes (0.0.x)
pnpm tag:minor                    # New features (0.x.0)
pnpm tag:major                    # Breaking changes (x.0.0)

# Preview changes
pnpm version:check
pnpm changelog:preview
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

### Common Issues

- **Database connection**: Ensure Docker is running and `NUXT_DATABASE_URL` is set
- **Prisma errors**: Run `npx prisma generate` after schema changes
- **Test failures**: Check that `test_database` exists in Docker
- **Build errors**: Clear `.nuxt` directory and reinstall dependencies

## 📚 Resources

- [Nuxt 4 Documentation](https://nuxt.com/)
- [Nuxt UI Components](https://ui.nuxt.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vue 3 Guide](https://vuejs.org/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes following conventional commits
4. Run `pnpm lint` and `pnpm test`
5. Submit a Pull Request

---

**Built with ❤️ using Nuxt 4**
