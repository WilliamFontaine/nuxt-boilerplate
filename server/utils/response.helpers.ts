// =============================================================================
// CORE API RESPONSE FUNCTIONS
// =============================================================================

/**
 * Create a standard API response
 * @param data - The data to return in the response
 * @param statusCode - The HTTP status code (default is 200)
 * @param message - Optional response message
 * @returns An ApiResponse object
 * @template T - The type of the data in the response
 */
export function createApiResponse<T>(
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
 * Create a typed API error with proper structure
 * @param statusCode - HTTP status code
 * @param code - Error code from ERROR_CODES
 * @param message - Override message (optional, defaults to error code message)
 * @param data - Additional error data
 * @throws {H3Error} Throws a properly structured error
 */
export function createApiError(
  statusCode: number,
  code: ErrorCode,
  message?: string,
  data?: Partial<ApiErrorData>
): never {
  const errorData: ApiErrorData = {
    code,
    message: message || ERROR_MESSAGES[code] || code,
    ...data
  }

  throw createError({
    statusCode,
    statusMessage: errorData.message,
    data: errorData
  })
}

// =============================================================================
// SUCCESS RESPONSE HELPERS
// =============================================================================

/**
 * Create a response for created resources (201)
 * @param data - The data of the created resource
 * @returns An ApiResponse object with status code 201 (Created)
 * @template T - The type of the data in the response
 */
export function createCreatedResponse<T>(data: T): ApiResponse<T> {
  return createApiResponse(data, HTTP_STATUS.CREATED, 'Resource created successfully')
}

/**
 * Create a response for no content operations (204)
 * @returns An ApiResponse object with status code 204 (No Content)
 */
export function createNoContentResponse(): ApiResponse<null> {
  return createApiResponse(null, HTTP_STATUS.NO_CONTENT, 'No Content')
}

/**
 * Create a response for deleted resources (204)
 * @returns An ApiResponse object with status code 204 (No Content)
 */
export function createDeletedResponse(): ApiResponse<null> {
  return createApiResponse(null, HTTP_STATUS.NO_CONTENT, 'Resource deleted successfully')
}

// =============================================================================
// ERROR HELPER FUNCTIONS
// =============================================================================

/**
 * Throw a bad request error (400)
 * @param code - Error code (defaults to HTTP.BAD_REQUEST)
 * @param message - Override error message
 * @param data - Additional error data
 * @throws {H3Error} Bad request error
 */
export function badRequestError(
  code: ErrorCode = ERROR_CODES.HTTP.BAD_REQUEST,
  message?: string,
  data?: Partial<ApiErrorData>
): never {
  return createApiError(HTTP_STATUS.BAD_REQUEST, code, message, data)
}

/**
 * Throw an unauthorized error (401)
 * @param code - Error code (defaults to AUTH.UNAUTHORIZED)
 * @param message - Override error message
 * @param data - Additional error data
 * @throws {H3Error} Unauthorized error
 */
export function unauthorizedError(
  code: ErrorCode = ERROR_CODES.AUTH.UNAUTHORIZED,
  message?: string,
  data?: Partial<ApiErrorData>
): never {
  return createApiError(HTTP_STATUS.UNAUTHORIZED, code, message, data)
}

/**
 * Throw a forbidden error (403)
 * @param code - Error code (defaults to HTTP.FORBIDDEN)
 * @param message - Override error message
 * @param data - Additional error data
 * @throws {H3Error} Forbidden error
 */
export function forbiddenError(
  code: ErrorCode = ERROR_CODES.HTTP.FORBIDDEN,
  message?: string,
  data?: Partial<ApiErrorData>
): never {
  return createApiError(HTTP_STATUS.FORBIDDEN, code, message, data)
}

/**
 * Throw a not found error (404)
 * @param code - Error code (defaults to HTTP.NOT_FOUND)
 * @param message - Override error message
 * @param data - Additional error data
 * @throws {H3Error} Not found error
 */
export function notFoundError(
  code: ErrorCode = ERROR_CODES.HTTP.NOT_FOUND,
  message?: string,
  data?: Partial<ApiErrorData>
): never {
  return createApiError(HTTP_STATUS.NOT_FOUND, code, message, data)
}

/**
 * Throw a conflict error (409)
 * @param code - Error code (defaults to HTTP.CONFLICT)
 * @param message - Override error message
 * @param data - Additional error data
 * @throws {H3Error} Conflict error
 */
export function conflictError(
  code: ErrorCode = ERROR_CODES.HTTP.CONFLICT,
  message?: string,
  data?: Partial<ApiErrorData>
): never {
  return createApiError(HTTP_STATUS.CONFLICT, code, message, data)
}

/**
 * Throw a validation error (422)
 * @param code - Error code (defaults to VALIDATION.ERROR)
 * @param message - Override error message
 * @param field - Field that failed validation
 * @param details - Detailed validation errors
 * @throws {H3Error} Validation error
 */
export function validationError(
  code: ErrorCode = ERROR_CODES.VALIDATION.ERROR,
  message?: string,
  field?: string,
  details?: Record<string, any>
): never {
  return createApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, code, message, {
    field,
    details
  })
}

/**
 * Throw a rate limit error (429)
 * @param code - Error code (defaults to RATE_LIMIT.EXCEEDED)
 * @param message - Override error message
 * @param data - Additional error data (retryAfter, remainingAttempts, etc.)
 * @throws {H3Error} Rate limit error
 */
export function rateLimitError(
  code: ErrorCode = ERROR_CODES.RATE_LIMIT.EXCEEDED,
  message?: string,
  data?: Partial<ApiErrorData>
): never {
  return createApiError(HTTP_STATUS.TOO_MANY_REQUESTS, code, message, data)
}

/**
 * Throw a server error (500)
 * @param code - Error code (defaults to SERVER.INTERNAL_ERROR)
 * @param message - Override error message
 * @param data - Additional error data
 * @throws {H3Error} Internal server error
 */
export function serverError(
  code: ErrorCode = ERROR_CODES.SERVER.INTERNAL_ERROR,
  message?: string,
  data?: Partial<ApiErrorData>
): never {
  return createApiError(HTTP_STATUS.INTERNAL_ERROR, code, message, data)
}
