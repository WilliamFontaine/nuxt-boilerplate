import prisma from '@@/lib/prisma'
import type { H3Event } from 'h3'

const MAX_ATTEMPTS = 5
const WINDOW_MINUTES = 15
const WINDOW_MS = WINDOW_MINUTES * 60 * 1000

/**
 * Rate Limit Service - Handles login attempts tracking and blocking
 */

/**
 * Check if the login attempt is blocked
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
  const now = new Date()

  const loginAttempt = await prisma.loginAttempt.findUnique({
    where: {
      email_ipAddress: {
        email: email.toLowerCase(),
        ipAddress
      }
    }
  })

  const windowStart = new Date(now.getTime() - WINDOW_MS)

  if (loginAttempt) {
    // If blocking has expired or attempt window has expired, reset the entry
    if (
      (loginAttempt.blockedUntil && loginAttempt.blockedUntil <= now) ||
      loginAttempt.lastAttemptAt < windowStart
    ) {
      await prisma.loginAttempt.update({
        where: {
          id: loginAttempt.id
        },
        data: {
          attemptCount: 1,
          lastAttemptAt: now,
          blockedUntil: null
        }
      })
      return { isBlocked: false }
    }
  }

  // Check if still blocked
  if (loginAttempt?.blockedUntil && loginAttempt.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil(
      (loginAttempt.blockedUntil.getTime() - now.getTime()) / 1000
    )

    return {
      isBlocked: true,
      blockedUntil: loginAttempt.blockedUntil,
      retryAfterSeconds
    }
  }

  // Return remaining attempts info
  if (loginAttempt && loginAttempt.lastAttemptAt >= windowStart) {
    const remainingAttempts = MAX_ATTEMPTS - loginAttempt.attemptCount
    return {
      isBlocked: false,
      remainingAttempts: remainingAttempts > 0 ? remainingAttempts : 0
    }
  }

  // No attempts yet or window expired - return max attempts
  return {
    isBlocked: false,
    remainingAttempts: MAX_ATTEMPTS
  }
}

/**
 * Record a login attempt (success or failure)
 */
export async function recordLoginAttempt(
  email: string,
  ipAddress: string,
  success: boolean
): Promise<void> {
  const now = new Date()

  if (success) {
    await prisma.loginAttempt.deleteMany({
      where: {
        email: email.toLowerCase(),
        ipAddress
      }
    })
    return
  }

  const loginAttempt = await prisma.loginAttempt.findUnique({
    where: {
      email_ipAddress: {
        email: email.toLowerCase(),
        ipAddress
      }
    }
  })

  if (!loginAttempt) {
    await prisma.loginAttempt.create({
      data: {
        email: email.toLowerCase(),
        ipAddress,
        attemptCount: 1,
        lastAttemptAt: now
      }
    })
    return
  }

  const windowStart = new Date(now.getTime() - WINDOW_MS)
  const attemptCount = loginAttempt.lastAttemptAt >= windowStart ? loginAttempt.attemptCount + 1 : 1

  const blockedUntil = attemptCount >= MAX_ATTEMPTS ? new Date(now.getTime() + WINDOW_MS) : null

  await prisma.loginAttempt.update({
    where: {
      id: loginAttempt.id
    },
    data: {
      attemptCount,
      lastAttemptAt: now,
      blockedUntil
    }
  })
}

/**
 * Get client IP address from event
 */
export function getClientIP(event: H3Event): string {
  const headers = getHeaders(event)

  const forwardedFor = headers['x-forwarded-for']
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIP = headers['x-real-ip']
  if (realIP) {
    return realIP
  }

  const remoteAddress = event.node.req.socket.remoteAddress
  return remoteAddress || 'unknown'
}
