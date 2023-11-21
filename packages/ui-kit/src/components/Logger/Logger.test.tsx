import { render } from '@testing-library/react'
import React from 'react'
import { Dom } from '../../testing'

import { LogLevel } from './Log.types'
import { LogProvider } from './LogProvider'
import { useLog } from './useLog'

const ChildComponent: React.FC<unknown> = () => {
  const log = useLog()

  const level = log.level.toUpperCase()

  log.error(`This is a ERROR message with the log level set to ${level}`)
  log.warn(`This is a WARN message with the log level set to ${level}`)
  log.info(`This is a INFO message with the log level set to ${level}`)
  log.debug(`This is a DEBUG message with the log level set to ${level}`)

  return (
    <div>
      <p>{log.level === LogLevel.Off && `The log level is ${level}. There is no log to show on console.`}</p>
      <p>
        {(log.level === LogLevel.Debug ||
          log.level === LogLevel.Info ||
          log.level === LogLevel.Warn ||
          log.level === LogLevel.Error) &&
          `This is a ERROR message with the log level set to ${level}`}
      </p>
      <p>
        {(log.level === LogLevel.Debug || log.level === LogLevel.Info || log.level === LogLevel.Warn) &&
          `This is a WARN message with the log level set to ${level}`}
      </p>
      <p>
        {(log.level === LogLevel.Debug || log.level === LogLevel.Info) &&
          `This is a INFO message with the log level set to ${level}`}
      </p>
      <p>{log.level === LogLevel.Debug && `This is a DEBUG message with the log level set to ${level}`}</p>
    </div>
  )
}

describe('Logger', () => {
  let dom: Dom

  it('should render the component with ERROR level log message without LogProvider', async () => {
    dom = render(<ChildComponent />)
    await dom.findByText('This is a ERROR message with the log level set to ERROR')

    // This checks if the log level is set to ERROR, then the WARN message should not be rendered
    expect(dom.queryByText('This is a WARN message with the log level set to WARN')).not.toBeInTheDocument()
  })

  it('should render the component with ERROR level log message LogProvider without LogLevel prop', async () => {
    dom = render(
      <LogProvider>
        <ChildComponent />
      </LogProvider>
    )
    await dom.findByText('This is a ERROR message with the log level set to ERROR')
  })

  it('should render the component with ERROR level log message LogProvider without LogLevel prop', async () => {
    dom = render(
      <LogProvider logLevel={LogLevel.Error}>
        <ChildComponent />
      </LogProvider>
    )
    await dom.findByText('This is a ERROR message with the log level set to ERROR')
  })

  it('should render the component with WARN level log message with LogLevel WARN prop', async () => {
    dom = render(
      <LogProvider logLevel={LogLevel.Warn}>
        <ChildComponent />
      </LogProvider>
    )
    await dom.findByText('This is a WARN message with the log level set to WARN')
  })

  it('should render the component with INFO level log message with LogLevel INFO prop', async () => {
    dom = render(
      <LogProvider logLevel={LogLevel.Info}>
        <ChildComponent />
      </LogProvider>
    )

    // This checks If the log level is set to INFO, show the ERROR and WARN messages also with INFO log level
    await dom.findByText('This is a ERROR message with the log level set to INFO')
    await dom.findByText('This is a WARN message with the log level set to INFO')
    await dom.findByText('This is a INFO message with the log level set to INFO')
  })

  it('should render the component with INFO level log message with LogLevel INFO prop', async () => {
    dom = render(
      <LogProvider logLevel={LogLevel.Debug}>
        <ChildComponent />
      </LogProvider>
    )

    // This checks If the log level is set to INFO, show the ERROR and WARN messages also with INFO log level
    await dom.findByText('This is a ERROR message with the log level set to DEBUG')
    await dom.findByText('This is a WARN message with the log level set to DEBUG')
    await dom.findByText('This is a INFO message with the log level set to DEBUG')
    await dom.findByText('This is a DEBUG message with the log level set to DEBUG')
  })

  it('should render the component with no console message when the log level set to OFF', async () => {
    dom = render(
      <LogProvider logLevel={LogLevel.Off}>
        <ChildComponent />
      </LogProvider>
    )

    await dom.findByText('The log level is OFF. There is no log to show on console.')

    // This checks if the log level is set to Off, there is no console message
    expect(dom.queryByText('This is a ERROR message with the log level set to ERROR')).not.toBeInTheDocument()
  })
})
