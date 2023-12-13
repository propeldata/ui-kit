import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { quotedStringRegex, storybookCodeTemplate } from '../../helpers'
import { DEFAULT_LOG_LEVEL, LogProvider } from './LogProvider'
import { useLog } from './useLog'
import { LogLevel } from './Log.types'

const options = [LogLevel.Off, LogLevel.Error, LogLevel.Warn, LogLevel.Info, LogLevel.Debug]

const getLog = (type: string, level: string) =>
  `This is ${
    type === LogLevel.Error || type === LogLevel.Info ? 'an' : 'a'
  } ${type}-level message with the log level set to "${level}".`

const Counter: React.FC<unknown> = () => {
  const log = useLog()

  const level = log.level

  log.error(getLog(LogLevel.Error, level))
  log.warn(getLog(LogLevel.Warn, level))
  log.info(getLog(LogLevel.Info, level))
  log.debug(getLog(LogLevel.Debug, level))

  return (
    <div>
      <p>{level === LogLevel.Off && `The log level is "${level}". There is no log to show on console.`}</p>
      <p>
        {[LogLevel.Error, LogLevel.Warn, LogLevel.Info, LogLevel.Debug].includes(level) &&
          getLog(LogLevel.Error, level)}
      </p>
      <p>{[LogLevel.Warn, LogLevel.Info, LogLevel.Debug].includes(level) && getLog(LogLevel.Warn, level)}</p>
      <p>{[LogLevel.Info, LogLevel.Debug].includes(level) && getLog(LogLevel.Info, level)}</p>
      <p>{level === LogLevel.Debug && getLog(LogLevel.Debug, level)}</p>
      <mark>
        <small>Check the console for logs.</small>
      </mark>
    </div>
  )
}

const meta: Meta<typeof Counter> = {
  title: 'Getting started/Logger',
  tags: ['pattern'],
  component: Counter,
  parameters: {
    imports: 'Counter, LogProvider, LogLevel',
    codeTemplate: storybookCodeTemplate,
    transformBody: (body: string) => {
      let transformedBody = body
      options.forEach((option) => {
        const index = Object.keys(LogLevel).findIndex((key) => LogLevel[key] === option)
        transformedBody = transformedBody.replace(
          quotedStringRegex(option),
          `{LogLevel.${Object.keys(LogLevel)[index]}}`
        )
      })
      return transformedBody
    }
  }
} satisfies Meta<typeof Counter>

export default meta

type Story = StoryObj<typeof meta>

export const LogLevelError: Story = {
  args: {
    logLevel: LogLevel.Error
  },
  argTypes: {
    logLevel: {
      options,
      description: 'The log level to set (defaults to "error").',
      default: DEFAULT_LOG_LEVEL,
      control: { type: 'select' }
    }
  },
  render: (args) => (
    <LogProvider {...args}>
      <Counter />
    </LogProvider>
  )
}
