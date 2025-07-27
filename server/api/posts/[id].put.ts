import prisma from '@@/lib/prisma'

/**
 * @openapi
 * /api/posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
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
 *       200:
 *         description: Updated
 */
export default defineEventHandler(async (event) => {
  try {
    const { id } = await validateParams(event, idSchema)
    const data = await validateBody(event, updatePostSchema)

    const post = await prisma.post.update({
      where: { id },
      data
    })

    return createApiResponse(post)
  } catch (error: any) {
    if (error.statusCode) throw error
    if (error.code === PRISMA_ERRORS.RECORD_NOT_FOUND) {
      throw notFoundError('Post not found')
    }
    console.error('Post update failed:', error)
    throw serverError('Failed to update post')
  }
})
