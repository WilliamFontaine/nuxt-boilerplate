import type { ZodType, ZodError } from 'zod'
import type { H3Event, EventHandlerRequest } from 'h3'

// =============================================================================
// PRIVATE HELPERS
// =============================================================================

/**
 * Create a validation error from Zod result
 * @private
 */
function createValidationError(message: string, error: ZodError): never {
  throw validationError(ERROR_CODES.VALIDATION.ERROR, message, undefined, {
    errors: error.issues,
    details: error.issues
  })
}

/**
 * Generic validation function
 * @private
 */
async function validateData<T>(
  data: unknown,
  schema: ZodType<T>,
  errorMessage: string
): Promise<T> {
  const result = schema.safeParse(data)

  if (!result.success) {
    createValidationError(errorMessage, result.error)
  }

  return result.data!
}

// =============================================================================
// PUBLIC VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validate the request body against a Zod schema
 * @param event - The H3 event containing the request
 * @param schema - The Zod schema to validate against
 * @returns The validated data
 * @throws {ApiError} If validation fails
 * @template T - The type of the data in the schema
 */
export async function validateBody<T>(
  event: H3Event<EventHandlerRequest>,
  schema: ZodType<T>
): Promise<T> {
  try {
    const body = await readBody(event)
    return await validateData(body, schema, 'Request body validation failed')
  } catch (error: any) {
    if (error.statusCode) throw error
    throw badRequestError(ERROR_CODES.HTTP.BAD_REQUEST, 'Invalid request body')
  }
}

/**
 * Validate the request parameters against a Zod schema
 * @param event - The H3 event containing the request
 * @param schema - The Zod schema to validate against
 * @returns The validated parameters
 * @throws {ApiError} If validation fails
 * @template T - The type of the data in the schema
 */
export async function validateParams<T>(
  event: H3Event<EventHandlerRequest>,
  schema: ZodType<T>
): Promise<T> {
  try {
    const params = getRouterParams(event)
    return await validateData(params, schema, 'Parameter validation failed')
  } catch (error: any) {
    if (error.statusCode) throw error
    throw badRequestError(ERROR_CODES.HTTP.BAD_REQUEST, 'Invalid request parameters')
  }
}

/**
 * Validate the query parameters against a Zod schema
 * @param event - The H3 event containing the request
 * @param schema - The Zod schema to validate against
 * @returns The validated query parameters
 * @throws {ApiError} If validation fails
 * @template T - The type of the data in the schema
 */
export async function validateQuery<T>(
  event: H3Event<EventHandlerRequest>,
  schema: ZodType<T>
): Promise<T> {
  try {
    const query = getQuery(event)
    return await validateData(query, schema, 'Query validation failed')
  } catch (error: any) {
    if (error.statusCode) throw error
    throw badRequestError(ERROR_CODES.HTTP.BAD_REQUEST, 'Invalid query parameters')
  }
}
