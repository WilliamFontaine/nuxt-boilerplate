/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 */
export default defineEventHandler(async (event) => {
  try {
    // Clear user session
    await clearUserSession(event)

    return createApiResponse(null, HTTP_STATUS.OK, 'Logout successful')
  } catch {
    throw serverError('Logout failed')
  }
})
