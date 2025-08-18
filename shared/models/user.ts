/**
 * User Model
 *
 * This file contains User-related types, interfaces and validation schemas
 */

import { z } from 'zod'

// =============================================================================
// DATABASE ENTITY
// =============================================================================

/**
 * Public User entity (without sensitive fields)
 */
export interface PublicUser {
  id: string
  email: string
  name: string
  emailVerified: boolean
  emailVerifiedAt: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Complete User entity (matches database schema)
 */
export interface User extends PublicUser {
  password: string // Sensitive field, not included in PublicUser
}

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

/**
 * Login validation schema
 */
export const loginSchema = z.object({
  email: z.email('Invalid email format').max(TEXT_FIELD_LIMITS.EMAIL.MAX),
  password: z.string().min(1, 'Password is required')
})

/**
 * Registration validation schema
 */
export const registerSchema = z
  .object({
    email: z.email('Invalid email format').max(TEXT_FIELD_LIMITS.EMAIL.MAX),
    password: z
      .string()
      .min(TEXT_FIELD_LIMITS.PASSWORD.MIN)
      .max(TEXT_FIELD_LIMITS.PASSWORD.MAX)
      .regex(VALIDATION_PATTERNS.PASSWORD, 'Password must contain lowercase, uppercase and number'),
    confirmPassword: z.string(),
    name: z.string().min(TEXT_FIELD_LIMITS.NAME.MIN).max(TEXT_FIELD_LIMITS.NAME.MAX).trim()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

/**
 * Create user schema (server-side, no confirmPassword)
 */
export const createUserSchema = registerSchema.omit({ confirmPassword: true })

/**
 * Forgot password schema
 */
export const forgotPasswordSchema = z.object({
  email: z.email('Invalid email format')
})

/**
 * Reset password schema
 */
export const resetPasswordSchema = z
  .object({
    token: z.string().length(64),
    password: z
      .string()
      .min(TEXT_FIELD_LIMITS.PASSWORD.MIN)
      .max(TEXT_FIELD_LIMITS.PASSWORD.MAX)
      .regex(VALIDATION_PATTERNS.PASSWORD),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type LoginData = z.infer<typeof loginSchema>
export type RegisterData = z.infer<typeof registerSchema>
export type CreateUserData = z.infer<typeof createUserSchema>
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>

// =============================================================================
// INITIAL STATES
// =============================================================================

export const initialLoginState: LoginData = {
  email: '',
  password: ''
}

export const initialRegisterState: RegisterData = {
  email: '',
  password: '',
  confirmPassword: '',
  name: ''
}

export const initialForgotPasswordState: ForgotPasswordData = {
  email: ''
}

export const initialResetPasswordState: ResetPasswordData = {
  token: '',
  password: '',
  confirmPassword: ''
}

/**
 * Helper function to convert Prisma User to PublicUser
 */
export function toPublicUser(user: {
  id: string
  email: string
  password: string
  name: string
  emailVerified: boolean
  emailVerifiedAt: Date | null
  createdAt: Date
  updatedAt: Date
}): PublicUser {
  const { password, ...rest } = user
  return {
    ...rest,
    emailVerifiedAt: rest.emailVerifiedAt?.toISOString() || null,
    createdAt: rest.createdAt.toISOString(),
    updatedAt: rest.updatedAt.toISOString()
  }
}
