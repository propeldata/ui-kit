import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import axiosInstance from '../../../../../app/storybook/src/axios'
import {
  quotedStringRegex,
  RelativeTimeRange,
  storybookCodeTemplate,
  TimeSeriesGranularity,
  useStorybookAccessToken
} from '../../helpers'
import { FilterProvider } from '../FilterProvider/FilterProvider'
import { SimpleFilter as SimpleFilterSource } from './SimpleFilter'
import { TimeSeries as TimeSeriesSource, TimeSeriesProps } from '../TimeSeries'

const meta: Meta<typeof SimpleFilterSource> = {
  title: 'Components/SimpleFilter',
  component: SimpleFilterSource,
  tags: ['tag'],
  parameters: {
    controls: { sort: 'alpha' },
    imports: 'SimpleFilter, FilterProvider',
    transformBody: (body: string) => body.replace(quotedStringRegex('LAST_N_DAYS'), 'RelativeTimeRange.LastNDays'),
    codeTemplate: storybookCodeTemplate
  }
}

export default meta

type Story = StoryObj<typeof SimpleFilterSource>

const SimpleFilter = (args: Story['args']) => {
  const { accessToken } = useStorybookAccessToken(axiosInstance)

  if (!accessToken && args?.query) {
    return null
  }

  return (
    <SimpleFilterSource
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

const TimeSeries = (args: TimeSeriesProps) => {
  const { accessToken } = useStorybookAccessToken(axiosInstance)

  if (!accessToken && args?.query) {
    return null
  }

  return (
    <TimeSeriesSource
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

export const StaticStory: Story = {
  name: 'Static',
  args: {
    columnName: 'Column Name',
    options: ['Option 1', 'Option 2', 'Option 3']
  },
  render: (args) => (
    <FilterProvider>
      <SimpleFilter {...args} />
    </FilterProvider>
  )
}

export const ConnectedStory: Story = {
  name: 'Connected',
  args: {
    query: {
      columnName: process.env.STORYBOOK_DIMENSION_1 ?? '',
      dataPool: {
        name: process.env.STORYBOOK_DATA_POOL_UNIQUE_NAME_1 ?? ''
      },
      maxValues: 1000,
      timeRange: {
        relative: RelativeTimeRange.LastNDays,
        n: 30
      }
    }
  },
  render: (args) => (
    <FilterProvider>
      <SimpleFilter {...args} />
      <TimeSeries
        query={{
          metric: 'Revenue',
          timeRange: { relative: RelativeTimeRange.LastNDays, n: 30 },
          granularity: TimeSeriesGranularity.Day
        }}
      />
    </FilterProvider>
  )
}
