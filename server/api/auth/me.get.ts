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
  // User is already authenticated by middleware and available in context
  const user = event.context.user

  return createApiResponse(user, HTTP_STATUS.OK, 'User session retrieved')
})
