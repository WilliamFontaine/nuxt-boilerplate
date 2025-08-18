/**
 * Authentication Middleware
 *
 * Automatically attaches user to context for protected API routes
 * Public routes are defined in the publicRoutes array below
 */

export default defineEventHandler(async (event) => {
  const path = event.path || ''
  const method = event.method || 'GET'

  // Skip non-API routes
  if (!path.startsWith('/api/')) return

  // Skip MCP endpoints
  if (path.startsWith('/__mcp/')) return

  // Skip internal Nuxt 4 API endpoints (icons, image, etc.)
  // Covers: /api/_nuxt, /api/__nuxt, /api/_image, etc.
  const isInternalNuxtRoute = /^\/api\/[_]{1,2}/.test(path)
  if (isInternalNuxtRoute) return

  // Declare public API routes (exact or prefix)
  const publicRoutes = [
    { path: '/api/auth/login', methods: ['POST'] },
    { path: '/api/auth/register', methods: ['POST'] },
    { path: '/api/auth/verify-email', methods: ['POST'] },
    { path: '/api/auth/resend-verification', methods: ['POST'] },
    { path: '/api/auth/forgot-password', methods: ['POST'] },
    { path: '/api/auth/reset-password', methods: ['POST'] },
    { pathPrefix: '/api/posts', methods: ['GET'] }, // Allow /api/posts and subpaths
    { pathPrefix: '/api/docs', methods: ['GET'] } // Allow /api/docs and subpaths
  ]

  const isPublicRoute = publicRoutes.some((route) => {
    const methodMatches = route.methods.includes(method)

    if ('path' in route) {
      return route.path === path && methodMatches
    }

    if ('pathPrefix' in route) {
      return path.startsWith(route.pathPrefix) && methodMatches
    }

    return false
  })

  if (isPublicRoute) return

  // Protected route: require session
  try {
    const session = await requireUserSession(event)
    // Attach user to context for easy access in handlers
    event.context.user = session.user
  } catch {
    throw unauthorizedError(ERROR_CODES.AUTH.UNAUTHORIZED, 'Authentication required')
  }
})
