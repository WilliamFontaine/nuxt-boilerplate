/**
 * @openapi
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent (if user exists)
 *       400:
 *         description: Invalid email format
 *       429:
 *         description: Too many requests
 */
export default defineEventHandler(async (event) => {
  const { email } = await validateBody(event, forgotPasswordSchema)
  const locale = getCookie(event, 'i18n_redirected') || 'fr'

  // Use auth service for business logic
  const result = await requestPasswordReset(email, event, locale)

  return createApiResponse(result, HTTP_STATUS.OK)
})
