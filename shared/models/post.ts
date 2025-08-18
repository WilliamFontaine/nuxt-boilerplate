/**
 * Post Model
 *
 * This file contains Post-related types, interfaces and validation schemas
 */

import { z } from 'zod'

// =============================================================================
// DATABASE ENTITY
// =============================================================================

/**
 * Complete Post entity (matches database schema)
 */
export interface Post {
  id: string
  title: string
  content: string | null
  authorId: string
  createdAt: string
  updatedAt: string
}

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
 * Schema for creating a post
 */
export const createPostSchema = z.object({
  title: z
    .string()
    .min(TEXT_FIELD_LIMITS.TITLE.MIN, 'Title too short')
    .max(TEXT_FIELD_LIMITS.TITLE.MAX, 'Title too long')
    .trim(),
  content: z
    .string()
    .min(TEXT_FIELD_LIMITS.CONTENT.MIN, 'Content too short')
    .max(TEXT_FIELD_LIMITS.CONTENT.MAX, 'Content too long')
    .trim()
})

/**
 * Schema for updating a post
 */
export const updatePostSchema = createPostSchema

/**
 * Schema for partial post updates (all fields optional)
 */
export const partialPostSchema = createPostSchema.partial()

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type CreatePostData = z.infer<typeof createPostSchema>
export type UpdatePostData = z.infer<typeof updatePostSchema>
export type PartialPostData = z.infer<typeof partialPostSchema>

// =============================================================================
// INITIAL STATES
// =============================================================================

export const initialPostState: CreatePostData = {
  title: '',
  content: ''
}
