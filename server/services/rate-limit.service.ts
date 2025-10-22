import prisma from '@@/lib/prisma'
import type { H3Event } from 'h3'

/**
 * Get Rate Limiting Configuration from runtime config
 */
function getRateLimitConfig() {
  const config = useRuntimeConfig()
  return {
    loginMaxAttempts: Number(config.rateLimit.loginMax) || 5,
    loginWindowMinutes: Number(config.rateLimit.loginWindow) || 15,
    tokenCooldownMinutes: Number(config.rateLimit.tokenCooldown) || 5
  }
}

/**
 * Check if user has hit token rate limit (simple version using existing tokens)
 */
export async function checkTokenRateLimit(userId: string, tokenType: TokenTypeEnum): Promise<void> {
  const recentToken = await prisma.token.findFirst({
    where: { userId, type: tokenType },
    orderBy: { createdAt: 'desc' }
  })

  if (recentToken) {
    const { tokenCooldownMinutes } = getRateLimitConfig()
    const cooldownMs = tokenCooldownMinutes * 60 * 1000
    const timeSinceLastToken = Date.now() - recentToken.createdAt.getTime()

    if (timeSinceLastToken < cooldownMs) {
      const remainingMs = cooldownMs - timeSinceLastToken
      const totalSeconds = Math.ceil(remainingMs / 1000)
      const remainingMinutes = Math.floor(totalSeconds / 60)
      const remainingSeconds = totalSeconds % 60
      let actionName: string
      switch (tokenType) {
        case 'EMAIL_VERIFICATION':
          actionName = 'verification email'
          break
        case 'PASSWORD_RESET':
          actionName = 'password reset'
          break
        default:
          actionName = 'token action'
      }

      rateLimitError(ERROR_CODES.RATE_LIMIT.EXCEEDED, 'Too many requests', {
        message: `Please wait ${remainingMinutes}min ${remainingSeconds}s before requesting another ${actionName}.`,
        retryAfter: totalSeconds,
        remainingMinutes,
        remainingSeconds,
        remainingMs
      })
    }
  }
}

/**
 * Check login rate limit
 */
export async function checkLoginAttempt(
  email: string,
  ipAddress: string
): Promise<{
  isBlocked: boolean
  remainingAttempts?: number
  blockedUntil?: Date
  retryAfterSeconds?: number
}> {
  try {
    const { loginWindowMinutes, loginMaxAttempts } = getRateLimitConfig()
    const windowMs = loginWindowMinutes * 60 * 1000
    const now = new Date()
    const windowStart = new Date(now.getTime() - windowMs)

    const attempt = await prisma.loginAttempt.findUnique({
      where: { email_ipAddress: { email: email.toLowerCase(), ipAddress } }
    })

    // No attempts or expired window
    if (!attempt || attempt.lastAttemptAt < windowStart) {
      return { isBlocked: false, remainingAttempts: loginMaxAttempts }
    }

    // Still blocked
    if (attempt.blockedUntil && attempt.blockedUntil > now) {
      const retryAfterSeconds = Math.ceil((attempt.blockedUntil.getTime() - now.getTime()) / 1000)
      return {
        isBlocked: true,
        blockedUntil: attempt.blockedUntil,
        retryAfterSeconds
      }
    }

    // Within window, check remaining attempts
    const remainingAttempts = loginMaxAttempts - attempt.attemptCount
    return {
      isBlocked: false,
      remainingAttempts: Math.max(0, remainingAttempts)
    }
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Rate limit check failed:', error)
    const { loginMaxAttempts } = getRateLimitConfig()
    return { isBlocked: false, remainingAttempts: loginMaxAttempts }
  }
}

/**
 * Record login attempt
 */
export async function recordLoginAttempt(
  email: string,
  ipAddress: string,
  success: boolean
): Promise<void> {
  try {
    const now = new Date()

    if (success) {
      // Clear attempts on success
      await prisma.loginAttempt.deleteMany({
        where: { email: email.toLowerCase(), ipAddress }
      })
      return
    }

    // Record failed attempt
    const { loginWindowMinutes, loginMaxAttempts } = getRateLimitConfig()
    const windowMs = loginWindowMinutes * 60 * 1000
    const windowStart = new Date(now.getTime() - windowMs)

    const attempt = await prisma.loginAttempt.findUnique({
      where: { email_ipAddress: { email: email.toLowerCase(), ipAddress } }
    })

    if (!attempt || attempt.lastAttemptAt < windowStart) {
      // Create new attempt record
      await prisma.loginAttempt.create({
        data: {
          email: email.toLowerCase(),
          ipAddress,
          attemptCount: 1,
          lastAttemptAt: now
        }
      })
    } else {
      // Update existing attempt
      const newCount = attempt.attemptCount + 1
      const blockedUntil = newCount >= loginMaxAttempts ? new Date(now.getTime() + windowMs) : null

      await prisma.loginAttempt.update({
        where: { id: attempt.id },
        data: {
          attemptCount: newCount,
          lastAttemptAt: now,
          blockedUntil
        }
      })
    }
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Failed to record login attempt:', error)
  }
}

/**
 * Get client IP address
 */
export function getClientIP(event: H3Event): string {
  const headers = getHeaders(event)
  return (
    headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    headers['x-real-ip'] ||
    event.node.req.socket.remoteAddress ||
    'unknown'
  )
}
