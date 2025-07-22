# Server Configuration

⚠️ **TEST ENVIRONMENT ONLY - NOT FOR PRODUCTION**

This is a basic demonstration setup for testing purposes. DO NOT use in production without proper security hardening (SSL, firewalls, secure passwords, monitoring, backups, etc.).

## Files to create

1. `docker-compose.server.yml` - HAProxy + PostgreSQL services
2. `haproxy.cfg` - Proxy configuration
3. `Dockerfile.haproxy` - HAProxy build file
4. `.env` - Environment variables (database URL, etc.)

## Process

1. Create files on server (copy content from INSTALL.md)
2. Set secure database password in `.env`
3. Run `docker-compose -f docker-compose.server.yml up -d`
4. Deploy app via CI tags

See [INSTALL.md](INSTALL.md) for complete file contents and steps.
