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

export const StaticCustomLabelStory: Story = {
  name: 'Static Custom Label',
  args: {
    columnName: 'Column Name',
    options: [
      { label: 'Option 1', value: 'option_1' },
      { label: 'Option 2', value: 'option_2' }
    ]
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
    },
    autocompleteProps: {
      placeholder: 'Search or type a sauce name'
    }
  },
  render: (args) => (
    <FilterProvider>
      <SimpleFilter {...args} />
      <TimeSeries
        card
        query={{
          metric: 'Revenue',
          timeRange: { relative: RelativeTimeRange.LastNDays, n: 30 },
          granularity: TimeSeriesGranularity.Day
        }}
        style={{ marginTop: '1rem' }}
      />
    </FilterProvider>
  )
}

export const MultipleStory: Story = {
  name: 'Multiple',
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
    },
    autocompleteProps: {
      placeholder: 'Search or type a sauce name'
    }
  },
  render: (args) => (
    <FilterProvider>
      <SimpleFilter {...args} />
      <SimpleFilter
        query={{
          columnName: 'taco_name',
          dataPool: {
            name: 'TacoSoft Demo Data'
          },
          maxValues: 1000,
          timeRange: {
            relative: RelativeTimeRange.LastNDays,
            n: 30
          }
        }}
        autocompleteProps={{
          placeholder: 'Search or type a taco name',
          containerStyle: { marginTop: '12px' }
        }}
      />
      <TimeSeries
        card
        query={{
          metric: 'Revenue',
          timeRange: { relative: RelativeTimeRange.LastNDays, n: 30 },
          granularity: TimeSeriesGranularity.Day
        }}
        style={{ marginTop: '12px' }}
      />
    </FilterProvider>
  )
}

export const FreeSoloStory: Story = {
  name: 'FreeSolo',
  args: {
    query: {
      columnName: process.env.STORYBOOK_DIMENSION_1 ?? '',
      dataPool: {
        name: process.env.STORYBOOK_DATA_POOL_UNIQUE_NAME_1 ?? ''
      },
      maxValues: 3,
      timeRange: {
        relative: RelativeTimeRange.LastNDays,
        n: 30
      }
    },
    autocompleteProps: {
      placeholder: 'Search or type a sauce name',
      freeSolo: true
    }
  },
  render: (args) => (
    <FilterProvider>
      <SimpleFilter {...args} />
      <TimeSeries
        card
        query={{
          metric: 'Revenue',
          timeRange: { relative: RelativeTimeRange.LastNDays, n: 30 },
          granularity: TimeSeriesGranularity.Day
        }}
        style={{ marginTop: '1rem' }}
      />
    </FilterProvider>
  )
}

export const ErrorStory: Story = {
  name: 'Error',
  args: {
    query: {
      columnName: 'sauce_name',
      dataPool: {
        name: 'invalid_data_pool_name'
      },
      maxValues: 3,
      timeRange: {
        relative: RelativeTimeRange.LastNDays,
        n: 30
      },
      retry: false
    },
    autocompleteProps: {
      placeholder: 'Search or type a sauce name'
    }
  },
  render: (args) => (
    <FilterProvider>
      <SimpleFilter {...args} />
      <TimeSeries
        card
        query={{
          metric: 'Revenue',
          timeRange: { relative: RelativeTimeRange.LastNDays, n: 30 },
          granularity: TimeSeriesGranularity.Day
        }}
        style={{ marginTop: '1rem' }}
      />
    </FilterProvider>
  )
}
