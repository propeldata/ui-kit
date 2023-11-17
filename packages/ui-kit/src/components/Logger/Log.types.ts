export enum LogLevels {
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug'
}

export type SupportedConsole = Pick<Console, LogLevels>

export type UseLogConfig = {
  environments?: string[]
  logLevel?: LogLevels
  console?: Console
}
