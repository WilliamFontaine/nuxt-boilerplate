import prisma from '@@/lib/prisma'

/**
 * @openapi
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 */
export default defineEventHandler(async (event) => {
  try {
    const { id } = await validateParams(event, idSchema)

    await prisma.post.delete({
      where: { id }
    })

    return createDeletedResponse()
  } catch (error: any) {
    if (error.statusCode) throw error
    if (error.code === PRISMA_ERRORS.RECORD_NOT_FOUND) {
      throw notFoundError('Post not found')
    }
    throw serverError('Failed to delete post')
  }
})
