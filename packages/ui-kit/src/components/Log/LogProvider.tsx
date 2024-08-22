'use client'

import React, { createContext } from 'react'

import { LogLevel } from './Log.types'

export type LogContextProps = {
  logLevel: LogLevel
}

export const DEFAULT_LOG_LEVEL = LogLevel.Error

export const LogContext = createContext<LogContextProps>({ logLevel: DEFAULT_LOG_LEVEL })

export type LogProviderProps = {
  children?: React.ReactNode

  /** The log level to use (defaults to "error"). */
  logLevel?: LogLevel
}

export const LogProvider = ({ children, logLevel = DEFAULT_LOG_LEVEL }: LogProviderProps) => (
  <LogContext.Provider value={{ logLevel }}>{children}</LogContext.Provider>
)
