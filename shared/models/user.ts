/**
 * User Model
 *
 * This file contains all User-related types, validation schemas, and constants
 * organized in logical sections for maintainability.
 */

import { z } from 'zod'

// =============================================================================
// DATABASE ENTITY
// =============================================================================

/**
 * Complete User entity (matches database schema)
 */
export interface User {
  id: number
  email: string
  password: string
  name: string
  createdAt: string
  updatedAt: string
}

/**
 * Public User entity (without sensitive fields)
 */
export interface PublicUser {
  id: number
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

/**
 * User validation schemas using Zod
 * Uses Zod's default messages (in English)
 * Translations are handled client-side in composables
 */

/**
 * Schema for user registration
 */
export const registerUserSchema = z
  .object({
    email: z
      .string()
      .regex(VALIDATION_PATTERNS.EMAIL, 'Invalid email format')
      .max(TEXT_FIELD_LIMITS.EMAIL.MAX)
      .trim()
      .toLowerCase(),
    password: z
      .string()
      .min(TEXT_FIELD_LIMITS.PASSWORD.MIN)
      .max(TEXT_FIELD_LIMITS.PASSWORD.MAX)
      .regex(
        VALIDATION_PATTERNS.PASSWORD,
        'Password must contain at least one lowercase letter, one uppercase letter, and one number'
      ),
    confirmPassword: z.string(),
    name: z.string().min(TEXT_FIELD_LIMITS.NAME.MIN).max(TEXT_FIELD_LIMITS.NAME.MAX).trim()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

/**
 * Schema for server-side user registration (without confirmPassword)
 */
export const createUserSchema = z.object({
  email: z
    .string()
    .regex(VALIDATION_PATTERNS.EMAIL, 'Invalid email format')
    .max(TEXT_FIELD_LIMITS.EMAIL.MAX)
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(TEXT_FIELD_LIMITS.PASSWORD.MIN)
    .max(TEXT_FIELD_LIMITS.PASSWORD.MAX)
    .regex(
      VALIDATION_PATTERNS.PASSWORD,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  name: z.string().min(TEXT_FIELD_LIMITS.NAME.MIN).max(TEXT_FIELD_LIMITS.NAME.MAX).trim()
})

/**
 * Schema for user login
 */
export const loginUserSchema = z.object({
  email: z
    .string()
    .regex(VALIDATION_PATTERNS.EMAIL, 'Invalid email format')
    .max(TEXT_FIELD_LIMITS.EMAIL.MAX)
    .trim()
    .toLowerCase(),
  password: z.string().min(1, 'Password is required')
})

/**
 * Schema for updating user profile
 */
export const updateUserSchema = z.object({
  email: z
    .string()
    .regex(VALIDATION_PATTERNS.EMAIL, 'Invalid email format')
    .max(TEXT_FIELD_LIMITS.EMAIL.MAX)
    .trim()
    .toLowerCase()
    .optional(),
  name: z.string().min(TEXT_FIELD_LIMITS.NAME.MIN).max(TEXT_FIELD_LIMITS.NAME.MAX).trim().optional()
})

/**
 * Schema for password change
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(TEXT_FIELD_LIMITS.PASSWORD.MIN)
      .max(TEXT_FIELD_LIMITS.PASSWORD.MAX)
      .regex(
        VALIDATION_PATTERNS.PASSWORD,
        'Password must contain at least one lowercase letter, one uppercase letter, and one number'
      ),
    confirmNewPassword: z.string()
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword']
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Password confirmation does not match',
    path: ['confirmNewPassword']
  })

// =============================================================================
// DERIVED TYPES
// =============================================================================

/**
 * User data types inferred from validation schemas
 */
export type RegisterUserData = z.infer<typeof registerUserSchema>
export type CreateUserData = z.infer<typeof createUserSchema>
export type LoginUserData = z.infer<typeof loginUserSchema>
export type UpdateUserData = z.infer<typeof updateUserSchema>
export type ChangePasswordData = z.infer<typeof changePasswordSchema>

/**
 * User form states (client-side)
 */
export type RegisterFormState = RegisterUserData
export type LoginFormState = LoginUserData
export type ProfileFormState = UpdateUserData
export type PasswordFormState = ChangePasswordData

// =============================================================================
// CONSTANTS & DEFAULTS
// =============================================================================

/**
 * Initial state for user forms
 */
export const initialRegisterState: RegisterFormState = {
  email: '',
  password: '',
  confirmPassword: '',
  name: ''
}

export const initialLoginState: LoginFormState = {
  email: '',
  password: ''
}

export const initialProfileState: ProfileFormState = {
  email: '',
  name: ''
}

export const initialPasswordState: PasswordFormState = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
}

/**
 * Helper function to convert User to PublicUser
 */
export function toPublicUser(user: User): PublicUser {
  const { password, ...publicUser } = user
  return publicUser
}
