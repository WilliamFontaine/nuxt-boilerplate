/**
 * @openapi
 * /api/auth/resend-verification:
 *   post:
 *     summary: Resend email verification
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
 *         description: Verification email sent successfully
 *       400:
 *         description: Invalid email or user already verified
 *       404:
 *         description: User not found
 *       429:
 *         description: Too many requests
 */
export default defineEventHandler(async (event) => {
  const { email } = await validateBody(event, resendVerificationSchema)
  const locale = getCookie(event, 'i18n_redirected') || 'fr'

  // Use auth service for business logic
  const result = await resendVerificationEmail(email, event, locale)

  return createApiResponse(result, HTTP_STATUS.OK)
})
