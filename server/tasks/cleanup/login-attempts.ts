import prisma from '@@/lib/prisma'

export default defineTask({
  meta: {
    name: 'cleanup-login-attempts',
    description: 'Remove old login attempt records and expired blocks'
  },
  async run() {
    try {
      const now = new Date()
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

      const result = await prisma.loginAttempt.deleteMany({
        where: {
          OR: [
            {
              // Remove old entries (older than 24 hours)
              lastAttemptAt: {
                lt: twentyFourHoursAgo
              }
            },
            {
              // Remove expired blocking entries
              blockedUntil: {
                lt: now
              }
            }
          ]
        }
      })

      return {
        result: 'Success',
        deletedCount: result.count,
        timestamp: now.toISOString()
      }
    } catch (error) {
      logger.error('Failed to clean up login attempts', { error })
      return {
        result: 'Failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }
  }
})
