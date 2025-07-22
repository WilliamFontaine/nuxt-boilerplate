# Server Installation

## Prerequisites

- Docker and Docker Compose installed
- Ports 80 and 443 accessible

## Setup

Create directory and files on your server:

```bash
mkdir -p ~/nuxt-boilerplate
cd ~/nuxt-boilerplate
```

### 1. Create docker-compose.server.yml

```yaml
services:
  haproxy:
    image: haproxy:2.8-alpine
    container_name: nuxt-haproxy
    ports:
      - '80:80'
    volumes:
      - ./haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg:ro
    networks:
      - nuxt-boilerplate_webnet
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    container_name: nuxt-postgres
    environment:
      POSTGRES_DB: nuxt_app
      POSTGRES_USER: nuxt_user
      POSTGRES_PASSWORD: nuxt_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - nuxt-boilerplate_webnet
    restart: unless-stopped

networks:
  nuxt-boilerplate_webnet:
    name: nuxt-boilerplate_webnet
    driver: bridge

volumes:
  postgres_data:
```

### 2. Create haproxy.cfg

```
defaults
    mode http
    timeout connect 5s
    timeout client 30s
    timeout server 30s

frontend web
    bind *:80
    default_backend app

backend app
    server nuxt nuxt-boilerplate:3000 check
```

### 3. Create .env

```bash
NUXT_DATABASE_URL=postgresql://nuxt_user:nuxt_password@postgres:5432/nuxt_app
NODE_ENV=production
NUXT_HOST=0.0.0.0
NUXT_PORT=3000
```

### 4. Start services

```bash
docker compose -f docker-compose.server.yml up -d
```

Verify services are running:

```bash
docker ps
```

### 5. Deploy application

From your development machine:

```bash
git tag v1.0.0
git push --tags
```

The CI will automatically deploy your Nuxt application to the server.
