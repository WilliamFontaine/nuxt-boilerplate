/**
 * Simple API error utilities
 */
export function useApiError() {
  /**
   * Get error code from fetch error
   */
  function getErrorCode(error: FetchError): string | undefined {
    if (error?.data && 'data' in error.data) {
      return error.data.data?.code
    }
    return (error?.data as ApiErrorData)?.code
  }

  /**
   * Get error message from fetch error
   */
  function getErrorMessage(error: FetchError): string | undefined {
    if (error?.data && 'data' in error.data) {
      return error.data.data?.message || error?.statusMessage || error?.message
    }
    return (error?.data as ApiErrorData)?.message || error?.statusMessage || error?.message
  }

  /**
   * Extract data from error
   */
  function getErrorData(error: FetchError): Partial<ApiErrorData> {
    if (error?.data && 'data' in error.data) {
      return (error.data.data as Partial<ApiErrorData>) || {}
    }
    return (error?.data as Partial<ApiErrorData>) || {}
  }

  return {
    getErrorCode,
    getErrorMessage,
    getErrorData
  }
}
