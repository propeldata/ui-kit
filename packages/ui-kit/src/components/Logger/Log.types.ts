export enum LogLevel {
  Off = 'off',
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug'
}

export interface Log {
  /** The currently configured log level. */
  level: LogLevel

  /** Log at error-level, if enabled. */
  error: Console['error']

  /** Log at warn-level, if enabled. */
  warn: Console['warn']

  /** Log at info-level, if enabled. */
  info: Console['info']

  /** Log at debug-level, if enabled. */
  debug: Console['debug']
}
