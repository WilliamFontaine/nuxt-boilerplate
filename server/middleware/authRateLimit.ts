import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const url = getRequestURL(event)

  if (url.pathname !== '/api/auth/login' || event.method !== 'POST') {
    return
  }

  const body = await readBody(event)
  const email = body?.email?.toLowerCase()

  if (!email) {
    return
  }

  const ipAddress = getClientIP(event)

  let rateLimitInfo
  try {
    rateLimitInfo = await checkLoginAttempt(email, ipAddress)
  } catch (error) {
    // If rate limit check fails (e.g., DB down), don't block the request
    // Log the error but allow the request to proceed
    // eslint-disable-next-line no-console
    console.error('Rate limit check failed:', error)
    return
  }

  if (rateLimitInfo.isBlocked) {
    setResponseStatus(event, 429)
    if (rateLimitInfo.retryAfterSeconds) {
      setHeader(event, 'Retry-After', rateLimitInfo.retryAfterSeconds)
    }

    // Calculate accurate remaining time from blockedUntil
    const now = new Date()
    const totalSeconds = rateLimitInfo.blockedUntil
      ? Math.ceil((rateLimitInfo.blockedUntil.getTime() - now.getTime()) / 1000)
      : rateLimitInfo.retryAfterSeconds || 0
    const minutes = Math.floor(Math.max(0, totalSeconds) / 60)
    const seconds = Math.max(0, totalSeconds) % 60

    // Ensure we always show at least 1 minute if blocked
    const displayMinutes = minutes === 0 && seconds === 0 ? 1 : minutes
    const displaySeconds = minutes === 0 && seconds === 0 ? 0 : seconds

    rateLimitError(
      ERROR_CODES.RATE_LIMIT.TOO_MANY_ATTEMPTS,
      'Too many attempts. Try again later.',
      {
        retryAfter: rateLimitInfo.retryAfterSeconds,
        blockedUntil: rateLimitInfo.blockedUntil,
        minutes: displayMinutes,
        seconds: displaySeconds
      }
    )
  }

  // Store rate limit info in context for potential use in login route
  event.context.rateLimitInfo = rateLimitInfo
})
