import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { storybookCodeTemplate } from '../../helpers'
import { LogProvider } from './LogProvider'
import { useLog } from './useLog'
import { LogLevels } from './Log.types'

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
      <mark>
        <small>Check the console for logs</small>
      </mark>
    </div>
  )
}

const meta: Meta<typeof ChildComponent> = {
  title: 'PROVIDERS/Logger',
  component: ChildComponent,
  parameters: {
    imports: 'LogProvider, LogLevels, useLog',
    codeTemplate: storybookCodeTemplate
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const LogLevelError: Story = {
  render: (args) => (
    <LogProvider logLevel={LogLevels.Error}>
      <ChildComponent />
    </LogProvider>
  )
}

export const LogLevelWarn: Story = {
  render: (args) => (
    <LogProvider logLevel={LogLevels.Warn}>
      <ChildComponent />
    </LogProvider>
  )
}

export const LogLevelInfo: Story = {
  render: (args) => (
    <LogProvider logLevel={LogLevels.Info}>
      <ChildComponent />
    </LogProvider>
  )
}

export const LogLevelDebug: Story = {
  render: (args) => (
    <LogProvider logLevel={LogLevels.Debug}>
      <ChildComponent />
    </LogProvider>
  )
}

export const WithoutLogProvider: Story = {
  render: (args) => <ChildComponent />
}
