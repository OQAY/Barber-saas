/**
 * Sistema de logging profissional
 * Substitui console.log/error por logging estruturado
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  error?: Error
  userId?: string
  sessionId?: string
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isProduction = process.env.NODE_ENV === 'production'

  private formatLogEntry(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry

    if (this.isDevelopment) {
      // Formato legível para desenvolvimento
      let logString = `[${timestamp}] ${level.toUpperCase()}: ${message}`

      if (context && Object.keys(context).length > 0) {
        logString += `\nContext: ${JSON.stringify(context, null, 2)}`
      }

      if (error) {
        logString += `\nError: ${error.message}\nStack: ${error.stack}`
      }

      return logString
    } else {
      // Formato JSON estruturado para produção
      return JSON.stringify({
        ...entry,
        error: error ? {
          message: error.message,
          stack: error.stack,
          name: error.name
        } : undefined
      })
    }
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error
    }

    const formattedLog = this.formatLogEntry(entry)

    // Em produção, você pode enviar para serviços como Sentry, LogRocket, etc.
    if (this.isProduction) {
      // TODO: Integrar com serviço de logging (Sentry, Datadog, etc.)
      console.log(formattedLog)
    } else {
      // Em desenvolvimento, usa console tradicional com cores
      switch (level) {
        case 'debug':
          console.debug(formattedLog)
          break
        case 'info':
          console.info(formattedLog)
          break
        case 'warn':
          console.warn(formattedLog)
          break
        case 'error':
          console.error(formattedLog)
          break
      }
    }
  }

  debug(message: string, context?: Record<string, any>) {
    if (this.isDevelopment) {
      this.log('debug', message, context)
    }
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context)
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context)
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log('error', message, context, error)
  }

  // Helper para logging de ações do usuário
  userAction(action: string, userId: string, context?: Record<string, any>) {
    this.info(`User action: ${action}`, {
      userId,
      action,
      ...context
    })
  }

  // Helper para logging de erros de API
  apiError(endpoint: string, error: Error, context?: Record<string, any>) {
    this.error(`API Error in ${endpoint}`, error, {
      endpoint,
      ...context
    })
  }

  // Helper para logging de performance
  performance(operation: string, duration: number, context?: Record<string, any>) {
    const level = duration > 1000 ? 'warn' : 'info'
    this.log(level, `Performance: ${operation} took ${duration}ms`, context)
  }
}

// Singleton instance
export const logger = new Logger()

// Helper function para medir performance
export function withPerformanceLogging<T>(
  operation: string,
  fn: () => T | Promise<T>,
  context?: Record<string, any>
): Promise<T> {
  const start = Date.now()

  const logPerformance = () => {
    const duration = Date.now() - start
    logger.performance(operation, duration, context)
  }

  try {
    const result = fn()

    if (result instanceof Promise) {
      return result.then((value) => {
        logPerformance()
        return value
      }).catch((error) => {
        logPerformance()
        throw error
      })
    } else {
      logPerformance()
      return Promise.resolve(result)
    }
  } catch (error) {
    logPerformance()
    throw error
  }
}