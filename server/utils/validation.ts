import type { ZodSchema } from 'zod'
import type { H3Event, EventHandlerRequest } from 'h3'

/**
 * Validate the request body against a Zod schema
 * @param event - The H3 event containing the request
 * @param schema - The Zod schema to validate against
 * @returns The validated data
 * @throws {Error} If validation fails, an error with status code 400 is thrown
 * @template T - The type of the data in the schema
 */
export async function validateBody<T>(
  event: H3Event<EventHandlerRequest>,
  schema: ZodSchema<T>
): Promise<T> {
  try {
    const body = await readBody(event)
    const result = schema.safeParse(body)

    if (!result.success) {
      const formattedErrors = result.error.flatten()
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation Failed',
        data: {
          message: 'Validation failed',
          fieldErrors: formattedErrors.fieldErrors,
          formErrors: formattedErrors.formErrors
        }
      })
    }

    return result.data
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request'
    })
  }
}

/**
 * Validate the request parameters against a Zod schema
 * @param event - The H3 event containing the request
 * @param schema - The Zod schema to validate against
 * @returns The validated parameters
 * @throws {Error} If validation fails, an error with status code 400 is thrown
 * @template T - The type of the data in the schema
 */
export async function validateParams<T>(
  event: H3Event<EventHandlerRequest>,
  schema: ZodSchema<T>
): Promise<T> {
  try {
    const params = getRouterParams(event)
    const result = schema.safeParse(params)

    if (!result.success) {
      const formattedErrors = result.error.flatten()
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid Parameters',
        data: {
          message: 'Parameter validation failed',
          fieldErrors: formattedErrors.fieldErrors,
          formErrors: formattedErrors.formErrors
        }
      })
    }

    return result.data
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request'
    })
  }
}

/**
 * Validate the query parameters against a Zod schema
 * @param event - The H3 event containing the request
 * @param schema - The Zod schema to validate against
 * @returns The validated query parameters
 * @throws {Error} If validation fails, an error with status code 400 is thrown
 * @template T - The type of the data in the schema
 */
export async function validateQuery<T>(
  event: H3Event<EventHandlerRequest>,
  schema: ZodSchema<T>
): Promise<T> {
  try {
    const query = getQuery(event)
    const result = schema.safeParse(query)

    if (!result.success) {
      const formattedErrors = result.error.flatten()
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid Query',
        data: {
          message: 'Query validation failed',
          fieldErrors: formattedErrors.fieldErrors,
          formErrors: formattedErrors.formErrors
        }
      })
    }

    return result.data
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request'
    })
  }
}
