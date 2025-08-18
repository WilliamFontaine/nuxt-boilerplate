/**
 * Authentication-related types and enums
 */

/**
 * Token types for authentication system
 * Must match the TokenType enum in Prisma schema
 */
export enum TokenType {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET'
}
