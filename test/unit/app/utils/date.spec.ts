import { describe, it, expect } from 'vitest'

describe('Date Utils - Simple Tests', () => {
  describe('Date conversion', () => {
    it('should create valid Date from string', () => {
      const date = new Date('2024-01-15')
      expect(date.getFullYear()).toBe(2024)
      expect(date.getMonth()).toBe(0) // Janvier = 0
      expect(date.getDate()).toBe(15)
    })

    it('should detect invalid dates', () => {
      const invalidDate = new Date('invalid-date')
      expect(isNaN(invalidDate.getTime())).toBe(true)
    })

    it('should format dates with toLocaleDateString', () => {
      const date = new Date('2024-01-15')
      const formatted = date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })

      expect(formatted).toContain('2024')
    })
  })
})
