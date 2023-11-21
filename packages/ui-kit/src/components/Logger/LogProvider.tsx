import React, { createContext } from 'react'

import { LogLevel } from './Log.types'

export type LogContextProps = {
  logLevel: LogLevel
}

export const LogContext = createContext({ logLevel: LogLevel.Error })

export type LogProviderProps = {
  children?: React.ReactNode

  /** The log level to use (defaults to "error"). */
  logLevel?: LogLevel
}

export const LogProvider = ({ children, logLevel = LogLevel.Error }: LogProviderProps) => (
  <LogContext.Provider value={{ logLevel }}>{children}</LogContext.Provider>
)
