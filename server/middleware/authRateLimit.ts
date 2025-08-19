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
    // eslint-disable-next-line no-console
    console.error('Rate limit check failed:', error)
    return
  }

  if (rateLimitInfo.isBlocked) {
    setResponseStatus(event, 429)
    if (rateLimitInfo.retryAfterSeconds) {
      setHeader(event, 'Retry-After', rateLimitInfo.retryAfterSeconds)
    }

    const totalSeconds = rateLimitInfo.retryAfterSeconds || 60
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    rateLimitError(
      ERROR_CODES.RATE_LIMIT.TOO_MANY_ATTEMPTS,
      'Too many attempts. Try again later.',
      {
        retryAfter: rateLimitInfo.retryAfterSeconds,
        blockedUntil: rateLimitInfo.blockedUntil,
        minutes,
        seconds,
        remainingMinutes: minutes,
        remainingSeconds: seconds
      }
    )
  }

  event.context.rateLimitInfo = rateLimitInfo
})
