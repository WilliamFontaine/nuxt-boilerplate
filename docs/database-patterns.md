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

**Implementation**: See `lib/prisma.ts` for complete Prisma client singleton setup.

**Benefits:**

- ✅ **Single connection** across the application
- ✅ **Hot reload safe** in development
- ✅ **Memory efficient** in production

### Usage Pattern

**Usage**: Import via `@@/lib/prisma` alias. See API routes in `server/api/` for query examples.

## 📊 Schema Definition

### Current Model

**Implementation**: See `prisma/schema.prisma` for complete database schema definition.

### TypeScript Integration

**Implementation**: See `shared/models/` for TypeScript interfaces that mirror the Prisma schema.

## 🐳 Docker Setup

### Development Environment

**Setup**: Use `docker compose up -d` to start PostgreSQL. Database accessible at localhost:5432, Adminer UI at localhost:8080.

### Environment Variables

**Configuration**: See `.env.example` for database environment variables configuration.

## 🔄 Migration Workflow

### Development Workflow

1. Modify schema in `prisma/schema.prisma`
2. Generate and apply migration: `pnpm prisma migrate dev --name describe_your_changes`
3. Generate Prisma client: `pnpm run db:generate`
4. Update TypeScript models in `shared/models/` if needed

### Production Deployment

1. Apply pending migrations: `pnpm prisma migrate deploy`
2. Generate client: `pnpm prisma generate`

## 🛠️ Available Commands

### Database Operations

- `pnpm run db:generate` - Generate Prisma client
- `pnpm run db:push` - Push schema to database (prototyping)
- `pnpm prisma migrate dev` - Create and apply migration
- `pnpm prisma migrate reset` - Reset database (⚠️ data loss)

### Database UI

Access Adminer (database management UI) at `http://localhost:8080` when running `docker compose up -d`. Login with credentials from your `.env` file.

### Schema Management

- `pnpm prisma db pull` - Pull schema from existing database
- `pnpm prisma format` - Format schema file
- `pnpm prisma validate` - Validate schema syntax

## 🚀 API Integration

### Server Route Example

**Implementation**: See `server/api/posts/` for complete CRUD API examples with Prisma integration.

### Error Handling

**Implementation**: See API routes for Prisma error handling patterns with proper HTTP status codes.

## 🧪 Testing

### Test Database Isolation

**Implementation**: Tests use separate `TEST_DATABASE_URL` for isolation when implemented.

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
