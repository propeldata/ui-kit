import type { Meta, StoryContext, StoryObj } from '@storybook/react'
import React from 'react'
import axiosInstance from '../../../../../app/storybook/src/axios'
import {
  quotedStringRegex,
  RelativeTimeRange,
  Sort,
  storybookCodeTemplate,
  useStorybookAccessToken
} from '../../helpers'
import { Leaderboard as LeaderboardSource, LeaderboardComponent } from './Leaderboard'
import './Leaderboard.stories.css'
import rawLeaderboardCss from '!!raw-loader!./Leaderboard.stories.css'

const meta: Meta<typeof LeaderboardComponent> = {
  title: 'Components/Leaderboard',
  component: LeaderboardComponent,
  parameters: {
    controls: { sort: 'alpha' },
    imports: 'Leaderboard, RelativeTimeRange',
    transformBody: (body: string) => body.replace(quotedStringRegex('LAST_N_DAYS'), 'RelativeTimeRange.LastNDays'),
    codeTemplate: storybookCodeTemplate
  }
}

export default meta

type Story = StoryObj<typeof LeaderboardComponent>

const barHeaders = ['DATA_SOURCE_TYPE', 'value']
const barRows = [
  ['Http', '7498734'],
  ['Snowflake', '6988344'],
  ['S3', '203245'],
  ['Redshift', '19594']
]

const tableHeaders = ['Book title', 'Total sold']
const tableRows = [
  ["John's way or Highway", '12863002'],
  ['How to Speak Native Animal', '7865371'],
  ['Cell Lost in a Sea of Desert', '622027'],
  ['Flying nowhere special', '462791'],
  ['The Lean Product Book', '1']
]

const tableStringHeaders = ['Book title', 'value']

const tableStringRows = [
  ["John's way or Highway", 'John Doe'],
  ['How to Speak Native Animal', 'John Doe'],
  ['Cell Lost in a Sea of Desert', 'John Doe'],
  ['Flying nowhere special', 'John Doe'],
  ['The Lean Product Book', 'John Doe']
]

const Leaderboard = (args: Story['args']) => {
  const { accessToken } = useStorybookAccessToken(axiosInstance)
  const ref = React.useRef(null)

  if (!accessToken && args?.query) {
    return null
  }

  return (
    <LeaderboardSource
      ref={ref}
      {...{
        ...args,
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

const connectedParams = {
  accessToken: '<PROPEL_ACCESS_TOKEN>',
  metric: process.env.STORYBOOK_METRIC_UNIQUE_NAME_1,
  timeRange: {
    relative: RelativeTimeRange.LastNDays,
    n: 30
  },
  rowLimit: 5,
  dimensions: [
    {
      columnName: process.env.STORYBOOK_DIMENSION_1 as string
    }
  ],
  sort: Sort.Asc
}

export const SingleDimensionStory: Story = {
  name: 'Single dimension',
  args: {
    query: connectedParams,
    card: true
  },
  render: (args) => <Leaderboard {...args} />
}

export const SingleDimensionTableVariantStory: Story = {
  name: 'Single dimension table variant',
  args: {
    variant: 'table',
    headers: [process.env.STORYBOOK_DIMENSION_1 as string, 'Value'],
    card: true,
    query: connectedParams
  },
  render: (args) => <Leaderboard {...args} />
}

export const SingleDimensionTableVariantWithValueBarStory: Story = {
  name: 'Single dimension table variant with value bar',
  args: {
    variant: 'table',
    headers: [process.env.STORYBOOK_DIMENSION_1 as string, 'Value'],
    card: true,
    query: connectedParams,
    tableProps: {
      stickyHeader: true,
      hasValueBar: true,
      localize: true
    }
  },
  render: (args) => <Leaderboard {...args} />
}

export const StaticStory: Story = {
  name: 'Static',
  args: {
    headers: barHeaders,
    rows: barRows,
    card: true
  },
  render: (args) => <Leaderboard {...args} />
}

export const CustomStyleStory: Story = {
  name: 'Custom styles',
  tags: ['pattern'],
  parameters: {
    imports: 'Leaderboard',
    rawCss: `
      // Leaderboard.css

      ${rawLeaderboardCss}
    `,
    codeTemplate: (body: string, context: StoryContext): string => `
      // Leaderboard.tsx
      
      import { ${context?.parameters?.imports ?? ''} } from '@propeldata/ui-kit'
      import './Leaderboard.css'

      function ${context?.parameters?.componentName ?? `${context.title.split('/').pop()}Component`}() {
        return (
            ${context?.parameters?.transformBody ? context?.parameters?.transformBody(body) : body}
        )
      }
    `
  },
  args: {
    variant: 'table',
    headers: tableHeaders,
    rows: tableRows,
    className: 'custom-leaderboard',
    tableProps: {
      hasValueBar: true,
      stickyHeader: true
    }
  },
  render: (args) => <Leaderboard {...args} />
}

export const StringValuesStory: Story = {
  name: 'String values',
  args: {
    variant: 'table',
    headers: tableStringHeaders,
    rows: tableStringRows
  },
  render: (args) => <Leaderboard {...args} />
}
