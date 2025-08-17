/* eslint-disable no-console */
import prisma from '@@/lib/prisma'

export default defineNitroPlugin(async (nitroApp) => {
  console.log('[CLEANUP] Starting login attempts cleanup scheduler')

  // Clean up expired login attempts every hour
  const cleanupInterval = setInterval(
    async () => {
      try {
        const now = new Date()
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

        // Clean up entries that are either old (>24h) OR have expired blocking
        const result = await prisma.loginAttempt.deleteMany({
          where: {
            OR: [
              {
                // Old entries (>24h)
                lastAttemptAt: {
                  lt: twentyFourHoursAgo
                }
              },
              {
                // Expired blocking entries
                blockedUntil: {
                  lt: now
                }
              }
            ]
          }
        })

        if (result.count > 0) {
          console.log(`[CLEANUP] Deleted ${result.count} expired login attempts`)
        }
      } catch (error) {
        console.error('[CLEANUP] Failed to clean up login attempts:', error)
      }
    },
    60 * 60 * 1000
  ) // Every hour

  // Clean up on server shutdown
  nitroApp.hooks.hook('close', () => {
    console.log('[CLEANUP] Stopping cleanup scheduler')
    clearInterval(cleanupInterval)
  })
})
