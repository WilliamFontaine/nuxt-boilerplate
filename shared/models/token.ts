/**
 * Token Model
 *
 * This file contains Token-related types, interfaces and validation schemas
 */

import { z } from 'zod'
import { TEXT_FIELD_LIMITS } from '@@/shared/constants/validation'

// =============================================================================
// DATABASE ENTITY
// =============================================================================

/**
 * Token entity and enum - re-exported from Prisma
 */
export { TokenType } from '@prisma/client'
export type { Token } from '@prisma/client'

export type { TokenType as TokenTypeEnum } from '@prisma/client'
// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

/**
 * Factory function to create verify email schema with i18n messages
 * Note: Token comes from URL query parameter, not a form field
 */
export const createVerifyEmailSchema = (t: (key: string) => string) =>
  z.object({
    token: z.string().length(64, t('auth.verifyEmail.fields.token.validation.length'))
  })

/**
 * Factory function to create resend verification schema with i18n messages
 */
export const createResendVerificationSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .email(t('auth.resendVerification.fields.email.validation.invalid'))
      .max(
        TEXT_FIELD_LIMITS.EMAIL.MAX,
        t('auth.resendVerification.fields.email.validation.maxLength')
      )
  })

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type VerifyEmailData = z.infer<ReturnType<typeof createVerifyEmailSchema>>
export type ResendVerificationData = z.infer<ReturnType<typeof createResendVerificationSchema>>

// =============================================================================
// INITIAL STATES
// =============================================================================

export const initialVerifyEmailState: VerifyEmailData = {
  token: ''
}

export const initialResendVerificationState: ResendVerificationData = {
  email: ''
}
