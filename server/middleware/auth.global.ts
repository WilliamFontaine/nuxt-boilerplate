/**
 * Authentication Middleware
 *
 * Automatically attaches user to context for protected API routes
 * Public routes are defined in the publicRoutes array below
 */

export default defineEventHandler(async (event) => {
  // Only apply to API routes
  if (!event.path?.startsWith('/api/')) return

  // Define public routes that don't need authentication
  const publicRoutes = [
    { path: '/api/auth/login', methods: ['POST'] },
    { path: '/api/auth/register', methods: ['POST'] },
    { path: '/api/posts', methods: ['GET'] },
    { path: '/api/docs', methods: ['GET'] } // docs and any sub-paths
  ]

  // Check if current route is public
  const isPublicRoute = publicRoutes.some((route) => {
    const pathMatches =
      route.path === '/api/docs'
        ? event.path?.startsWith('/api/docs') // docs and sub-paths
        : event.path === route.path // exact match for other routes
    const methodMatches = route.methods.includes(event.method || 'GET')
    return pathMatches && methodMatches
  })

  if (isPublicRoute) return

  // For protected routes, require authentication
  try {
    const session = await requireUserSession(event)
    // Attach user to context for easy access in handlers
    event.context.user = session.user
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }
})
