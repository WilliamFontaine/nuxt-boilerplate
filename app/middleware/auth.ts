/**
 * Authentication Middleware
 *
 * Protects routes by checking if user is authenticated
 * Redirects to login page if not authenticated
 */
export default defineNuxtRouteMiddleware(() => {
  const { user } = useUserSession()
  const localePath = useLocalePath()

  // If user is not authenticated, redirect to login
  if (!user.value) {
    return navigateTo(localePath('/auth/login'))
  }
})
