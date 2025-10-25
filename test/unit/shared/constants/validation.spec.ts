import { describe, it, expect } from 'vitest'
import {
  TEXT_FIELD_LIMITS,
  PAGINATION_LIMITS,
  VALIDATION_PATTERNS
} from '@@/shared/constants/validation'

describe('Validation Constants', () => {
  describe('TEXT_FIELD_LIMITS', () => {
    it('should have correct password limits', () => {
      expect(TEXT_FIELD_LIMITS.PASSWORD.MIN).toBe(8)
      expect(TEXT_FIELD_LIMITS.PASSWORD.MAX).toBe(128)
    })

    it('should have correct email limit', () => {
      expect(TEXT_FIELD_LIMITS.EMAIL.MAX).toBe(254)
    })

    it('should have correct name limits', () => {
      expect(TEXT_FIELD_LIMITS.NAME.MIN).toBe(2)
      expect(TEXT_FIELD_LIMITS.NAME.MAX).toBe(50)
    })
  })

  describe('PAGINATION_LIMITS', () => {
    it('should have correct default page', () => {
      expect(PAGINATION_LIMITS.PAGE.DEFAULT).toBe(1)
      expect(PAGINATION_LIMITS.PAGE.MIN).toBe(1)
    })

    it('should have correct limit constraints', () => {
      expect(PAGINATION_LIMITS.LIMIT.MIN).toBe(1)
      expect(PAGINATION_LIMITS.LIMIT.MAX).toBe(50)
      expect(PAGINATION_LIMITS.LIMIT.DEFAULT).toBe(10)
    })
  })

  describe('VALIDATION_PATTERNS', () => {
    it('should validate correct email format', () => {
      expect(VALIDATION_PATTERNS.EMAIL.test('test@example.com')).toBe(true)
      expect(VALIDATION_PATTERNS.EMAIL.test('invalid-email')).toBe(false)
    })

    it('should validate correct password format', () => {
      expect(VALIDATION_PATTERNS.PASSWORD.test('Password123')).toBe(true)
      expect(VALIDATION_PATTERNS.PASSWORD.test('weak')).toBe(false)
      expect(VALIDATION_PATTERNS.PASSWORD.test('NoNumbers')).toBe(false)
    })

    it('should validate correct slug format', () => {
      expect(VALIDATION_PATTERNS.SLUG.test('my-slug-123')).toBe(true)
      expect(VALIDATION_PATTERNS.SLUG.test('Invalid_Slug')).toBe(false)
      expect(VALIDATION_PATTERNS.SLUG.test('Invalid Slug')).toBe(false)
    })
  })
})
