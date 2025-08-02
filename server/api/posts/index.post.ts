/**
 * @openapi
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
export default defineEventHandler(async (event) => {
  try {
    // User is already authenticated by middleware
    const user = event.context.user

    const postData = await validateBody(event, createPostSchema)

    // Create post using service
    const post = await createPost(postData, user.id)

    return createCreatedResponse(post)
  } catch (error: any) {
    if (error.statusCode) throw error
    throw serverError('Failed to create post')
  }
})
