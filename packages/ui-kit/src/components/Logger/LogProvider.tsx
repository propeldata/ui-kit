import React, { createContext } from 'react'

import { LogLevels } from './Log.types'

export type LogContextProps = {
  logLevel?: LogLevels
}

export const LogContext = createContext<LogContextProps | undefined>(LogLevels.Error)

export type LogProviderProps = {
  children?: React.ReactNode
  logLevel?: LogLevels
}

export const LogProvider = ({ children, logLevel = LogLevels.Error }: LogProviderProps) => (
  <LogContext.Provider value={logLevel}>{children}</LogContext.Provider>
)
