import prisma from '@@/lib/prisma'

/**
 * Auth Service - Pure business logic for authentication flows
 * Validation is handled in the API endpoints
 */

/**
 * Handle email verification process
 */
export async function verifyUserEmail(token: string): Promise<PublicUser> {
  // Validate and delete the token
  const user = await validateAndDeleteToken(token, TokenType.EMAIL_VERIFICATION)

  // Update user as verified
  const verifiedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerifiedAt: new Date()
    },
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      emailVerifiedAt: true,
      createdAt: true,
      updatedAt: true
    }
  })

  return {
    ...verifiedUser,
    emailVerifiedAt: verifiedUser.emailVerifiedAt?.toISOString() || null,
    createdAt: verifiedUser.createdAt.toISOString(),
    updatedAt: verifiedUser.updatedAt.toISOString()
  }
}

/**
 * Handle verification email resending with rate limiting
 */
export async function resendVerificationEmail(
  email: string,
  event: any,
  locale: string = 'fr'
): Promise<{ message: string; email: string }> {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  })

  if (!user) {
    throw notFoundError('User not found')
  }

  // Check if user is already verified
  if (user.emailVerified) {
    throw badRequestError('Email is already verified')
  }

  // Rate limiting: check if user has requested verification recently
  await checkTokenRateLimit(user.id, TokenType.EMAIL_VERIFICATION)

  // Create new verification token (this will delete any existing ones)
  const { token } = await createToken(user.id, TokenType.EMAIL_VERIFICATION)

  // Send verification email
  await sendVerificationEmail(event, user.email, user.name, token, locale)

  return {
    message: 'Verification email sent successfully',
    email: user.email
  }
}

/**
 * Handle password reset request with rate limiting
 */
export async function requestPasswordReset(
  email: string,
  event: any,
  locale: string = 'fr'
): Promise<{ message: string; email: string }> {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  })

  // Always return success message for security (don't reveal if email exists)
  // But only send email if user actually exists
  if (user) {
    // Rate limiting: check if user has requested password reset recently
    await checkTokenRateLimit(user.id, TokenType.PASSWORD_RESET)

    // Create password reset token (this will delete any existing ones)
    const { token } = await createToken(user.id, TokenType.PASSWORD_RESET)

    // Send password reset email
    await sendPasswordResetEmail(event, user.email, user.name, token, locale)
  }

  // Always return the same message regardless of whether user exists
  return {
    message:
      'If the email address exists in our system, you will receive a password reset link shortly.',
    email: email.toLowerCase()
  }
}

/**
 * Handle password reset with token validation
 */
export async function resetUserPassword(
  token: string,
  newPassword: string
): Promise<{ message: string; email: string }> {
  // Validate and delete the token
  const user = await validateAndDeleteToken(token, TokenType.PASSWORD_RESET)

  // Hash the new password
  const hashedPassword = await hashPassword(newPassword)

  // Update user password
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      updatedAt: new Date()
    }
  })

  // Delete all existing tokens for this user (security measure)
  await deleteUserTokens(user.id)

  // Clear any existing login attempts for this user
  await prisma.loginAttempt.deleteMany({
    where: { email: user.email }
  })

  return {
    message: 'Password reset successfully',
    email: user.email
  }
}
