/**
 * Token Model - Simplified
 * Contains only essential validation schemas and types
 */

import { z } from 'zod'

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

/**
 * Schema for email verification
 */
export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required')
})

/**
 * Schema for password reset request
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .regex(VALIDATION_PATTERNS.EMAIL, 'Invalid email format')
    .max(TEXT_FIELD_LIMITS.EMAIL.MAX)
    .trim()
    .toLowerCase()
})

/**
 * Schema for password reset
 */
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token is required'),
    password: z
      .string()
      .min(TEXT_FIELD_LIMITS.PASSWORD.MIN)
      .max(TEXT_FIELD_LIMITS.PASSWORD.MAX)
      .regex(
        VALIDATION_PATTERNS.PASSWORD,
        'Password must contain at least one lowercase letter, one uppercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Password confirmation is required')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

/**
 * Schema for resending verification email
 */
export const resendVerificationSchema = z.object({
  email: z
    .string()
    .regex(VALIDATION_PATTERNS.EMAIL, 'Invalid email format')
    .max(TEXT_FIELD_LIMITS.EMAIL.MAX)
    .trim()
    .toLowerCase()
})

// =============================================================================
// FORM TYPES & INITIAL STATES
// =============================================================================

export type VerifyEmailFormState = z.infer<typeof verifyEmailSchema>
export type ForgotPasswordFormState = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormState = z.infer<typeof resetPasswordSchema>

export const initialVerifyEmailState: VerifyEmailFormState = {
  token: ''
}

export const initialForgotPasswordState: ForgotPasswordFormState = {
  email: ''
}

export const initialResetPasswordState: ResetPasswordFormState = {
  token: '',
  password: '',
  confirmPassword: ''
}
