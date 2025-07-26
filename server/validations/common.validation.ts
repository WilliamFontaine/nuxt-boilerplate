import * as yup from 'yup'

/**
 * Common validation schemas
 */
export const idSchema = yup.object({
  id: yup
    .number()
    .required('Post ID is required')
    .positive('Post ID must be a positive number')
    .integer('Post ID must be an integer')
    .typeError('Post ID must be a number')
})

export type idSchemaData = yup.InferType<typeof idSchema>
