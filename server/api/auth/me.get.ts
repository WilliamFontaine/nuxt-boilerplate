/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get current user session
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User session retrieved successfully
 *       401:
 *         description: Not authenticated
 */
export default defineEventHandler(async (event) => {
  // Get user session
  const session = await getUserSession(event)

  if (!session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated'
    })
  }

  return createApiResponse(session.user, HTTP_STATUS.OK, 'User session retrieved')
})
