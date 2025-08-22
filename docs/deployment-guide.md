# 🚀 Deployment Guide

Production deployment strategies and configuration for the Nuxt 4 boilerplate with database, security, and CI/CD considerations.

## 🏗️ Production Build

### Build Process

**Commands**: `npm ci` → `npx prisma generate` → `npm run build` → `npx prisma migrate deploy`

### Build Artifacts

**Output**: `.output/` directory contains Nitro configuration, server bundle, and static assets.

## 🌐 Environment Configuration

### Required Environment Variables

**Configuration**: See `.env.example` for all required environment variables including database, authentication, security, and server settings.

## 🐳 Docker Deployment

### Dockerfile

**Implementation**: See `Dockerfile` in project root for multi-stage build configuration with security best practices.

### Docker Compose (Production)

**Implementation**: See `.server-config/docker-compose.server.yml` for production Docker setup with HAProxy reverse proxy.

## 🔧 HAProxy Configuration

**Configuration**: See `.server-config/haproxy.cfg` (HTTP) and `haproxy-https.cfg` (HTTPS) for reverse proxy setup with security headers.

## 📊 Database Deployment

### Migration Strategy

1. Backup current database
2. Test migrations on staging
3. Deploy application with `migrate:deploy`
4. Verify application functionality

### Backup Script

**Script**: Use `pg_dump $NUXT_DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql` for database backups.

## 🔄 CI/CD Pipeline

### Automated Release & Deployment

The project includes automated workflows for releases and deployments:

**Release Workflow** (`.github/workflows/release.yml`):

- Triggered on tag push (`v*.*.*`)
- Generates changelog with git-cliff using conventional commits
- Creates GitHub Release with generated changelog

**Deploy Workflow** (`.github/workflows/deploy.yml`):

- Triggered on tag push (`v*.*.*`)
- Builds and pushes Docker image to GitHub Container Registry
- Includes migration verification
- Supports server deployment with Docker network configuration

**Usage**:

**Commands**: See `package.json` scripts for release commands (`npm run release:patch`, `release:minor`, `release:major`).

**Server Configuration**: See `.server-config/` directory for:

- Docker Compose setup (`docker-compose.server.yml`)
- HAProxy configurations for HTTP (`haproxy.cfg`) and HTTPS (`haproxy-https.cfg`)
- Flexible security configuration via `NUXT_FORCE_HTTPS` environment variable

### GitHub Actions

**Implementation**: See `.github/workflows/deploy.yml` for complete deployment workflow.

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection**: Check `NUXT_DATABASE_URL` format and test with `npx prisma db pull`
2. **Build Failures**: Clear cache with `rm -rf .nuxt .output node_modules && npm ci`
3. **Memory Issues**: Use `NODE_OPTIONS="--max-old-space-size=4096"` for builds

### Log Analysis

**Docker Commands**: Use `docker logs`, `docker stats` for monitoring deployed containers.

## 📚 Resources

- [Nuxt Deployment](https://nuxt.com/docs/getting-started/deployment)
- [Nitro Deployment](https://nitro.unjs.io/deploy)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
