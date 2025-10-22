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
 *           type: string
 *           format: uuid
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
  const session = await requireUserSession(event)
  const postId = getRouterParam(event, 'id')

  if (!postId) {
    throw badRequestError(ERROR_CODES.VALIDATION.MISSING_FIELD, 'Post ID is required')
  }

  const t = await useTranslation(event)
  const updateData = await validateBody(event, updatePostSchema(t))

  const updatedPost = await updatePost(postId, updateData, session.user.id)

  return createApiResponse(updatedPost, HTTP_STATUS.OK, 'Post updated successfully')
})
