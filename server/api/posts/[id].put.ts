/**
 * @openapi
 * /api/posts/{id}:
 *   put:
 *     summary: Update a post (only by owner)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
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
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - can only edit own posts
 *       404:
 *         description: Post not found
 */
export default defineEventHandler(async (event) => {
  try {
    // User is already authenticated by middleware and available in context
    const user = event.context.user

    const { id } = await validateParams(event, idSchema)
    const postData = await validateBody(event, updatePostSchema)

    // Update post using service (includes ownership check)
    const post = await updatePost(id, postData, user.id)

    return createApiResponse(post, HTTP_STATUS.OK, 'Post updated successfully')
  } catch (error: any) {
    if (error.statusCode) throw error
    throw serverError('Failed to update post')
  }
})
