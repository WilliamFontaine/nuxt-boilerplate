# Server Deployment

⚠️ **TESTING/STAGING ONLY** - Basic configuration for development and testing purposes.  
**DO NOT use as-is for production** without proper security hardening, SSL certificates, firewalls, monitoring, backups, and security reviews.

Quick server deployment with Docker, HAProxy and PostgreSQL.  
**→ See [`/docs/deployment-guide.md`](../docs/deployment-guide.md) for complete documentation**

## Setup

1. **Copy server files** to production server
2. **Configure `.env`** (see `/.env.example` for all variables)
3. **Start infrastructure**: `docker-compose -f docker-compose.server.yml up -d`
4. **Deploy app**: `npm run release:patch` (triggers automated deployment)

## HTTP vs HTTPS

| Environment        | Config              | Notes                       |
| ------------------ | ------------------- | --------------------------- |
| HTTP (staging)     | `haproxy.cfg`       | Default for testing         |
| HTTPS (production) | `haproxy-https.cfg` | Use for production with SSL |
