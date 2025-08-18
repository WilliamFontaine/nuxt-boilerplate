/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 *       429:
 *         description: Too many attempts
 */
export default defineEventHandler(async (event) => {
  const { email, password } = await validateBody(event, loginSchema)
  const ipAddress = getClientIP(event)

  // Use auth service for complete login business logic
  const result = await loginUser(email, password, ipAddress, event)

  return createApiResponse(result.user, HTTP_STATUS.OK, result.message)
})
