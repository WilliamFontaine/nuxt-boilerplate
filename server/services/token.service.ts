import crypto from 'crypto'
import prisma from '@@/lib/prisma'

/**
 * Token Service - Manages email verification and password reset tokens
 */

/**
 * Generate a secure random token
 */
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Create a new token for a user
 */
export async function createToken(
  userId: string,
  type: TokenType
): Promise<{ token: string; expiresAt: Date }> {
  try {
    // Delete any existing tokens of the same type for this user
    await prisma.token.deleteMany({
      where: { userId, type }
    })

    // Set expiration time based on token type
    const expiresAt = new Date()
    if (type === 'EMAIL_VERIFICATION') {
      expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours for email verification
    } else {
      expiresAt.setHours(expiresAt.getHours() + 1) // 1 hour for password reset
    }

    const token = generateToken()

    // Create new token
    await prisma.token.create({
      data: {
        userId,
        type,
        token,
        expiresAt
      }
    })

    return { token, expiresAt }
  } catch {
    throw serverError(ERROR_CODES.SERVER.DATABASE_ERROR, 'Failed to create token')
  }
}

/**
 * Validate a token and return the associated user
 * Optionally delete the token after validation
 */
export async function validateToken(
  token: string,
  type: TokenType,
  deleteAfterValidation = false
): Promise<User> {
  try {
    // Find the token with user data
    const tokenRecord = await prisma.token.findUnique({
      where: { token },
      include: { user: true }
    })

    // Validate token exists
    if (!tokenRecord) {
      throw badRequestError(ERROR_CODES.AUTH.INVALID_TOKEN, 'Invalid or expired token')
    }

    // Validate token type
    if (tokenRecord.type !== type) {
      throw badRequestError(ERROR_CODES.AUTH.INVALID_TOKEN, 'Invalid token type')
    }

    // Validate token hasn't expired
    if (tokenRecord.expiresAt < new Date()) {
      // Delete expired token
      await prisma.token.delete({
        where: { id: tokenRecord.id }
      })
      throw badRequestError(ERROR_CODES.AUTH.TOKEN_EXPIRED, 'Token has expired')
    }

    // Delete token if requested
    if (deleteAfterValidation) {
      await prisma.token.delete({
        where: { id: tokenRecord.id }
      })
    }

    // Convert Prisma User to User interface (Date to string)
    const { password, ...rest } = tokenRecord.user
    return {
      ...rest,
      password: tokenRecord.user.password,
      emailVerifiedAt: rest.emailVerifiedAt?.toISOString() || null,
      createdAt: rest.createdAt.toISOString(),
      updatedAt: rest.updatedAt.toISOString()
    }
  } catch (error: any) {
    // Re-throw business errors (with statusCode)
    if (error.statusCode) throw error

    // Transform system errors to 500
    throw serverError(ERROR_CODES.SERVER.DATABASE_ERROR, 'Failed to validate token')
  }
}

/**
 * Validate a token and return the associated user
 * The token is deleted immediately after validation
 */
export async function validateAndDeleteToken(token: string, type: TokenType): Promise<User> {
  return validateToken(token, type, true)
}

/**
 * Delete all tokens for a user
 */
export async function deleteUserTokens(userId: string): Promise<void> {
  try {
    await prisma.token.deleteMany({
      where: { userId }
    })
  } catch {
    throw serverError(ERROR_CODES.SERVER.DATABASE_ERROR, 'Failed to delete tokens')
  }
}

/**
 * Check if a user has a valid token of a specific type
 */
export async function hasValidToken(userId: string, type: TokenType): Promise<boolean> {
  try {
    const token = await prisma.token.findFirst({
      where: {
        userId,
        type,
        expiresAt: { gt: new Date() }
      }
    })

    return !!token
  } catch {
    throw serverError(ERROR_CODES.SERVER.DATABASE_ERROR, 'Failed to check token validity')
  }
}
