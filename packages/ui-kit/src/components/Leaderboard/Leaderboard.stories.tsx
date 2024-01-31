import type { Meta, StoryContext, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
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
import { DefaultThemes, ThemeProvider } from '../ThemeProvider'
import { ThemeTokenProps } from '../../themes'

const meta: Meta<typeof LeaderboardComponent> = {
  title: 'Components/Leaderboard',
  component: LeaderboardComponent,
  argTypes: {
    baseTheme: {
      table: {
        disable: true
      }
    }
  },
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

const connectedParamsMultiDimensional = {
  ...connectedParams,
  dimensions: [
    {
      columnName: process.env.STORYBOOK_DIMENSION_1 as string
    },
    {
      columnName: process.env.STORYBOOK_DIMENSION_2 as string
    },
    {
      columnName: process.env.STORYBOOK_DIMENSION_3 as string
    }
  ]
}

export const SingleDimensionBarStory: Story = {
  name: 'Single dimension Bar',
  args: {
    query: connectedParams,
    card: true
  },
  render: (args) => <Leaderboard {...args} />
}

export const SingleDimensionBarWithValuesStory: Story = {
  name: 'Single dimension Bar with values',
  args: {
    query: connectedParams,
    card: true,
    chartProps: {
      showBarValues: true
    }
  },
  render: (args) => <Leaderboard {...args} />
}

export const SingleDimensionTableStory: Story = {
  name: 'Single dimension Table',
  args: {
    variant: 'table',
    headers: [process.env.STORYBOOK_DIMENSION_1 as string, 'Value'],
    card: true,
    query: connectedParams
  },
  render: (args) => <Leaderboard {...args} />
}

export const SingleDimensionTableWithValueBarStory: Story = {
  name: 'Single dimension Table with Value Bar',
  args: {
    variant: 'table',
    headers: [process.env.STORYBOOK_DIMENSION_1 as string, 'Value'],
    card: true,
    query: connectedParams,
    tableProps: {
      hasValueBar: true
    }
  },
  render: (args) => <Leaderboard {...args} />
}

export const MultiDimensionTableStory: Story = {
  name: 'Multidimensional Table',
  args: {
    variant: 'table',
    query: connectedParamsMultiDimensional,
    card: true
  },
  render: (args) => <Leaderboard {...args} />
}

export const MultiDimensionTableWithValueBarStory: Story = {
  name: 'Multidimensional Table with Value Bar',
  args: {
    variant: 'table',
    query: connectedParamsMultiDimensional,
    card: true,
    tableProps: {
      hasValueBar: true
    }
  },
  render: (args) => <Leaderboard {...args} />
}

export const MultiDimensionTableWithStickyValuesStory: Story = {
  name: 'Multidimensional Table with sticky values',
  args: {
    variant: 'table',
    style: {
      width: '250px'
    },
    query: connectedParamsMultiDimensional,
    card: true,
    tableProps: {
      stickyValues: true
    }
  },
  render: (args) => <Leaderboard {...args} />
}

export const MultiDimensionTableWithStickyValuesAndValueBarStory: Story = {
  name: 'Multidimensional Table with sticky values and Value Bar',
  args: {
    variant: 'table',
    style: {
      width: '350px'
    },
    query: connectedParamsMultiDimensional,
    card: true,
    tableProps: {
      stickyValues: true,
      hasValueBar: true
    }
  },
  render: (args) => <Leaderboard {...args} />
}

export const MultiDimensionBarStory: Story = {
  name: 'Multidimensional Bar',
  args: {
    query: connectedParamsMultiDimensional,
    card: true
  },
  render: (args) => <Leaderboard {...args} />
}

export const MultiDimensionBarInsideStory: Story = {
  name: 'Multidimensional Bar with labels inside bars',
  args: {
    query: connectedParamsMultiDimensional,
    card: true,
    chartProps: {
      labelPosition: 'inside'
    }
  },
  render: (args) => <Leaderboard {...args} />
}

export const MultiDimensionBarTopStory: Story = {
  name: 'Multidimensional Bar with labels on top of the bars',
  args: {
    query: connectedParamsMultiDimensional,
    card: true,
    chartProps: {
      labelPosition: 'top'
    }
  },
  render: (args) => <Leaderboard {...args} />
}

export const StaticStory: Story = {
  name: 'Static Bar with numeric values',
  args: {
    headers: barHeaders,
    rows: barRows,
    card: true
  },
  render: (args) => <Leaderboard {...args} />
}

export const StringValuesStory: Story = {
  name: 'Static Table with string values',
  args: {
    variant: 'table',
    headers: tableStringHeaders,
    rows: tableStringRows,
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

export const ThemeStory: Story = {
  name: 'Theme',
  args: {
    headers: barHeaders,
    rows: barRows,
    card: true
  },
  decorators: [
    (Story) => {
      const [baseTheme, setBaseTheme] = useState<DefaultThemes>('lightTheme')

      const lightColors: ThemeTokenProps = {
        accent: '#3d3d3d',
        accentHover: '#3d3d3dc6'
      }

      const darkColors: ThemeTokenProps = {
        accent: '#adadad',
        accentHover: '#ffffffc6'
      }

      const theme = baseTheme === 'darkTheme' ? darkColors : lightColors

      return (
        <ThemeProvider baseTheme={baseTheme} theme={theme}>
          <div style={{ margin: '10px', display: 'flex', gap: '8px' }}>
            <button type="button" onClick={() => setBaseTheme(baseTheme === 'darkTheme' ? 'lightTheme' : 'darkTheme')}>
              Switch theme
            </button>
            <span>{baseTheme}</span>
          </div>
          <Story />
        </ThemeProvider>
      )
    }
  ],
  render: (args) => <Leaderboard {...args} />
}
