# 🗃️ Database System

PostgreSQL database management using Prisma ORM with Docker setup and migration workflow.

## 🏗️ Architecture

```
prisma/
  ├── schema.prisma           # Database schema definition
  └── migrations/             # Database migration files
lib/
  └── prisma.ts              # Prisma client singleton
shared/
  └── models/                # TypeScript interface definitions
```

## 🔧 Prisma Setup

### Client Singleton

Database client managed through `lib/prisma.ts` using global singleton pattern:

```typescript
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
```

**Benefits:**

- ✅ **Single connection** across the application
- ✅ **Hot reload safe** in development
- ✅ **Memory efficient** in production

### Usage Pattern

Import using absolute path alias:

```typescript
import prisma from '@@/lib/prisma'

// Query examples
const posts = await prisma.post.findMany()
const post = await prisma.post.findUnique({ where: { id: 1 } })
const newPost = await prisma.post.create({ data: { title, content } })
```

## 📊 Schema Definition

### Current Model

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### TypeScript Integration

Shared models mirror Prisma schema:

```typescript
// shared/models/post.ts
export interface Post {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
}
```

## 🐳 Docker Setup

### Development Environment

```bash
# Start PostgreSQL + Adminer
docker compose up -d

# Database accessible at:
# - PostgreSQL: localhost:5432
# - Adminer UI: localhost:8000
```

### Environment Variables

```env
# Main database (development/production)
NUXT_DATABASE_URL="postgresql://user:password@localhost:5432/database"

# Test database (optional, defaults to test_database)
TEST_DATABASE_URL="postgresql://user:password@localhost:5432/test_database"
```

## 🔄 Migration Workflow

### Development Workflow

```bash
# 1. Modify schema in prisma/schema.prisma
# 2. Generate and apply migration
npx prisma migrate dev --name describe_your_changes

# 3. Generate Prisma client
npm run db:generate

# 4. Update TypeScript models if needed
# Edit shared/models/*.ts to match schema
```

### Production Deployment

```bash
# Apply pending migrations
npx prisma migrate deploy

# Generate client
npx prisma generate
```

## 🛠️ Available Commands

### Database Operations

```bash
npm run db:generate        # Generate Prisma client
npm run db:push           # Push schema to database (prototyping)
npm run db:studio         # Open Prisma Studio UI
npx prisma migrate dev    # Create and apply migration
npx prisma migrate reset  # Reset database (⚠️ data loss)
```

### Schema Management

```bash
npx prisma db pull        # Pull schema from existing database
npx prisma format         # Format schema file
npx prisma validate       # Validate schema syntax
```

## 🚀 API Integration

### Server Route Example

```typescript
// server/api/posts/index.get.ts
import prisma from '@@/lib/prisma'

export default defineEventHandler(async () => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return { statusCode: 200, data: posts }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch posts'
    })
  }
})
```

### Error Handling

```typescript
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

try {
  await prisma.post.create({ data })
} catch (error) {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Unique constraint violation
      throw createError({
        statusCode: 409,
        statusMessage: 'Record already exists'
      })
    }
  }
  throw createError({
    statusCode: 500,
    statusMessage: 'Database operation failed'
  })
}
```

## 🧪 Testing

### Test Database Isolation

Tests use separate database to avoid conflicts:

```typescript
// tests/setup/vitest.ts
import { exec } from 'child_process'

beforeAll(async () => {
  // Reset test database before tests
  await exec('npx prisma migrate reset --force')
})
```

## 🔍 Best Practices

1. **Migration Names** - Use descriptive names for migrations
2. **Schema Changes** - Always use migrations, avoid `db push` in production
3. **Client Import** - Use absolute path `@@/lib/prisma` for consistency
4. **Error Handling** - Handle Prisma-specific errors appropriately
5. **Type Safety** - Keep TypeScript models in sync with Prisma schema
6. **Connection Management** - Use singleton pattern to avoid connection issues

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
