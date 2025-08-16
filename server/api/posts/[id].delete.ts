/**
 * @openapi
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post (only by owner)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - can only delete own posts
 *       404:
 *         description: Post not found
 */
export default defineEventHandler(async (event) => {
  try {
    // User is already authenticated by middleware and available in context
    const user = event.context.user

    const { id } = await validateParams(event, idSchema)

    // Delete post using service (includes ownership check)
    await deletePost(id, user.id)

    return createDeletedResponse()
  } catch (error: any) {
    if (error.statusCode) throw error
    throw serverError('Failed to delete post')
  }
})
