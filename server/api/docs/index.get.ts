import { generateSwaggerSpec, isSwaggerEnabled } from '@@/lib/swagger'

// Documentation endpoint - not included in Swagger
export default defineEventHandler(async () => {
  // Check if documentation is accessible
  if (!isSwaggerEnabled()) {
    forbiddenError(ERROR_CODES.HTTP.FORBIDDEN, 'API documentation is not available in production')
  }

  const swaggerSpec = generateSwaggerSpec()

  // Return OpenAPI spec directly for Swagger UI
  return swaggerSpec
})
