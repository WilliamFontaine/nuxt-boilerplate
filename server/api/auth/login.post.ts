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
 */
export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await validateBody(event, loginUserSchema)

    // Authenticate user using service
    const user = await authenticateUser(email, password)

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
