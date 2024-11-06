import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import axiosInstance from '../../../../../app/storybook/src/axios'
import { quotedStringRegex, storybookCodeTemplate, useStorybookAccessToken } from '../../helpers'
import { TimeGrainPicker } from './TimeGrainPicker'
import { TimeSeries as TimeSeriesSource, TimeSeriesProps } from '../TimeSeries'
import { FilterProvider } from '../FilterProvider'
import { RelativeTimeRange, TimeSeriesGranularity } from '../../graphql'

const meta: Meta<typeof TimeGrainPicker> = {
  title: 'Components/TimeGrainPicker',
  component: TimeGrainPicker,
  tags: ['tag'],
  parameters: {
    controls: { sort: 'alpha' },
    imports: 'TimeGrainPicker, FilterProvider',
    transformBody: (body: string) => body.replace(quotedStringRegex('LAST_N_DAYS'), 'RelativeTimeRange.LastNDays'),
    codeTemplate: storybookCodeTemplate
  }
}

export default meta

type Story = StoryObj<typeof TimeGrainPicker>

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

export const SingleStory: Story = {
  name: 'Simple',
  args: {
    selectProps: {
      placeholder: 'Granularity'
    },
    defaultOpen: true
  },
  render: (args) => (
    <FilterProvider>
      <TimeGrainPicker {...args} />
      <TimeSeries
        card
        query={{
          metric: 'Revenue',
          timeRange: { relative: RelativeTimeRange.LastNDays, n: 30 }
        }}
        style={{ marginTop: '1rem' }}
      />
    </FilterProvider>
  )
}

export const CustomOptionsStory: Story = {
  name: 'Custom Options',
  args: {
    selectProps: {
      placeholder: 'Granularity'
    },
    options: [TimeSeriesGranularity.Day, TimeSeriesGranularity.Week, TimeSeriesGranularity.Month]
  },
  render: (args) => (
    <FilterProvider>
      <TimeGrainPicker {...args} />
      <TimeSeries
        card
        query={{
          metric: 'Revenue',
          timeRange: { relative: RelativeTimeRange.LastNDays, n: 30 }
        }}
        style={{ marginTop: '1rem' }}
      />
    </FilterProvider>
  )
}
