/**
 * Guest Middleware
 *
 * Prevents authenticated users from accessing guest routes
 * Redirects to home page if user is already authenticated
 */
export default defineNuxtRouteMiddleware(() => {
  const { user } = useUserSession()
  const localePath = useLocalePath()

  // If user is authenticated, redirect to home page
  if (user.value) {
    return navigateTo(localePath('/'))
  }
})
