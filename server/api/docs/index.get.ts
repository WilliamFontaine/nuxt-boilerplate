import { generateSwaggerSpec, isSwaggerEnabled } from '@@/lib/swagger'

// Documentation endpoint - not included in Swagger
export default defineEventHandler(async () => {
  // Check if documentation is accessible
  if (!isSwaggerEnabled()) {
    throw createError({
      statusCode: 403,
      statusMessage: 'API documentation is not available in production'
    })
  }

  try {
    const swaggerSpec = generateSwaggerSpec()

    // Retourner directement la spec OpenAPI pour Swagger UI
    return swaggerSpec
  } catch (error: any) {
    console.error('Failed to generate OpenAPI spec:', error)
    throw serverError('Failed to generate API documentation')
  }
})
