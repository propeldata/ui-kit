import { useCallback, useContext, useMemo } from 'react'

import { Log, LogLevel } from './Log.types'
import { LogContext } from './LogProvider'

export const useLog = (): Log => {
  // Get the log level from the context
  const context = useContext(LogContext)

  // If the context loglevel is set, use it, otherwise use the default log level as "error"
  const level: LogLevel = context.logLevel ?? LogLevel.Error

  // Build the log methods with only supported console methods based on the log level.
  // Supported log methods are: "error | warn | info | debug"
  const error = useCallback(
    function (...args: unknown[]) {
      if (level === LogLevel.Error || level === LogLevel.Warn || level === LogLevel.Info || level === LogLevel.Debug) {
        return console.error(...args)
      }
    },
    [level]
  )

  const warn = useCallback(
    function (...args: unknown[]) {
      if (level === LogLevel.Warn || level === LogLevel.Info || level === LogLevel.Debug) {
        return console.warn(...args)
      }
    },
    [level]
  )

  const info = useCallback(
    function (...args: unknown[]) {
      if (level === LogLevel.Info || level === LogLevel.Debug) {
        return console.info(...args)
      }
    },
    [level]
  )

  const debug = useCallback(
    function (...args: unknown[]) {
      if (level === LogLevel.Debug) {
        return console.debug(...args)
      }
    },
    [level]
  )

  const log = useMemo(() => ({ error, warn, info, debug, level }), [error, warn, info, debug, level])

  // Export the log and logLevel
  return log
}
