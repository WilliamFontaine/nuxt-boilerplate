# Nuxt Boilerplate

![Screenshot](./public/screenshot.png)

A modern **Nuxt 4** production-ready boilerplate with TypeScript, authentication, and full-stack development tools.

## 🚀 Features

- **🔧 Nuxt 4** with Vue 3 Composition API and TypeScript
- **🎨 Nuxt UI** components with Tailwind CSS
- **🔐 Authentication** with JWT sessions, bcrypt password hashing, and email verification system
- **🗄️ Prisma ORM** with PostgreSQL and Docker setup
- **🌍 Internationalization** (French/English) with auto-detection
- **🛡️ Security** hardening with CORS, CSP, rate limiting, and flexible HTTP/HTTPS configuration
- **🧪 Testing** with Vitest (unit) and Playwright (E2E)
- **✨ Code Quality** with ESLint, Prettier, and conventional commits
- **🗂️ State Management** with Pinia and cookie persistence
- **📱 SEO Optimized** with structured meta tags
- **🐳 Docker** support for development

## ⚡ Quick Start

### Prerequisites

- Node.js ≥ 22.0.0
- npm ≥ 10.0.0
- Docker (for PostgreSQL)

### Setup

1. **Clone and install**

   ```bash
   git clone <repository-url> my-project
   cd my-project
   npm install
   cp .env.example .env
   ```

2. **Start database**

   ```bash
   docker compose up -d          # Start PostgreSQL
   npx prisma migrate dev        # Run database migrations
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

Visit **http://localhost:3000** to see your app with authentication system and example Posts.

## 🛠️ Key Commands

```bash
npm run dev            # start dev server
npm run build          # build for production
npm run lint           # run ESLint + Prettier
npm test               # run unit + E2E tests
docker compose up -d   # start PostgreSQL
npx prisma migrate dev # run DB migrations
```

## 📁 Project Structure

```
├── app/                      # Nuxt application
│   ├── components/           # Vue components (auto-imported)
│   ├── composables/          # Form composables, utilities
│   ├── pages/                # File-based routing
│   └── layouts/              # Layout components
├── shared/                   # Shared utilities (auto-imported)
│   ├── models/               # Zod schemas and type definitions
│   ├── types/                # API and shared types
│   └── utils/                # Utility functions
├── server/                   # Server-side code
│   ├── api/                  # API routes (auto-mapped)
│   ├── services/             # Business logic services
│   └── middleware/           # Server middleware
├── prisma/                   # Database schema and migrations
└── tests/                    # Unit and E2E tests
```

## 🔧 Tech Stack

- **Frontend**: Nuxt 4, Vue 3, TypeScript, Nuxt UI, Tailwind CSS
- **Backend**: Nitro, H3, PostgreSQL, Prisma ORM
- **Auth**: JWT sessions, bcrypt, email verification, rate limiting
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Quality**: ESLint, Prettier, Husky hooks

## 📚 Documentation

Detailed implementation guides in `/docs/`:

### 🎯 Implementation Patterns

- **[Form Patterns](./docs/form-patterns.md)** - Form composables and validation
- **[Component Architecture](./docs/component-architecture.md)** - Vue component patterns
- **[Database Patterns](./docs/database-patterns.md)** - Prisma usage and optimization
- **[Security Patterns](./docs/security-patterns.md)** - Authentication, HTTPS/HTTP security, CORS
- **[Testing Patterns](./docs/testing-patterns.md)** - Unit and E2E testing strategies
- **[Pinia Patterns](./docs/pinia-patterns.md)** - State management with persistence
- **[Notification System](./docs/notification-system.md)** - Toast system and notifications

### 🌟 System Features

- **[Email System](./docs/email-system.md)** - Handlebars templates and automated delivery
- **[Internationalization](./docs/internationalization.md)** - Multi-language support
- **[SEO Patterns](./docs/seo-patterns.md)** - SEO optimization and social media
- **[Auto-imports Configuration](./docs/auto-imports.md)** - Optimized auto-imports setup

### 🚀 Operations

- **[Deployment Guide](./docs/deployment-guide.md)** - Production deployment strategies
- **[API Documentation](./docs/api.md)** - Auto-generated API documentation

## 🎛️ Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Database (required)
NUXT_DATABASE_URL="postgresql://postgres:P@ssw0rd@localhost:5432/database"

# Authentication (required)
NUXT_SESSION_PASSWORD="your-32-character-secret-key-here"

# Email System (required for email verification/password reset)
NUXT_NODEMAILER_HOST="smtp.gmail.com"
NUXT_NODEMAILER_PORT="587"
NUXT_NODEMAILER_AUTH_USER="your-email@gmail.com"
NUXT_NODEMAILER_AUTH_PASS="your-app-password"
NUXT_NODEMAILER_FROM="your-app-name@gmail.com"

# Production Configuration
NUXT_PUBLIC_SITE_URL="https://yourdomain.com"
# CORS is handled automatically by Nitro for API routes
# Use a reverse proxy (nginx/haproxy) for HTTPS in production
```

## 🚀 Getting Started Guide

1. **Authentication System** - Complete JWT auth with registration, login, email verification, password reset
2. **Email System** - Email verification and password reset with template rendering
3. **Posts Example** - Full CRUD implementation demonstrating the architecture
4. **Form Patterns** - Reusable form composables with validation (useLoginForm, usePostForm)
5. **Auto-imports** - No manual imports needed for shared utilities, composables, components

## 🤝 Contributing

1. Follow conventional commit format
2. Run tests before submitting: `npm test`
3. Ensure code quality: `npm run lint`

---

**Built with ❤️ using Nuxt 4**
