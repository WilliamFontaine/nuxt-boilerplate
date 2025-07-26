export interface ApiResponse<T> {
  statusCode: number
  data?: T | null
  message?: string
}
