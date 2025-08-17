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
  try {
    const { email, password } = await validateBody(event, loginUserSchema)
    const ipAddress = getClientIP(event)

    // Authenticate user using service
    const user = await authenticateUser(email, password).catch(async (error) => {
      // Get rate limit info BEFORE recording the attempt
      const currentRateLimitInfo = await checkLoginAttempt(email, ipAddress)

      await recordLoginAttempt(email, ipAddress, false)

      // If there were remaining attempts before this failure, calculate what's left
      if (currentRateLimitInfo.remainingAttempts !== undefined) {
        const remainingAfterThisAttempt = Math.max(0, currentRateLimitInfo.remainingAttempts - 1)
        error.data = {
          ...error.data,
          remainingAttempts: remainingAfterThisAttempt
        }
      }

      throw error
    })

    // Record successful login
    await recordLoginAttempt(email, ipAddress, true)

    // Set user session
    await setUserSession(event, {
      user,
      loggedInAt: new Date()
    })

    return createApiResponse(user, HTTP_STATUS.OK, 'Login successful')
  } catch (error: any) {
    if (error.statusCode) throw error
    throw serverError('Login failed')
  }
})
