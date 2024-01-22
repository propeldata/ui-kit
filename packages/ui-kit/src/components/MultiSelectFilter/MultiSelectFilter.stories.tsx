import React from 'react'

import { Meta, StoryObj } from '@storybook/react'
import axiosInstance from '../../../../../app/storybook/src/axios'
import {
  quotedStringRegex,
  RelativeTimeRange,
  storybookCodeTemplate,
  TimeSeriesGranularity,
  useStorybookAccessToken
} from '../../helpers'

import { MultiSelectFilter as MultiSelectFilterSource } from './MultiSelectFilter'
import { TimeSeries as TimeSeriesSource, TimeSeriesProps } from '../TimeSeries'
import { FilterProvider } from '../FilterProvider'

const meta: Meta<typeof MultiSelectFilterSource> = {
  title: 'Components/MultiSelectFilter',
  component: MultiSelectFilterSource,
  tags: ['tag'],
  parameters: {
    controls: { sort: 'alpha' },
    imports: 'SimpleFilter, FilterProvider',
    transformBody: (body: string) => body.replace(quotedStringRegex('LAST_N_DAYS'), 'RelativeTimeRange.LastNDays'),
    codeTemplate: storybookCodeTemplate
  }
}

export default meta

type Story = StoryObj<typeof MultiSelectFilterSource>

const MultiSelectFilter = (args: Story['args']) => {
  const { accessToken } = useStorybookAccessToken(axiosInstance)

  if (!accessToken && args?.query) {
    return null
  }

  return (
    <MultiSelectFilterSource
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
    columnName: 'Color',
    options: ['Red', 'Green', 'Blue'],
    selectProps: { placeholder: 'Select a color' }
  },
  render: (args) => (
    <FilterProvider>
      <MultiSelectFilter {...args} />
    </FilterProvider>
  )
}

export const StaticCustomLabelStory: Story = {
  name: 'Static Custom Label',
  args: {
    columnName: 'Color',
    options: [
      { label: 'Red', value: '#FF0000' },
      { label: 'Green', value: '#00FF00' },
      { label: 'Blue', value: '#0000FF' }
    ],
    selectProps: { placeholder: 'Select a color' }
  },
  render: (args) => (
    <FilterProvider>
      <MultiSelectFilter {...args} />
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
    selectProps: {
      placeholder: 'Select a sauce name'
    }
  },
  render: (args) => (
    <FilterProvider>
      <MultiSelectFilter {...args} />
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
    selectProps: {
      placeholder: 'Select a sauce name'
    }
  },
  render: (args) => (
    <FilterProvider>
      <MultiSelectFilter {...args} />
      <MultiSelectFilter
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
        selectProps={{
          placeholder: 'Select a taco name',
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
    selectProps: {
      placeholder: 'Select a sauce name'
    }
  },
  render: (args) => (
    <FilterProvider>
      <MultiSelectFilter {...args} />
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
