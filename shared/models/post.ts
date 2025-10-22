/**
 * Post Model
 *
 * This file contains Post-related types, interfaces and validation schemas
 */

import { z } from 'zod'

import type { Post } from '@prisma/client'
import type { PublicUser } from '@@/shared/models/user'
import { TEXT_FIELD_LIMITS } from '@@/shared/constants/validation'

// =============================================================================
// DATABASE ENTITY
// =============================================================================
export type { Post } from '@prisma/client'

/**
 * Post entity with author information (for display)
 */
export interface PostWithAuthor extends Post {
  author: PublicUser
}

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

/**
 * Factory function to create post creation schema with i18n messages
 */
export const createPostSchema = (t: (key: string) => string) =>
  z.object({
    title: z
      .string()
      .min(TEXT_FIELD_LIMITS.TITLE.MIN, t('articles.fieldLimits.title.minLength'))
      .max(TEXT_FIELD_LIMITS.TITLE.MAX, t('articles.fieldLimits.title.maxLength'))
      .trim(),
    content: z
      .string()
      .min(TEXT_FIELD_LIMITS.CONTENT.MIN, t('articles.fieldLimits.content.minLength'))
      .max(TEXT_FIELD_LIMITS.CONTENT.MAX, t('articles.fieldLimits.content.maxLength'))
      .trim()
  })

/**
 * Factory function to create post update schema with i18n messages
 */
export const updatePostSchema = (t: (key: string) => string) =>
  z.object({
    title: z
      .string()
      .min(TEXT_FIELD_LIMITS.TITLE.MIN, t('articles.fieldLimits.title.minLength'))
      .max(TEXT_FIELD_LIMITS.TITLE.MAX, t('articles.fieldLimits.title.maxLength'))
      .trim(),
    content: z
      .string()
      .min(TEXT_FIELD_LIMITS.CONTENT.MIN, t('articles.fieldLimits.content.minLength'))
      .max(TEXT_FIELD_LIMITS.CONTENT.MAX, t('articles.fieldLimits.content.maxLength'))
      .trim()
  })

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type CreatePostData = z.infer<ReturnType<typeof createPostSchema>>
export type UpdatePostData = z.infer<ReturnType<typeof updatePostSchema>>

// =============================================================================
// INITIAL STATES
// =============================================================================

export const initialPostState: CreatePostData = {
  title: '',
  content: ''
}

export const initialUpdatePostState: UpdatePostData = {
  title: '',
  content: ''
}
