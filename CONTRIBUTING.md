# Contributing

## Getting Started

1. Fork the repository
2. Create a feature branch from `develop`
3. Make your changes
4. Submit a Pull Request to `develop`

## Development Setup

```bash
git clone <your-fork>
cd nuxt-boilerplate
npm install
docker compose up -d          # Start PostgreSQL
npx prisma migrate dev        # Run migrations
npm run dev                   # Start development server
```

## Code Standards

### TypeScript

- Strict mode only - no `any` types
- Explicit typing for parameters and returns
- Follow existing patterns

### Testing

```bash
npm run lint    # ESLint + Prettier
npm test        # Unit + E2E tests
npm run build   # Type checking
```

### Project Structure

- `/app/` - Nuxt application
- `/server/` - API routes
- `/shared/` - Shared utilities (auto-imported)
- `/prisma/` - Database schema

## Pull Request Guidelines

**Before submitting:**

- [ ] Tests pass
- [ ] Code is linted
- [ ] Changes are focused and small
- [ ] Commit messages are clear

**PR Description:**

- What changes were made
- Why the changes were needed
- How to test the changes

## Questions?

- Check existing issues and PRs
- Review our [Code of Conduct](CODE_OF_CONDUCT.md)
- Report security issues per our [Security Policy](SECURITY.md)
