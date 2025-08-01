/**
 * Post Model
 *
 * This file contains all Post-related types, validation schemas, and constants
 * organized in logical sections for maintainability.
 */

import { z } from 'zod'

// =============================================================================
// DATABASE ENTITY
// =============================================================================

/**
 * Complete Post entity (matches database schema)
 */
export interface Post {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

/**
 * Post validation schemas using Zod
 * Uses Zod's default messages (in English)
 * Translations are handled client-side in composables
 */

/**
 * Schema for creating a new post
 */
export const createPostSchema = z.object({
  title: z.string().min(TEXT_FIELD_LIMITS.TITLE.MIN).max(TEXT_FIELD_LIMITS.TITLE.MAX).trim(),
  content: z.string().min(TEXT_FIELD_LIMITS.CONTENT.MIN).max(TEXT_FIELD_LIMITS.CONTENT.MAX).trim()
})

/**
 * Schema for updating an existing post
 */
export const updatePostSchema = createPostSchema

/**
 * Schema for partial post updates (all fields optional)
 */
export const partialPostSchema = createPostSchema.partial()

// =============================================================================
// DERIVED TYPES
// =============================================================================

/**
 * Post data types inferred from validation schemas
 */
export type CreatePostData = z.infer<typeof createPostSchema>
export type UpdatePostData = z.infer<typeof updatePostSchema>
export type PartialPostData = z.infer<typeof partialPostSchema>

/**
 * Post form state (client-side)
 */
export type PostFormState = CreatePostData

// =============================================================================
// CONSTANTS & DEFAULTS
// =============================================================================

/**
 * Initial state for post forms
 */
export const initialPostState: PostFormState = {
  title: '',
  content: ''
}
