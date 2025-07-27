import type { Schema } from 'yup'
import { ValidationError } from 'yup'
import type { H3Event, EventHandlerRequest } from 'h3'

/**
 * Validate the request body against a Yup schema
 * @param event - The H3 event containing the request
 * @param schema - The Yup schema to validate against
 * @returns The validated data
 * @throws {Error} If validation fails, an error with status code 400 is thrown
 * @template T - The type of the data in the schema
 */
export async function validateBody<T>(
  event: H3Event<EventHandlerRequest>,
  schema: Schema<T>
): Promise<T> {
  try {
    const body = await readBody(event)
    return await schema.validate(body, { stripUnknown: true })
  } catch (error) {
    if (error instanceof ValidationError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation Failed',
        data: { message: error.message }
      })
    }
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request'
    })
  }
}

/**
 * Validate the request parameters against a Yup schema
 * @param event - The H3 event containing the request
 * @param schema - The Yup schema to validate against
 * @returns The validated parameters
 * @throws {Error} If validation fails, an error with status code 400 is thrown
 * @template T - The type of the data in the schema
 */
export async function validateParams<T>(
  event: H3Event<EventHandlerRequest>,
  schema: Schema<T>
): Promise<T> {
  try {
    const params = getRouterParams(event)
    return await schema.validate(params)
  } catch (error) {
    if (error instanceof ValidationError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid Parameters',
        data: { message: error.message }
      })
    }
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request'
    })
  }
}

/**
 * Validate the query parameters against a Yup schema
 * @param event - The H3 event containing the request
 * @param schema - The Yup schema to validate against
 * @returns The validated query parameters
 * @throws {Error} If validation fails, an error with status code 400 is thrown
 * @template T - The type of the data in the schema
 */
export async function validateQuery<T>(
  event: H3Event<EventHandlerRequest>,
  schema: Schema<T>
): Promise<T> {
  try {
    const query = getQuery(event)
    return await schema.validate(query, { stripUnknown: true })
  } catch (error) {
    if (error instanceof ValidationError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid Query',
        data: { message: error.message }
      })
    }
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request'
    })
  }
}
