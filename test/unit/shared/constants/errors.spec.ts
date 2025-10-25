import { describe, it, expect } from 'vitest'
import { ERROR_CODES, ERROR_MESSAGES } from '@@/shared/constants/errors'

describe('Error Constants', () => {
  describe('ERROR_CODES', () => {
    it('should have AUTH error codes', () => {
      expect(ERROR_CODES.AUTH.INVALID_CREDENTIALS).toBe('AUTH_INVALID_CREDENTIALS')
      expect(ERROR_CODES.AUTH.UNAUTHORIZED).toBe('AUTH_UNAUTHORIZED')
      expect(ERROR_CODES.AUTH.TOKEN_EXPIRED).toBe('AUTH_TOKEN_EXPIRED')
    })

    it('should have USER error codes', () => {
      expect(ERROR_CODES.USER.NOT_FOUND).toBe('USER_NOT_FOUND')
      expect(ERROR_CODES.USER.ALREADY_EXISTS).toBe('USER_ALREADY_EXISTS')
    })

    it('should have VALIDATION error codes', () => {
      expect(ERROR_CODES.VALIDATION.ERROR).toBe('VALIDATION_ERROR')
      expect(ERROR_CODES.VALIDATION.INVALID_INPUT).toBe('VALIDATION_INVALID_INPUT')
    })

    it('should have RATE_LIMIT error codes', () => {
      expect(ERROR_CODES.RATE_LIMIT.EXCEEDED).toBe('RATE_LIMIT_EXCEEDED')
      expect(ERROR_CODES.RATE_LIMIT.ACCOUNT_LOCKED).toBe('RATE_LIMIT_ACCOUNT_LOCKED')
    })
  })

  describe('ERROR_MESSAGES', () => {
    it('should have message for each error code', () => {
      expect(ERROR_MESSAGES[ERROR_CODES.AUTH.INVALID_CREDENTIALS]).toBe('Invalid email or password')
      expect(ERROR_MESSAGES[ERROR_CODES.USER.NOT_FOUND]).toBe('User not found')
      expect(ERROR_MESSAGES[ERROR_CODES.VALIDATION.ERROR]).toBe('Validation error')
    })

    it('should have all AUTH error messages', () => {
      Object.values(ERROR_CODES.AUTH).forEach((code) => {
        expect(ERROR_MESSAGES[code]).toBeDefined()
        expect(typeof ERROR_MESSAGES[code]).toBe('string')
      })
    })
  })
})
