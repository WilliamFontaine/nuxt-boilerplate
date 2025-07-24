/**
 * Prisma known error codes constants
 */
export const PRISMA_ERRORS = {
  // Unique constraint failed
  UNIQUE_CONSTRAINT_FAILED: 'P2002',

  // Record to update not found
  RECORD_NOT_FOUND: 'P2025',

  // Foreign key constraint failed
  FOREIGN_KEY_CONSTRAINT_FAILED: 'P2003',

  // Null constraint violation
  NULL_CONSTRAINT_VIOLATION: 'P2004',

  // Relation violation
  RELATION_VIOLATION: 'P2005',

  // Value too long for column
  VALUE_TOO_LONG: 'P2006',

  // Invalid datetime format
  INVALID_DATETIME_FORMAT: 'P2012',

  // Raw query failed
  RAW_QUERY_FAILED: 'P2011',

  // Duplicate record error
  DUPLICATE_RECORD: 'P2002',

  // Other common errors
  QUERY_ENGINE_PANIC: 'P1012',

  // Prisma client initialization error
  CLIENT_INIT_ERROR: 'P1010'
} as const
