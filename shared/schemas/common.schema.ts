import { z } from 'zod'

/**
 * Common validation schemas using Zod
 */

/**
 * Schema for validating numeric IDs (positive integers)
 */
export const idSchema = z.object({
  id: z.coerce.number().int().positive()
})

/**
 * Type inference for ID schema
 */
export type IdSchemaData = z.infer<typeof idSchema>
