import prisma from '@@/lib/prisma'
import { TokenType } from '~~/shared/types/token'

/**
 * Mapping of token types to their user-friendly action names
 */
const TOKEN_ACTION_NAMES: Record<TokenType, string> = {
  [TokenType.EMAIL_VERIFICATION]: 'verification email',
  [TokenType.PASSWORD_RESET]: 'password reset'
}

/**
 * Get user-friendly action name for a token type
 * @param tokenType - The token type
 * @returns The user-friendly action name
 */
export function getTokenActionName(tokenType: TokenType): string {
  return TOKEN_ACTION_NAMES[tokenType] ?? 'request'
}

/**
 * Check if user has hit rate limit for a specific token type
 * @param userId - User ID to check
 * @param tokenType - Type of token (EMAIL_VERIFICATION, PASSWORD_RESET)
 * @param cooldownMinutes - Cooldown period in minutes (default: 5)
 * @throws TooManyRequests error if rate limited with exact countdown
 */
export async function checkTokenRateLimit(
  userId: string,
  tokenType: TokenType,
  cooldownMinutes: number = 5
): Promise<void> {
  const existingToken = await prisma.token.findFirst({
    where: {
      userId,
      type: tokenType
    },
    orderBy: { createdAt: 'desc' }
  })

  if (existingToken) {
    const cooldownMs = cooldownMinutes * 60 * 1000
    const cooldownThreshold = new Date(Date.now() - cooldownMs)

    if (existingToken.createdAt > cooldownThreshold) {
      // Calculate exact remaining time
      const remainingMs = Math.max(0, existingToken.createdAt.getTime() + cooldownMs - Date.now())
      const totalSeconds = Math.ceil(remainingMs / 1000)
      const remainingMinutes = Math.floor(totalSeconds / 60)
      const remainingSeconds = totalSeconds % 60

      // Ensure at least 1 second is shown
      const displayMinutes = remainingMinutes
      const displaySeconds = Math.max(1, remainingSeconds)

      const actionName = getTokenActionName(tokenType)

      throw createError({
        statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
        statusMessage: 'Too many requests',
        data: {
          message: `Please wait ${displayMinutes}min ${displaySeconds}s before requesting another ${actionName}.`,
          retryAfter: Math.max(1, totalSeconds), // at least 1 second
          remainingMinutes: displayMinutes,
          remainingSeconds: displaySeconds,
          remainingMs
        }
      })
    }
  }
}
