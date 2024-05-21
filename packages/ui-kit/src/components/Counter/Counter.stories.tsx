import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import './Counter.stories.css'
import axiosInstance from '../../../../../app/storybook/src/axios'
import { quotedStringRegex, RelativeTimeRange, storybookCodeTemplate, useStorybookAccessToken } from '../../helpers'
import { Counter as CounterSource, CounterComponent } from './Counter'
import { CounterProps } from './Counter.types'

const meta: Meta<typeof CounterComponent> = {
  title: 'Components/Counter',
  component: CounterComponent,
  tags: ['tag'],
  argTypes: {
    baseTheme: {
      table: {
        disable: true
      }
    }
  },
  parameters: {
    controls: { sort: 'alpha' },
    imports: 'Counter, RelativeTimeRange',
    transformBody: (body: string) => body.replace(quotedStringRegex('LAST_N_DAYS'), 'RelativeTimeRange.LastNDays'),
    codeTemplate: storybookCodeTemplate
  }
}

export default meta

type Story = StoryObj<typeof CounterComponent>

const connectedParams: CounterProps = {
  localize: true,
  prefixValue: '$',
  query: {
    accessToken: '<PROPEL_ACCESS_TOKEN>',
    metric: process.env.STORYBOOK_METRIC_UNIQUE_NAME_1,
    timeRange: {
      relative: RelativeTimeRange.LastNDays,
      n: 30
    }
  }
}

const Counter = (args: Story['args']) => {
  const { accessToken } = useStorybookAccessToken(axiosInstance)
  const ref = React.useRef(null)

  if (!accessToken && args?.query) {
    return null
  }

  return (
    <CounterSource
      {...{
        ref,
        ...args,
        // @TODO: Improve this
        onClick: args?.onClick
          ? () => {
              ref?.current && args.onClick?.(ref.current)
            }
          : undefined,
        query: args?.query
          ? {
              ...args?.query,
              accessToken
            }
          : undefined
      }}
    />
  )
}

export const SingleValueStory: Story = {
  name: 'Single value',
  args: {
    ...connectedParams,
    style: {
      width: 'fit-content'
    },
    card: true
  },
  render: (args) => <Counter {...args} />
}

export const ValueInCardStory: Story = {
  name: 'Value in card',
  tags: ['hidden'],
  args: {
    ...connectedParams,
    style: {
      width: 'fit-content'
    }
  },
  render: (args) => (
    <div className="card-container">
      <div className="card">
        <span className="card-label">Revenue</span>
        <Counter {...args} />
      </div>
    </div>
  )
}

export const StaticStory: Story = {
  name: 'Static numeric value',
  args: {
    prefixValue: '$',
    value: '49291',
    localize: true,
    card: true,
    style: {
      width: 'fit-content'
    }
  },
  render: (args) => <Counter {...args} />
}

export const StringValueStory: Story = {
  name: 'Static string value',
  args: {
    card: true,
    value: 'A string value'
  },
  render: (args) => <Counter {...args} />
}

export const SingleValueCustomStyleStory: Story = {
  name: 'Single value custom style',
  tags: ['hidden'],
  args: {
    ...connectedParams,
    card: true,
    loaderProps: {
      style: {
        fontSize: '2rem'
      }
    },
    style: {
      width: 'fit-content',
      fontSize: '2rem',
      fontStyle: 'italic',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }
  },
  render: (args) => <Counter {...args} />
}

export const SingleValueRefStory: Story = {
  name: 'Single value with ref',
  tags: ['hidden'],
  args: {
    value: '49291',
    localize: true,
    card: true,
    onClick: (ref) => {
      console.log('ref', ref)
    }
  },
  parameters: {
    // @TODO: Improve this
    codeTemplate: () => `
      import React from 'react'
      import { Counter } from '@propeldata/ui-kit'

      function App() {
        const ref = React.useRef(null)

        return (
          <Counter
            ref={ref}
            value="49291"
            localize
            card
            onClick={() => {
              console.log('ref', ref?.current)
            }}
          />
        )
      }
    `
  },
  render: (args) => <Counter {...args} />
}

export const CustomErrorFallbackStory: Story = {
  name: 'Custom ErrorFallback',
  tags: ['hidden'],
  args: {
    query: {
      accessToken: 'invalid-access-token'
    },
    card: true,
    errorFallback: ({ theme }) => (
      <div
        style={{
          border: `1px solid ${theme?.borderError}`,
          color: theme?.textErrorPrimary,
          padding: '1rem'
        }}
      >
        Custom error fallback
      </div>
    )
  },
  render: (args) => <Counter {...args} />
}
