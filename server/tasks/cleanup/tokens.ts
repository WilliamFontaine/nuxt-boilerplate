import prisma from '@@/lib/prisma'

export default defineTask({
  meta: {
    name: 'cleanup-tokens',
    description: 'Remove expired authentication tokens'
  },
  async run() {
    try {
      const now = new Date()

      const result = await prisma.token.deleteMany({
        where: {
          expiresAt: { lt: now }
        }
      })

      return {
        result: 'Success',
        deletedCount: result.count,
        timestamp: now.toISOString()
      }
    } catch (error) {
      logger.error('Failed to clean up expired tokens', { error })
      return {
        result: 'Failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }
  }
})
