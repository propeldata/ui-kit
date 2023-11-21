import { useContext } from 'react'

import { LogConfig, LogLevel } from './Log.types'
import { LogContext } from './LogProvider'

export const useLog = (): LogConfig => {
  // Get the log level from the context
  const context = useContext(LogContext)

  // If the context loglevel is set, use it, otherwise use the default log level as  "error"
  const level: LogLevel = context.logLevel || LogLevel.Error

  // Build the  log methods with only supported console methods based on the log level.
  // Supported log methods are: "error | warn | info | debug"
  const error = function (...args: any[]) {
    if (level === LogLevel.Error || level === LogLevel.Warn || level === LogLevel.Info || level === LogLevel.Debug) {
      return console.error(...args)
    }
    return
  }

  const warn = function (...args: any[]) {
    if (level === LogLevel.Warn || level === LogLevel.Info || level === LogLevel.Debug) {
      return console.warn(...args)
    }
    return
  }

  const info = function (...args: any[]) {
    if (level === LogLevel.Info || level === LogLevel.Debug) {
      return console.info(...args)
    }
    return
  }

  const debug = function (...args: any[]) {
    if (level === LogLevel.Debug) {
      return console.debug(...args)
    }
    return
  }

  // Export the log and logLevel
  return { error, warn, info, debug, level }
}
