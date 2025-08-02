/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, confirmPassword, name]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               confirmPassword:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
export default defineEventHandler(async (event) => {
  try {
    const userData = await validateBody(event, registerUserSchema)

    // Transform to CreateUserData (remove confirmPassword)
    const { confirmPassword, ...createUserData } = userData

    // Create user using service
    const user = await createUser(createUserData)

    // Set user session automatically after registration
    await setUserSession(event, {
      user,
      loggedInAt: new Date()
    })

    return createCreatedResponse(user)
  } catch (error: any) {
    if (error.statusCode) throw error
    throw serverError('Registration failed')
  }
})
