import prisma from '@@/lib/prisma'

/**
 * @openapi
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Success
 */
export default defineEventHandler(async () => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return createApiResponse(posts)
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Failed to fetch posts:', error)
    throw serverError('Failed to fetch posts')
  }
})
