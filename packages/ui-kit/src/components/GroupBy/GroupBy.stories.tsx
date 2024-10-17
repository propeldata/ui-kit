import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { storybookCodeTemplate, useStorybookAccessToken } from '../../helpers'
import axiosInstance from '../../../../../app/storybook/src/axios'
import { GroupBy as GroupBySource } from './GroupBy'
import { FilterProvider } from '../FilterProvider'
import { TimeSeries as TimeSeriesSource, TimeSeriesQueryProps } from '../TimeSeries'
import { RelativeTimeRange, TimeSeriesGranularity } from '../../graphql'
import { Leaderboard as LeaderboardSource, LeaderboardQueryProps } from '../Leaderboard'
import { PieChart as PieChartSource } from '../PieChart'

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

const timeSeriesConnectedParams: TimeSeriesQueryProps = {
  accessToken: '<PROPEL_ACCESS_TOKEN>',
  metric: process.env.STORYBOOK_METRIC_UNIQUE_NAME_1,
  timeRange: {
    relative: RelativeTimeRange.LastNDays,
    n: 90
  },
  granularity: TimeSeriesGranularity.Day
}

const TimeSeries = () => {
  const { accessToken } = useStorybookAccessToken(axiosInstance)

  if (accessToken == null) {
    return null
  }

  return (
    <TimeSeriesSource
      query={{
        ...timeSeriesConnectedParams,
        accessToken
      }}
      variant="line"
      card
    />
  )
}

const leaderboardConnectedParams: LeaderboardQueryProps = {
  accessToken: '<PROPEL_ACCESS_TOKEN>',
  metric: process.env.STORYBOOK_METRIC_UNIQUE_NAME_1,
  timeRange: {
    relative: RelativeTimeRange.LastNDays,
    n: 90
  }
}

const Leaderboard = () => {
  const { accessToken } = useStorybookAccessToken(axiosInstance)

  if (accessToken == null) {
    return null
  }

  return <LeaderboardSource card query={{ ...leaderboardConnectedParams, accessToken }} />
}

const PieChart = (args: StoryObj<typeof PieChartSource>['args']) => {
  const { accessToken } = useStorybookAccessToken(axiosInstance)

  if (args == null || (!accessToken && args?.query)) {
    return null
  }

  return <PieChartSource card query={{ ...leaderboardConnectedParams, accessToken }} />
}

type Story = StoryObj<typeof GroupBySource>

export const Default: Story = {
  args: {
    query: {
      dataPool: {
        name: process.env.STORYBOOK_DATA_POOL_UNIQUE_NAME_1
      }
    }
  },
  render: (args) => (
    <FilterProvider>
      <GroupBy {...args} />
    </FilterProvider>
  )
}

export const Example: Story = {
  args: {
    query: {
      dataPool: {
        name: process.env.STORYBOOK_DATA_POOL_UNIQUE_NAME_1
      }
    }
  },
  render: (args) => (
    <FilterProvider>
      <GroupBy {...args} />
      <TimeSeries />
    </FilterProvider>
  )
}

export const PieAndLeaderboard: Story = {
  args: {
    query: {
      dataPool: {
        name: process.env.STORYBOOK_DATA_POOL_UNIQUE_NAME_1
      }
    }
  },
  render: (args) => (
    <FilterProvider emptyGroupBy={['taco_name']} maxGroupBy={5}>
      <GroupBy {...args} />
      <PieChart />
      <Leaderboard />
    </FilterProvider>
  )
}

export const Prettified: Story = {
  args: {
    query: {
      dataPool: {
        name: process.env.STORYBOOK_DATA_POOL_UNIQUE_NAME_1
      }
    },
    prettifyColumnNames: true,
    includeColumns: ['taco_name']
  },
  render: (args) => (
    <FilterProvider>
      <GroupBy {...args} />
      <TimeSeries />
    </FilterProvider>
  )
}

export const IncludeColumns: Story = {
  args: {
    query: {
      dataPool: {
        name: process.env.STORYBOOK_DATA_POOL_UNIQUE_NAME_1
      }
    },
    prettifyColumnNames: true,
    includeColumns: ['taco_name', 'restaurant_name']
  },
  render: (args) => (
    <FilterProvider>
      <GroupBy {...args} />
      <TimeSeries />
    </FilterProvider>
  )
}
