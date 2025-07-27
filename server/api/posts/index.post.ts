import prisma from '@@/lib/prisma'

/**
 * @openapi
 * /api/posts:
 *   post:
 *     summary: Create a post
 *     tags: [Posts]
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
 *         description: Created
 */
export default defineEventHandler(async (event) => {
  try {
    const data = await validateBody(event, createPostSchema)

    const post = await prisma.post.create({
      data
    })

    return createCreatedResponse(post)
  } catch (error: any) {
    if (error.statusCode) throw error
    throw serverError('Failed to create post')
  }
})
