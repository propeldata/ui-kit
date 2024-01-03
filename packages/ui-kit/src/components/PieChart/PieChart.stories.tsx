import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import axiosInstance from '../../../../../app/storybook/src/axios'
import {
  quotedStringRegex,
  RelativeTimeRange,
  Sort,
  storybookCodeTemplate,
  useStorybookAccessToken
} from '../../helpers'
import { PieChart as PieChartSource, PieChartComponent } from './PieChart'

const meta: Meta<typeof PieChartComponent> = {
  title: 'Components/PieChart',
  component: PieChartComponent,
  argTypes: {
    baseTheme: {
      table: {
        disable: true
      }
    }
  },
  parameters: {
    controls: { sort: 'alpha' },
    imports: 'PieChart, RelativeTimeRange',
    transformBody: (body: string) => body.replace(quotedStringRegex('LAST_N_DAYS'), 'RelativeTimeRange.LastNDays'),
    codeTemplate: storybookCodeTemplate
  }
}

export default meta

type Story = StoryObj<typeof PieChartComponent>

const pieHeaders = ['DATA_SOURCE_TYPE', 'value']
const pieRows = [
  ['Http', '7498'],
  ['Snowflake', '1285'],
  ['S3', '10345'],
  ['Redshift', '15944']
]
const PieChart = (args: Story['args']) => {
  const { accessToken } = useStorybookAccessToken(axiosInstance)
  const ref = React.useRef(null)

  if (!accessToken && args?.query) {
    return null
  }

  return (
    <PieChartSource
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

export const SingleDimensionPieStory: Story = {
  name: 'Single dimension Pie',
  args: {
    query: connectedParams,
    card: true
  },
  render: (args) => <PieChart {...args} />
}

export const SingleDimensionDoughnutStory: Story = {
  name: 'Single dimension Doughnut',
  args: {
    variant: 'doughnut',
    query: connectedParams,
    card: true
  },
  render: (args) => <PieChart {...args} />
}

export const StaticPieStory: Story = {
  name: 'Static Pie with values',
  args: {
    headers: pieHeaders,
    rows: pieRows,
    card: true
  },
  render: (args) => <PieChart {...args} />
}

export const StaticDoughnutStory: Story = {
  name: 'Static Doughnut with values',
  args: {
    variant: 'doughnut',
    headers: pieHeaders,
    rows: pieRows,
    card: true
  },
  render: (args) => <PieChart {...args} />
}
