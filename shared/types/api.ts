/**
 * Standard API response structure
 */
export interface ApiResponse<T> {
  statusCode: number
  data?: T | null
  message?: string
}

/**
 * Error data structure for API responses
 */
export interface ApiErrorData {
  code: string
  message: string
  field?: string
  details?: Record<string, any>
  [key: string]: any
}

/**
 * Server-side error with statusCode (for service layer)
 */
export interface ServerError extends Error {
  statusCode?: number
  data?: ApiErrorData
}

/**
 * Client-side fetch error structure
 */
export interface FetchError extends Error {
  statusCode?: number
  statusMessage?: string
  data?: ApiErrorData | { data?: ApiErrorData }
  cause?: unknown
}
