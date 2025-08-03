# 🛡️ Security Implementation

Complete security hardening implementation using nuxt-security, authentication patterns, and secure development practices.

## 🔐 Authentication System

### JWT Session Management

Built with `nuxt-auth-utils` for secure session handling:

```typescript
// server/api/auth/login.post.ts
const session = {
  user: {
    id: user.id,
    email: user.email,
    name: user.name
  }
}

await setUserSession(event, session)
```

**Features:**

- ✅ **JWT sessions** with secure cookies
- ✅ **bcrypt password hashing** with salt rounds
- ✅ **Session encryption** using `NUXT_SESSION_PASSWORD`
- ✅ **Automatic session validation**

### Password Security

```typescript
import bcrypt from 'bcrypt'

// Registration
const hashedPassword = await bcrypt.hash(password, 12)

// Login verification
const isValid = await bcrypt.compare(password, user.password)
```

### Session Protection

Access current user session:

```typescript
// In composables/pages
const { user, loggedIn, clear } = useUserSession()

// In server routes
const session = await getUserSession(event)
if (!session.user) {
  throw createError({
    statusCode: 401,
    statusMessage: 'Unauthorized'
  })
}
```

## 🚫 API Route Protection

### Global Auth Middleware

Automatic protection for all API routes:

```typescript
// server/middleware/auth.global.ts
export default defineEventHandler(async (event) => {
  if (isMethod(event, 'GET') || isPublicRoute(event.node.req.url)) {
    return
  }

  const session = await getUserSession(event)
  if (!session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }
})
```

**Protected by default:**

- POST, PUT, DELETE operations
- All non-authentication endpoints

**Public routes:**

- GET operations
- `/api/auth/*` endpoints
- `/api/docs/*` (development only)

### Route Middleware

Client-side route protection:

```typescript
// app/middleware/auth.ts - Protect authenticated pages
export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()

  if (!loggedIn.value) {
    return navigateTo('/auth/login')
  }
})

// app/middleware/guest.ts - Redirect authenticated users
export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useUserSession()

  if (loggedIn.value) {
    return navigateTo('/')
  }
})
```

## 🛡️ Security Headers

### CSP (Content Security Policy)

```typescript
// nuxt.config.ts
security: {
  headers: {
    contentSecurityPolicy: {
      'base-uri': ["'self'"],
      'font-src': ["'self'", 'https:', 'data:'],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'object-src': ["'none'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      'style-src': ["'self'", 'https:', "'unsafe-inline'"],
      'upgrade-insecure-requests': true
    }
  }
}
```

### CORS Configuration

Environment-specific CORS settings:

```typescript
corsHandler: {
  origin: process.env.NODE_ENV === 'development'
    ? ['http://localhost:3000', 'http://127.0.0.1:3000']
    : process.env.CORS_ORIGIN?.split(','),
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true
}
```

### Additional Security Headers

```typescript
headers: {
  strictTransportSecurity: {
    maxAge: 31536000,
    includeSubdomains: true
  },
  xContentTypeOptions: 'nosniff',
  xFrameOptions: 'DENY',
  xXSSProtection: '1; mode=block',
  referrerPolicy: 'no-referrer'
}
```

## ⏱️ Rate Limiting

Prevents abuse and DoS attacks:

```typescript
rateLimiter: {
  tokensPerInterval: 150,      // Max requests
  interval: 300000,            // 5 minutes
  throwError: true             // Return 429 when exceeded
}
```

## 🔒 Input Validation

### Server-Side Validation

```typescript
// server/utils/validation.ts
import { z } from 'zod'

export const validatePostData = (data: unknown) => {
  const schema = z.object({
    title: z.string().min(1).max(100).trim(),
    content: z.string().min(1).max(2000).trim()
  })

  return schema.parse(data)
}
```

### Client-Side Validation

```typescript
// Zod schemas with security considerations
const loginSchema = z.object({
  email: z.string().email().max(254), // RFC 5321 limit
  password: z.string().min(8).max(128) // Reasonable limits
})
```

## 🔐 Environment Security

### Required Environment Variables

```bash
# Production security requirements
NUXT_SESSION_PASSWORD="your-32-character-secret-key-here"
CORS_ORIGIN="https://yourdomain.com,https://www.yourdomain.com"
NUXT_DATABASE_URL="postgresql://..."
```

### Development vs Production

```typescript
// Environment-specific configurations
const isDevelopment = process.env.NODE_ENV === 'development'

security: {
  headers: {
    crossOriginEmbedderPolicy: isDevelopment ? 'unsafe-none' : 'require-corp'
  }
}
```

## 🚫 Attack Prevention

### XSS Protection

1. **CSP headers** prevent inline script execution
2. **Input sanitization** via Zod validation
3. **Template escaping** automatic in Vue templates

### CSRF Protection

1. **SameSite cookies** with `lax` setting
2. **Origin validation** in CORS configuration
3. **Secure cookie flags** in production

### SQL Injection Prevention

1. **Prisma ORM** with parameterized queries
2. **No raw SQL** in application code
3. **Type-safe database operations**

## 📊 Security Monitoring

### Error Handling

```typescript
// Secure error responses
export const handleApiError = (error: unknown) => {
  // Never expose internal errors in production
  if (process.env.NODE_ENV === 'production') {
    return { statusCode: 500, message: 'Internal server error' }
  }

  // Detailed errors only in development
  return { statusCode: 500, message: error.message }
}
```

### Audit Logging

```typescript
// Track authentication events
export const logSecurityEvent = (event: string, userId?: number) => {
  console.log(`[SECURITY] ${event}`, {
    timestamp: new Date().toISOString(),
    userId,
    ip: getClientIP(event)
  })
}
```

## ✅ Security Checklist

### Authentication

- [x] JWT session management
- [x] bcrypt password hashing (12 rounds)
- [x] Session encryption
- [x] Automatic session validation

### Authorization

- [x] Route-level protection
- [x] API middleware authentication
- [x] Role-based access (ready for extension)

### Input Validation

- [x] Server-side Zod validation
- [x] Client-side form validation
- [x] File upload restrictions (if implemented)

### Security Headers

- [x] Content Security Policy
- [x] HSTS (HTTPS enforcement)
- [x] X-Frame-Options (clickjacking)
- [x] X-Content-Type-Options
- [x] CORS configuration

### Infrastructure

- [x] Rate limiting
- [x] Environment variable security
- [x] Database connection security
- [x] Docker container security

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Nuxt Security Module](https://nuxt-security.vercel.app/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [CSP Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
