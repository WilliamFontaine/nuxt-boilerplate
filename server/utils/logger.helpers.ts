/**
 * Application Logger
 *
 * Structured logging utility for server-side operations.
 * In production, this can be extended to send logs to external services
 * (e.g., Sentry, Datadog, CloudWatch).
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogContext {
  [key: string]: any
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  /**
   * Log an informational message
   */
  info(message: string, context?: LogContext): void {
    this.log('info', message, context)
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context)
  }

  /**
   * Log an error message
   */
  error(message: string, context?: LogContext): void {
    this.log('error', message, context)
  }

  /**
   * Log a debug message (only in development)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.log('debug', message, context)
    }
  }

  /**
   * Internal logging implementation
   */
  private log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level,
      message,
      ...(context && { context })
    }

    // In development: pretty print
    if (this.isDevelopment) {
      const prefix = this.getColoredPrefix(level)
      // eslint-disable-next-line no-console
      console[level === 'info' || level === 'debug' ? 'log' : level](
        `${prefix} ${message}`,
        context ? context : ''
      )
    } else {
      // In production: JSON format for log aggregation services
      // eslint-disable-next-line no-console
      console[level === 'info' || level === 'debug' ? 'log' : level](JSON.stringify(logEntry))
    }
  }

  /**
   * Get colored prefix for development logs
   */
  private getColoredPrefix(level: LogLevel): string {
    const colors = {
      info: '\x1b[36m[INFO]\x1b[0m', // Cyan
      warn: '\x1b[33m[WARN]\x1b[0m', // Yellow
      error: '\x1b[31m[ERROR]\x1b[0m', // Red
      debug: '\x1b[90m[DEBUG]\x1b[0m' // Gray
    }
    return colors[level]
  }
}

// Export singleton instance
export const logger = new Logger()
