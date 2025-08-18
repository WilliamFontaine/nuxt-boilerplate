/**
 * @openapi
 * /api/auth/verify-email:
 *   post:
 *     summary: Verify user email address
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token:
 *                 type: string
 *                 description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
export default defineEventHandler(async (event) => {
  const { token } = await validateBody(event, verifyEmailSchema)

  // Use auth service for business logic
  const verifiedUser = await verifyUserEmail(token)

  // Always login the user after successful verification
  await setUserSession(event, {
    user: verifiedUser,
    loggedInAt: new Date()
  })

  return createApiResponse(
    {
      message: 'Email verified successfully',
      user: verifiedUser,
      loggedIn: true
    },
    HTTP_STATUS.OK
  )
})
