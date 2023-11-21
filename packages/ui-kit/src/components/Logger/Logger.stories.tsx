import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { storybookCodeTemplate } from '../../helpers'
import { LogProvider } from './LogProvider'
import { useLog } from './useLog'
import { LogLevel } from './Log.types'

const ChildComponent: React.FC<unknown> = () => {
  const log = useLog()

  const level = log.level.toUpperCase()

  log.error(`This is an error-level message with the log level set to ${level}.`)
  log.warn(`This is a warn-level message with the log level set to ${level}.`)
  log.info(`This is an info-level message with the log level set to ${level}.`)
  log.debug(`This is a debug-level message with the log level set to ${level}.`)

  return (
    <div>
      <p>{log.level === LogLevel.Off && `The log level is ${level}. There is no log to show on console.`}</p>
      <p>
        {[LogLevel.Error, LogLevel.Warn, LogLevel.Info, LogLevel.Debug].includes(log.level) &&
          `This is an error-level message with the log level set to ${level}.`}
      </p>
      <p>
        {[LogLevel.Warn, LogLevel.Info, LogLevel.Debug].includes(log.level) &&
          `This is a warn-level message with the log level set to ${level}.`}
      </p>
      <p>
        {[LogLevel.Info, LogLevel.Debug].includes(log.level) &&
          `This is an info-level message with the log level set to ${level}.`}
      </p>
      <p>{log.level === LogLevel.Debug && `This is a debug-level message with the log level set to ${level}.`}</p>
      <mark>
        <small>Check the console for logs.</small>
      </mark>
    </div>
  )
}

const meta: Meta<typeof ChildComponent> = {
  title: 'PROVIDERS/Logger',
  tags: ['pattern'],
  component: ChildComponent,
  parameters: {
    imports: 'LogProvider, LogLevel, useLog',
    codeTemplate: storybookCodeTemplate
  }
} satisfies Meta<typeof ChildComponent>

export default meta

type Story = StoryObj<typeof meta>

export const LogLevelError: Story = {
  args: {
    logLevel: LogLevel.Error
  },
  argTypes: {
    logLevel: {
      options: [LogLevel.Off, LogLevel.Error, LogLevel.Warn, LogLevel.Info, LogLevel.Debug],
      description: 'The log level is to set which logs will be visible.',
      default: 'error',
      control: { type: 'select' }
    }
  },
  render: (args) => (
    <LogProvider {...args}>
      <ChildComponent />
    </LogProvider>
  )
}
