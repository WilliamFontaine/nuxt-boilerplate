import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { isSwaggerEnabled } from '../../lib/swagger'

describe('Swagger Protection', () => {
  let originalEnv: string | undefined

  beforeEach(() => {
    originalEnv = process.env.NODE_ENV
  })

  afterEach(() => {
    if (originalEnv) {
      process.env.NODE_ENV = originalEnv
    } else {
      delete process.env.NODE_ENV
    }
  })

  it('should be enabled in development', () => {
    process.env.NODE_ENV = 'development'
    expect(isSwaggerEnabled()).toBe(true)
  })

  it('should be disabled in production', () => {
    process.env.NODE_ENV = 'production'
    expect(isSwaggerEnabled()).toBe(false)
  })

  it('should be disabled in test environment', () => {
    process.env.NODE_ENV = 'test'
    expect(isSwaggerEnabled()).toBe(false)
  })

  it('should be disabled when NODE_ENV is undefined', () => {
    delete process.env.NODE_ENV
    expect(isSwaggerEnabled()).toBe(false)
  })

  it('should be disabled for any non-development environment', () => {
    const envs = ['production', 'staging', 'test', 'ci', 'preview']

    envs.forEach((env) => {
      process.env.NODE_ENV = env
      expect(isSwaggerEnabled()).toBe(false)
    })
  })
})
