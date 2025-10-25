import { describe, it, expect } from 'vitest'
import { HTTP_STATUS } from '@@/server/constants/http'

describe('HTTP Constants', () => {
  describe('HTTP_STATUS', () => {
    it('should have correct 2xx status codes', () => {
      expect(HTTP_STATUS.OK).toBe(200)
      expect(HTTP_STATUS.CREATED).toBe(201)
      expect(HTTP_STATUS.NO_CONTENT).toBe(204)
    })

    it('should have correct 4xx status codes', () => {
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400)
      expect(HTTP_STATUS.UNAUTHORIZED).toBe(401)
      expect(HTTP_STATUS.FORBIDDEN).toBe(403)
      expect(HTTP_STATUS.NOT_FOUND).toBe(404)
    })

    it('should have correct 5xx status codes', () => {
      expect(HTTP_STATUS.INTERNAL_ERROR).toBe(500)
    })

    it('should have rate limit status code', () => {
      expect(HTTP_STATUS.TOO_MANY_REQUESTS).toBe(429)
    })

    it('should have validation error status code', () => {
      expect(HTTP_STATUS.UNPROCESSABLE_ENTITY).toBe(422)
    })
  })
})
