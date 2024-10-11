import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { storybookCodeTemplate, useStorybookAccessToken } from '../../helpers'
import axiosInstance from '../../../../../app/storybook/src/axios'
import { GroupBy as GroupBySource } from './GroupBy'
import { FilterProvider } from '../FilterProvider'
import { TimeSeries as TimeSeriesSource, TimeSeriesQueryProps } from '../TimeSeries'
import { RelativeTimeRange, TimeSeriesGranularity } from '../../graphql'

const meta: Meta<typeof GroupBySource> = {
  title: 'Components/GroupBy',
  component: GroupBySource,
  tags: ['autodocs'],
  argTypes: {
    // Add any specific argTypes here if needed
  },
  parameters: {
    controls: { sort: 'alpha' },
    imports: 'GroupBy',
    codeTemplate: storybookCodeTemplate
  }
}

export default meta

const GroupBy = (args: Story['args']) => {
  const { accessToken } = useStorybookAccessToken(axiosInstance)

  if (args == null || (!accessToken && args?.query)) {
    return null
  }

  return (
    <GroupBySource
      {...{
        ...args,
        query: args.query
          ? {
              ...args.query,
              accessToken
            }
          : undefined
      }}
    />
  )
}

const TimeSeries = (args: StoryObj<typeof TimeSeriesSource>['args']) => {
  const { accessToken } = useStorybookAccessToken(axiosInstance)

  if (args == null || (!accessToken && args?.query)) {
    return null
  }

  return (
    // @ts-expect-error storybook types are not correct
    <TimeSeriesSource
      {...{
        ...args,
        query: args.query
          ? {
              ...args.query,
              accessToken
            }
          : undefined
      }}
    />
  )
}

type Story = StoryObj<typeof GroupBySource>

export const Default: Story = {
  args: {
    query: {
      dataPool: {
        id: 'DPO01HGV9XN1E13EYY4NJQM12RJ9E'
      }
    }
  },
  render: (args) => (
    <FilterProvider>
      <GroupBy {...args} />
    </FilterProvider>
  )
}

const timeSeriesConnectedParams: TimeSeriesQueryProps = {
  accessToken: '<PROPEL_ACCESS_TOKEN>',
  metric: process.env.STORYBOOK_METRIC_UNIQUE_NAME_1,
  timeRange: {
    relative: RelativeTimeRange.LastNDays,
    n: 90
  },
  granularity: TimeSeriesGranularity.Day
}

export const Example: Story = {
  args: {
    query: {
      dataPool: {
        id: 'DPO01HGV9XN1E13EYY4NJQM12RJ9E'
      }
    }
  },
  render: (args) => (
    <FilterProvider>
      <GroupBy {...args} />
      <TimeSeries variant="line" card={true} accentColors={['#ff0000']} query={timeSeriesConnectedParams} />
    </FilterProvider>
  )
}
