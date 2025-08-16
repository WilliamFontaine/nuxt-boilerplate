import { z } from 'zod'

/**
 * Common validation schemas using Zod
 */

/**
 * Schema for validating UUID IDs
 */
export const idSchema = z.object({
  id: z.uuid()
})

/**
 * Type inference for ID schema
 */
export type IdSchemaData = z.infer<typeof idSchema>
