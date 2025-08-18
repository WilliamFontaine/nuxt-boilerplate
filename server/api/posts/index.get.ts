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
  const posts = await getAllPosts()
  return createApiResponse(posts, HTTP_STATUS.OK, 'Posts retrieved successfully')
})
