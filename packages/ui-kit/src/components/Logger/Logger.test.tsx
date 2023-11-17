import { render } from '@testing-library/react'
import React from 'react'
import { Dom } from '../../testing'

import { LogLevels } from './Log.types'
import { LogProvider } from './LogProvider'
import { useLog } from './useLog'

const ChildComponent: React.FC<unknown> = () => {
  const { log, logLevel } = useLog()

  const level = logLevel?.toUpperCase()

  log.error(`This is a ERROR message with the log level set to ${level}`)
  log.warn(`This is a WARN message with the log level set to ${level}`)
  log.info(`This is a INFO message with the log level set to ${level}`)
  log.debug(`This is a DEBUG message with the log level set to ${level}`)

  return (
    <div>
      <p>{log.error.name === 'error' && `This is a ERROR message with the log level set to ${level}`}</p>
      <p>{log.warn.name === 'warn' && `This is a WARN message with the log level set to ${level}`}</p>
      <p>{log.info.name === 'info' && `This is a INFO message with the log level set to ${level}`}</p>
      <p>{log.debug.name === 'debug' && `This is a DEBUG message with the log level set to ${level}`}</p>
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
      <LogProvider logLevel={LogLevels.Error}>
        <ChildComponent />
      </LogProvider>
    )
    await dom.findByText('This is a ERROR message with the log level set to ERROR')
  })

  it('should render the component with WARN level log message with LogLevel WARN prop', async () => {
    dom = render(
      <LogProvider logLevel={LogLevels.Warn}>
        <ChildComponent />
      </LogProvider>
    )
    await dom.findByText('This is a WARN message with the log level set to WARN')
  })

  it('should render the component with INFO level log message with LogLevel INFO prop', async () => {
    dom = render(
      <LogProvider logLevel={LogLevels.Info}>
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
      <LogProvider logLevel={LogLevels.Debug}>
        <ChildComponent />
      </LogProvider>
    )

    // This checks If the log level is set to INFO, show the ERROR and WARN messages also with INFO log level
    await dom.findByText('This is a ERROR message with the log level set to DEBUG')
    await dom.findByText('This is a WARN message with the log level set to DEBUG')
    await dom.findByText('This is a INFO message with the log level set to DEBUG')
    await dom.findByText('This is a DEBUG message with the log level set to DEBUG')
  })

  it('should render the component with no log if the env set to "prodcution" and PRODUCTION_LOG_LEVEL set to "off"', async () => {
    process.env = {
      NODE_ENV: 'production',
      PRODUCTION_LOG_LEVEL: 'off'
    }

    dom = render(
      <LogProvider logLevel={LogLevels.Error}>
        <ChildComponent />
      </LogProvider>
    )

    expect(dom.queryByText('This is a ERROR message with the log level set to ERROR')).not.toBeInTheDocument()
  })

  it('should render the component with WARN log if the env set to "prodcution" and PRODUCTION_LOG_LEVEL set to "warn" and LogLevel prop set to "info"', async () => {
    process.env = {
      NODE_ENV: 'production',
      PRODUCTION_LOG_LEVEL: 'warn'
    }

    dom = render(
      <LogProvider logLevel={LogLevels.Info}>
        <ChildComponent />
      </LogProvider>
    )

    await dom.findByText('This is a ERROR message with the log level set to WARN')
    await dom.findByText('This is a WARN message with the log level set to WARN')

    expect(dom.queryByText('This is a ERROR message with the log level set to INFO')).not.toBeInTheDocument()
  })
})
