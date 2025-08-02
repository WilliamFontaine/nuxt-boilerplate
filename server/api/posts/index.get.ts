/**
 * @openapi
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 */
export default defineEventHandler(async () => {
  try {
    const posts = await getAllPosts()

    return createApiResponse(posts, HTTP_STATUS.OK, 'Posts retrieved successfully')
  } catch (error: any) {
    if (error.statusCode) throw error
    throw serverError('Failed to fetch posts')
  }
})
