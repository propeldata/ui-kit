import { render } from '@testing-library/react'
import React from 'react'
import { Dom } from '../../testing'

import { LogLevel } from './Log.types'
import { LogProvider } from './LogProvider'
import { useLog } from './useLog'

const getLog = (type: string, level: string) => `The ${type}-level log with the log level set to ${level}`

const ChildComponent: React.FC<unknown> = () => {
  const log = useLog()

  const level = log.level

  return (
    <div>
      <p>{log.level === LogLevel.Off && `The log level is ${level}. There is no log to show on console.`}</p>
      <p>
        {(log.level === LogLevel.Debug ||
          log.level === LogLevel.Info ||
          log.level === LogLevel.Warn ||
          log.level === LogLevel.Error) &&
          getLog(LogLevel.Error, level)}
      </p>
      <p>
        {(log.level === LogLevel.Debug || log.level === LogLevel.Info || log.level === LogLevel.Warn) &&
          getLog(LogLevel.Warn, level)}
      </p>
      <p>{(log.level === LogLevel.Debug || log.level === LogLevel.Info) && getLog(LogLevel.Info, level)}</p>
      <p>{log.level === LogLevel.Debug && getLog(LogLevel.Debug, level)}</p>
    </div>
  )
}

describe('Logger', () => {
  let dom: Dom

  it('should render error-level log without LogProvider', async () => {
    dom = render(<ChildComponent />)
    const level = LogLevel.Error

    await dom.findByText(getLog(LogLevel.Error, level))

    // If the log level is set to error, the warn level log should not be rendered
    expect(dom.queryByText(getLog(LogLevel.Warn, LogLevel.Warn))).not.toBeInTheDocument()
  })

  it('should render error-level log without LogLevel prop', async () => {
    dom = render(
      <LogProvider>
        <ChildComponent />
      </LogProvider>
    )
    const level = LogLevel.Error

    await dom.findByText(getLog(LogLevel.Error, level))
  })

  it('should render error-level log with LogLevel.Error prop', async () => {
    dom = render(
      <LogProvider logLevel={LogLevel.Error}>
        <ChildComponent />
      </LogProvider>
    )
    const level = LogLevel.Error

    await dom.findByText(getLog(LogLevel.Error, level))
  })

  it('should render warn-level log with LogLevel.Warn prop', async () => {
    dom = render(
      <LogProvider logLevel={LogLevel.Warn}>
        <ChildComponent />
      </LogProvider>
    )

    const level = LogLevel.Warn

    // If the log level is set to warn, shows error and warn level logs
    await dom.findByText(getLog(LogLevel.Error, level))
    await dom.findByText(getLog(LogLevel.Warn, level))
  })

  it('should render info-level log with LogLevel.Info prop', async () => {
    dom = render(
      <LogProvider logLevel={LogLevel.Info}>
        <ChildComponent />
      </LogProvider>
    )
    const level = LogLevel.Info

    // If the log level is set to info, shows error, warn and info level logs
    await dom.findByText(getLog(LogLevel.Error, level))
    await dom.findByText(getLog(LogLevel.Warn, level))
    await dom.findByText(getLog(LogLevel.Info, level))
  })

  it('should render debug-level log with LogLevel.Debug prop', async () => {
    dom = render(
      <LogProvider logLevel={LogLevel.Debug}>
        <ChildComponent />
      </LogProvider>
    )
    const level = LogLevel.Debug

    // If the log level is set to debug, shows error, warn, info and debug level logs
    await dom.findByText(getLog(LogLevel.Error, level))
    await dom.findByText(getLog(LogLevel.Warn, level))
    await dom.findByText(getLog(LogLevel.Info, level))
    await dom.findByText(getLog(LogLevel.Debug, level))
  })

  it('should not render any level log', async () => {
    dom = render(
      <LogProvider logLevel={LogLevel.Off}>
        <ChildComponent />
      </LogProvider>
    )

    await dom.findByText('The log level is off. There is no log to show on console.')

    // If the log level is set to Off, there is no console message
    expect(dom.queryByText(getLog(LogLevel.Error, LogLevel.Error.toString()))).not.toBeInTheDocument()
  })
})
