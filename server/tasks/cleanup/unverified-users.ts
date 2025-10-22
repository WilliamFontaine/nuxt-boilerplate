import prisma from '@@/lib/prisma'

export default defineTask({
  meta: {
    name: 'cleanup-unverified-users',
    description: 'Remove unverified user accounts older than 24 hours'
  },
  async run() {
    try {
      const now = new Date()
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

      // Find unverified users to delete
      const unverifiedUsers = await prisma.user.findMany({
        where: {
          emailVerified: false,
          createdAt: { lt: twentyFourHoursAgo }
        },
        select: {
          id: true,
          email: true,
          createdAt: true
        }
      })

      if (unverifiedUsers.length === 0) {
        return {
          result: 'Success',
          deletedCount: 0,
          timestamp: now.toISOString()
        }
      }

      // Delete unverified users
      const result = await prisma.user.deleteMany({
        where: {
          id: { in: unverifiedUsers.map((u) => u.id) }
        }
      })

      return {
        result: 'Success',
        deletedCount: result.count,
        deletedUsers: unverifiedUsers.map((u) => ({
          email: u.email,
          createdAt: u.createdAt.toISOString()
        })),
        timestamp: now.toISOString()
      }
    } catch (error) {
      logger.error('Failed to clean up unverified users', { error, expirationHours: 24 })
      return {
        result: 'Failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }
  }
})
