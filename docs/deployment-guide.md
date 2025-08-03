# 🚀 Deployment Guide

Production deployment strategies and configuration for the Nuxt 4 boilerplate with database, security, and CI/CD considerations.

## 🏗️ Production Build

### Build Process

```bash
# Install dependencies
npm ci

# Generate Prisma client
npx prisma generate

# Build application
npm run build

# Apply database migrations
npx prisma migrate deploy
```

### Build Artifacts

```
.output/
├── nitro.json              # Nitro configuration
├── server/                 # Server bundle
└── public/                 # Static assets
```

## 🌐 Environment Configuration

### Required Environment Variables

```bash
# Database
NUXT_DATABASE_URL="postgresql://user:pass@host:5432/db"

# Authentication (32+ characters)
NUXT_SESSION_PASSWORD="your-secure-32-char-session-password"

# Security
CORS_ORIGIN="https://yourdomain.com,https://www.yourdomain.com"

# SEO
NUXT_PUBLIC_SITE_URL="https://yourdomain.com"

# Server
NITRO_HOST="0.0.0.0"
NITRO_PORT="3000"
NODE_ENV="production"
```

### Optional Variables

```bash
# Monitoring
NUXT_PUBLIC_ANALYTICS_ID="GA-XXXXXXXXX"

# CDN
NUXT_PUBLIC_CDN_URL="https://cdn.yourdomain.com"

# Error Tracking
SENTRY_DSN="https://..."
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
FROM node:22-alpine AS base

# Dependencies stage
FROM base AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Build stage
FROM base AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Production stage
FROM base AS runtime
WORKDIR /app

# Copy built application
COPY --from=build /app/.output ./.output
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package*.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nuxt -u 1001
USER nuxt

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

### Docker Compose (Production)

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NUXT_DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@db:5432/${DB_NAME}
      - NUXT_SESSION_PASSWORD=${SESSION_PASSWORD}
      - CORS_ORIGIN=${CORS_ORIGIN}
      - NUXT_PUBLIC_SITE_URL=${SITE_URL}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

## ☁️ Platform Deployments

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Environment variables via dashboard or CLI
vercel env add NUXT_DATABASE_URL
vercel env add NUXT_SESSION_PASSWORD
```

**vercel.json**:

```json
{
  "builds": [
    {
      "src": "nuxt.config.ts",
      "use": "@nuxtjs/vercel-builder"
    }
  ],
  "routes": [
    {
      "src": "/api/docs/.*",
      "status": 404
    }
  ]
}
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

**netlify.toml**:

```toml
[build]
  command = "npm run build"
  publish = ".output/public"

[[redirects]]
  from = "/api/docs/*"
  to = "/404"
  status = 404
  force = true

[build.environment]
  NODE_VERSION = "22"
```

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**railway.json**:

```json
{
  "deploy": {
    "startCommand": "node .output/server/index.mjs",
    "healthcheckPath": "/api/health"
  }
}
```

## 🔧 Reverse Proxy Configuration

### Nginx

```nginx
# nginx.conf
upstream nuxt_app {
    server app:3000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    location / {
        proxy_pass http://nuxt_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Block API docs in production
    location /api/docs {
        return 404;
    }
}
```

### Caddy

```caddy
# Caddyfile
yourdomain.com {
    reverse_proxy app:3000

    # Block API docs
    respond /api/docs/* 404

    # Security headers
    header {
        X-Frame-Options DENY
        X-Content-Type-Options nosniff
        X-XSS-Protection "1; mode=block"
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
    }
}
```

## 📊 Database Deployment

### Migration Strategy

```bash
# Production migration workflow
1. Backup current database
2. Test migrations on staging
3. Deploy application with migrate:deploy
4. Verify application functionality
```

### Backup Script

```bash
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${DATE}.sql"

pg_dump $NUXT_DATABASE_URL > $BACKUP_FILE
echo "Database backup created: $BACKUP_FILE"

# Upload to cloud storage (optional)
aws s3 cp $BACKUP_FILE s3://your-backup-bucket/
```

### Database Health Check

```typescript
// server/api/health.get.ts
export default defineEventHandler(async (event) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { status: 'healthy', database: 'connected' }
  } catch (error) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Database unavailable'
    })
  }
})
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run test:unit
      - run: npx playwright install --with-deps
      - run: npm run test:e2e

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - run: npm ci
      - run: npm run build

      # Deploy to your platform
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: '22'

test:
  stage: test
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run lint
    - npm run test:unit

build:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - .output/
    expire_in: 1 hour

deploy:
  stage: deploy
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  only:
    - main
```

## 📈 Monitoring & Observability

### Application Monitoring

```typescript
// server/plugins/monitoring.ts
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error, { event }) => {
    console.error('Application error:', {
      error: error.message,
      stack: error.stack,
      url: event.node.req.url,
      method: event.node.req.method,
      timestamp: new Date().toISOString()
    })
  })
})
```

### Health Checks

```typescript
// server/api/health.get.ts
export default defineEventHandler(async () => {
  const checks = {
    database: false,
    memory: false,
    uptime: process.uptime()
  }

  try {
    await prisma.$queryRaw`SELECT 1`
    checks.database = true
  } catch (error) {
    // Database check failed
  }

  const memoryUsage = process.memoryUsage()
  checks.memory = memoryUsage.heapUsed < memoryUsage.heapTotal * 0.9

  const allHealthy = Object.values(checks).every(
    (check) => check === true || typeof check === 'number'
  )

  return {
    status: allHealthy ? 'healthy' : 'degraded',
    checks,
    timestamp: new Date().toISOString()
  }
})
```

## 🔧 Performance Optimization

### Static Generation

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ['/sitemap.xml']
    }
  }
})
```

### Caching Strategy

```typescript
// server/api/posts/index.get.ts
export default defineEventHandler(async (event) => {
  // Cache headers
  setHeader(event, 'Cache-Control', 's-maxage=300, stale-while-revalidate=600')

  const posts = await prisma.post.findMany()
  return { statusCode: 200, data: posts }
})
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection**

   ```bash
   # Check connection string format
   echo $NUXT_DATABASE_URL
   # Test connection
   npx prisma db pull
   ```

2. **Build Failures**

   ```bash
   # Clear cache
   rm -rf .nuxt .output node_modules
   npm ci
   ```

3. **Memory Issues**
   ```bash
   # Increase Node.js memory
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

### Log Analysis

```bash
# View application logs
docker logs -f container_name

# Search for errors
docker logs container_name 2>&1 | grep ERROR

# Monitor performance
docker stats container_name
```

## 📚 Deployment Resources

- [Nuxt Deployment](https://nuxt.com/docs/getting-started/deployment)
- [Nitro Deployment](https://nitro.unjs.io/deploy)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Nginx Configuration](https://nginx.org/en/docs/)
