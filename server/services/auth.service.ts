import type { H3Event, EventHandlerRequest } from 'h3'
import prisma from '@@/lib/prisma'

/**
 * Auth Service - Pure business logic for authentication flows
 * Validation is handled in the API endpoints
 */

/**
 * Handle email verification process
 */
export async function verifyUserEmail(token: string): Promise<PublicUser> {
  try {
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
  } catch (error: unknown) {
    // Re-throw business errors (with statusCode)
    if (error && typeof error === 'object' && 'statusCode' in error) throw error

    // Transform system errors to 500
    throw serverError(ERROR_CODES.SERVER.DATABASE_ERROR, 'Failed to verify email')
  }
}

/**
 * Handle verification email resending with rate limiting
 */
export async function resendVerificationEmail(
  email: string,
  event: H3Event<EventHandlerRequest>,
  locale: string = 'fr'
): Promise<{ message: string; email: string }> {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      throw notFoundError(ERROR_CODES.USER.NOT_FOUND, 'User not found')
    }

    // Check if user is already verified
    if (user.emailVerified) {
      throw badRequestError(ERROR_CODES.USER.INVALID_DATA, 'Email is already verified')
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
  } catch (error: any) {
    // Re-throw business errors (with statusCode)
    if (error.statusCode) throw error

    // Transform system errors to 500
    throw serverError(ERROR_CODES.SERVER.DATABASE_ERROR, 'Failed to resend verification email')
  }
}

/**
 * Handle password reset request with rate limiting
 */
export async function requestPasswordReset(
  email: string,
  event: H3Event<EventHandlerRequest>,
  locale: string = 'fr'
): Promise<{ message: string; email: string }> {
  try {
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
  } catch (error: any) {
    // Re-throw business errors (with statusCode)
    if (error.statusCode) throw error

    // Transform system errors to 500
    throw serverError(ERROR_CODES.SERVER.DATABASE_ERROR, 'Failed to process password reset request')
  }
}

/**
 * Handle password reset with token validation
 */
export async function resetUserPassword(
  token: string,
  newPassword: string
): Promise<{ message: string; email: string }> {
  try {
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
  } catch (error: any) {
    // Re-throw business errors (with statusCode)
    if (error.statusCode) throw error

    // Transform system errors to 500
    throw serverError(ERROR_CODES.SERVER.DATABASE_ERROR, 'Failed to reset password')
  }
}

/**
 * Handle complete login process with rate limiting, authentication, and session management
 */
export async function loginUser(
  email: string,
  password: string,
  ipAddress: string,
  event: H3Event<EventHandlerRequest>
): Promise<{ user: PublicUser; message: string }> {
  try {
    // Get rate limit info BEFORE attempting authentication
    const currentRateLimitInfo = await checkLoginAttempt(email, ipAddress)

    // Authenticate user
    let user: PublicUser
    try {
      user = await authenticateUser(email, password)
    } catch (error: any) {
      // Record failed attempt
      await recordLoginAttempt(email, ipAddress, false)

      // Add remaining attempts info if available
      if (currentRateLimitInfo.remainingAttempts !== undefined) {
        const remainingAfterThisAttempt = Math.max(0, currentRateLimitInfo.remainingAttempts - 1)
        error.data = {
          ...error.data,
          remainingAttempts: remainingAfterThisAttempt
        }
      }
      throw error
    }

    // Check if email is verified
    if (!user.emailVerified) {
      await recordLoginAttempt(email, ipAddress, false)
      throw forbiddenError(ERROR_CODES.AUTH.EMAIL_NOT_VERIFIED, 'Email not verified', {
        email: user.email
      })
    }

    // Record successful login
    await recordLoginAttempt(email, ipAddress, true)

    // Set user session
    await setUserSession(event, {
      user,
      loggedInAt: new Date()
    })

    return {
      user,
      message: 'Login successful'
    }
  } catch (error: any) {
    // Re-throw business errors (with statusCode)
    if (error.statusCode) throw error

    // Transform system errors to 500
    throw serverError(ERROR_CODES.SERVER.DATABASE_ERROR, 'Failed to process login')
  }
}
