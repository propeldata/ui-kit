import { useContext } from 'react'

import { LogLevels, SupportedConsole } from './Log.types'
import { LogContext } from './LogProvider'

export const useLog = () => {
  // Get the log level from the context
  const context = useContext(LogContext)

  // If the context loglevel is set, use it, otherwise use the default log level as  "error"
  let logLevel: LogLevels = context || LogLevels.Error

  // Sets the log level if the <PRODUCTION_LOG_LEVEL> environment variable is set
  // to on of the supported log levels "off | error | warn | info | debug"
  if (process.env.NODE_ENV === 'production') {
    // If the <PRODUCTION_LOG_LEVEL> environment variable is set to a supported log level then use it for prodcution
    // This overrides the log level, set in the context, which is passed via the logProvider
    if (Object.values(LogLevels).includes(process.env.PRODUCTION_LOG_LEVEL)) {
      logLevel = process.env.PRODUCTION_LOG_LEVEL
    }
    // If the <PRODUCTION_LOG_LEVEL> environment variable is set to "off" then disable logging for production
    if (process.env.PRODUCTION_LOG_LEVEL === 'off') {
      logLevel = null
    }
  }

  // Build the  log level with only supported log methods based on the log level.
  // Supported log methods are: "error | warn | info | debug"
  const log: SupportedConsole = {
    [LogLevels.Error]:
      logLevel === LogLevels.Error ||
      logLevel === LogLevels.Warn ||
      logLevel === LogLevels.Info ||
      logLevel === LogLevels.Debug
        ? console.error
        : () => {},
    [LogLevels.Warn]:
      logLevel === LogLevels.Warn || logLevel === LogLevels.Info || logLevel === LogLevels.Debug
        ? console.warn
        : () => {},
    [LogLevels.Info]: logLevel === LogLevels.Info || logLevel === LogLevels.Debug ? console.info : () => {},
    [LogLevels.Debug]: logLevel === LogLevels.Debug ? console.debug : () => {}
  }

  // Export the log and logLevel
  return { log, logLevel }
}
