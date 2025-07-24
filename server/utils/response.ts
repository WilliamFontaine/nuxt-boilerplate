import type { ApiResponse } from '@@/shared/types/api'

/**
 * Create a standard API response
 * @param data - The data to return in the response
 * @param statusCode - The HTTP status code (default is 200)
 * @returns An ApiResponse object
 * @template T - The type of the data in the response
 */
export function createApiResponse<T> (
  data?: T | null,
  statusCode: number = HTTP_STATUS.OK,
  message?: string
): ApiResponse<T> {
  return {
    statusCode,
    data,
    message
  }
}

/**
 * Create a response for created resources
 * @param data - The data of the created resource
 * @returns An ApiResponse object with status code 201 (Created)
 * @template T - The type of the data in the response
 */
export function createCreatedResponse<T> (data: T): ApiResponse<T> {
  return createApiResponse(data, HTTP_STATUS.CREATED, 'Resource created successfully')
}

/**
 * Create a response for no content
 * @returns An ApiResponse object with status code 204 (No Content)
 * @template T - The type of the data in the response
 */
export function createNoContentResponse (): ApiResponse<null> {
  return createApiResponse(null, HTTP_STATUS.NO_CONTENT, 'No Content')
}

/**
 * Create a response for deleted resources
 * @returns An ApiResponse object with status code 204 (No Content)
 * @template T - The type of the data in the response
 */
export function createDeletedResponse (): ApiResponse<null> {
  return createApiResponse(null, HTTP_STATUS.NO_CONTENT, 'Resource deleted successfully')
}

/**
 * Create a response for no content
 * @returns An ApiResponse object with status code 204 (No Content)
 * @template T - The type of the data in the response
 */
export function notFoundError (message = 'Resource not found') {
  throw createError({
    statusCode: HTTP_STATUS.NOT_FOUND,
    statusMessage: message
  })
}

/**
 * Create a response for bad requests
 * @param message - The error message to return
 * @returns An error with status code 400 (Bad Request)
 */
export function badRequestError (message = 'Bad Request') {
  throw createError({
    statusCode: HTTP_STATUS.BAD_REQUEST,
    statusMessage: message
  })
}

/**
 * Create a server error response
 * @param message - The error message to return
 * @returns An error with status code 500 (Internal Server Error)
 */
export function serverError (message = 'Internal Server Error') {
  throw createError({
    statusCode: HTTP_STATUS.INTERNAL_ERROR,
    statusMessage: message
  })
}

/**
 * Create a validation error response
 * @param message - The error message to return
 * @returns An error with status code 422 (Unprocessable Entity)
 */
export function validationError (message = 'Validation Error') {
  throw createError({
    statusCode: HTTP_STATUS.BAD_REQUEST,
    statusMessage: message
  })
}
