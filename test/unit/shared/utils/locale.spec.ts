import { describe, it, expect } from 'vitest'
import { getIsoLocale } from '@@/shared/utils/locale'

describe('getIsoLocale', () => {
  it('should convert "en" to "en_US"', () => {
    expect(getIsoLocale('en')).toBe('en_US')
  })

  it('should convert "fr" to "fr_FR"', () => {
    expect(getIsoLocale('fr')).toBe('fr_FR')
  })

  it('should return default "en_US" for unknown locale', () => {
    expect(getIsoLocale('es')).toBe('en_US')
  })

  it('should return default "en_US" for empty string', () => {
    expect(getIsoLocale('')).toBe('en_US')
  })
})
