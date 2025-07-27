import swaggerJsdoc from 'swagger-jsdoc'
import type { OAS3Definition, OAS3Options } from 'swagger-jsdoc'
import { readFileSync } from 'fs'

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))

const swaggerDefinition: OAS3Definition = {
  openapi: '3.0.3',
  info: {
    title: packageJson.name || 'API',
    version: packageJson.version || '1.0.0',
    description: packageJson.description || 'Auto-generated API documentation'
  }
}

/**
 * Options pour swagger-jsdoc
 */
const swaggerOptions: OAS3Options = {
  definition: swaggerDefinition,
  apis: ['./server/api/**/*.{js,ts}']
}

export function generateSwaggerSpec () {
  return swaggerJsdoc(swaggerOptions)
}

export function isSwaggerEnabled (): boolean {
  return process.env.NODE_ENV === 'development'
}
