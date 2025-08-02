/**
 * Generic validation constants for a boilerplate
 *
 */

// Text field limits
export const TEXT_FIELD_LIMITS = {
  TITLE: {
    MIN: 3,
    MAX: 100
  },
  DESCRIPTION: {
    MIN: 10,
    MAX: 500
  },
  CONTENT: {
    MIN: 10,
    MAX: 1000
  },
  NAME: {
    MIN: 2,
    MAX: 50
  },
  EMAIL: {
    MAX: 254
  },
  PASSWORD: {
    MIN: 8,
    MAX: 128
  }
} as const

// Pagination limits
export const PAGINATION_LIMITS = {
  PAGE: {
    MIN: 1,
    DEFAULT: 1
  },
  LIMIT: {
    MIN: 1,
    MAX: 50,
    DEFAULT: 10
  }
} as const

// Validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  PHONE: /^[\\+]?[1-9][\d]{0,15}$/,
  URL: /^https?:\/\/.+/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/
} as const
