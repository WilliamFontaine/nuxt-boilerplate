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
  const userData = await validateBody(event, registerSchema)

  // Transform to CreateUserData (remove confirmPassword)
  const { confirmPassword, ...createUserData } = userData

  // Create user using service (user will have emailVerified: false by default)
  const user = await createUser(createUserData)

  // Create email verification token
  const { token } = await createToken(user.id, TokenType.EMAIL_VERIFICATION)

  // Send verification email
  const locale = getCookie(event, 'i18n_redirected') || 'fr'
  await sendVerificationEmail(event, user.email, user.name, token, locale)

  // Return success without auto-login
  return createCreatedResponse({
    message: 'Account created successfully. Please check your email to verify your account.',
    email: user.email
  })
})
