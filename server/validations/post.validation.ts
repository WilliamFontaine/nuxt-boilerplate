import * as yup from 'yup'

/**
 * Validation schemas for posts
 */
export const createPostSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(
      TEXT_FIELD_LIMITS.TITLE.MIN,
      `Title must be at least ${TEXT_FIELD_LIMITS.TITLE.MIN} characters`
    )
    .max(
      TEXT_FIELD_LIMITS.TITLE.MAX,
      `Title must be at most ${TEXT_FIELD_LIMITS.TITLE.MAX} characters`
    )
    .trim(),
  content: yup
    .string()
    .required('Content is required')
    .min(
      TEXT_FIELD_LIMITS.CONTENT.MIN,
      `Content must be at least ${TEXT_FIELD_LIMITS.CONTENT.MIN} characters`
    )
    .max(
      TEXT_FIELD_LIMITS.CONTENT.MAX,
      `Content must be at most ${TEXT_FIELD_LIMITS.CONTENT.MAX} characters`
    )
    .trim()
})

export const updatePostSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(
      TEXT_FIELD_LIMITS.TITLE.MIN,
      `Title must be at least ${TEXT_FIELD_LIMITS.TITLE.MIN} characters`
    )
    .max(
      TEXT_FIELD_LIMITS.TITLE.MAX,
      `Title must be at most ${TEXT_FIELD_LIMITS.TITLE.MAX} characters`
    )
    .trim(),
  content: yup
    .string()
    .required('Content is required')
    .min(
      TEXT_FIELD_LIMITS.CONTENT.MIN,
      `Content must be at least ${TEXT_FIELD_LIMITS.CONTENT.MIN} characters`
    )
    .max(
      TEXT_FIELD_LIMITS.CONTENT.MAX,
      `Content must be at most ${TEXT_FIELD_LIMITS.CONTENT.MAX} characters`
    )
    .trim()
})

/**
 * TypeScript types for post data based on validation schemas
 */
export type CreatePostData = yup.InferType<typeof createPostSchema>
export type UpdatePostData = yup.InferType<typeof updatePostSchema>
