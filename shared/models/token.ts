/**
 * Token Model
 *
 * This file contains Token-related types, interfaces and validation schemas
 */

import { z } from 'zod'

// =============================================================================
// DATABASE ENTITY
// =============================================================================

/**
 * Token entity (matches database schema)
 */
export interface Token {
  id: string
  userId: string
  type: TokenType
  token: string
  expiresAt: string
  createdAt: string
}

/**
 * Token types enumeration
 */
export enum TokenType {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET'
}

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

/**
 * Schema for email verification
 */
export const verifyEmailSchema = z.object({
  token: z.string().length(64, 'Invalid token')
})

/**
 * Schema for resending verification email
 */
export const resendVerificationSchema = z.object({
  email: z.string().email('Invalid email format').max(TEXT_FIELD_LIMITS.EMAIL.MAX, 'Email too long')
})

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type VerifyEmailData = z.infer<typeof verifyEmailSchema>
export type ResendVerificationData = z.infer<typeof resendVerificationSchema>

// =============================================================================
// INITIAL STATES
// =============================================================================

export const initialVerifyEmailState: VerifyEmailData = {
  token: ''
}

export const initialResendVerificationState: ResendVerificationData = {
  email: ''
}
