import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import axiosInstance from '../../../../../app/storybook/src/axios'
import { storybookCodeTemplate } from '../../helpers'
import { FilterProvider } from './FilterProvider'
import { useStorybookAccessToken } from '../../helpers/useStorybookAccessToken'
import { Counter } from '../Counter'
import { TimeSeries } from '../TimeSeries'
import { AccessTokenProvider } from '../AccessTokenProvider'
import { Leaderboard } from '../Leaderboard'
import { DataGrid } from '../DataGrid'
import { SimpleFilter } from '../SimpleFilter'
import { TimeRangePicker } from '../TimeRangePicker'
import { PieChart } from '../PieChart'
import { RelativeTimeRange } from '../../graphql'

const meta: Meta<typeof FilterProvider> = {
  title: 'Components/FilterProvider',
  component: FilterProvider,
  argTypes: {},
  tags: ['devOnly'],
  parameters: {
    controls: { sort: 'alpha' },
    codeTemplate: storybookCodeTemplate
  }
}

type Story = StoryObj<typeof FilterProvider>

export default meta

const TokenProvider = (props: { children: React.ReactNode }) => {
  const { accessToken } = useStorybookAccessToken(axiosInstance)

  return <AccessTokenProvider accessToken={accessToken} {...props} />
}

export const DefaultDataPool: Story = {
  render: (args) => (
    <TokenProvider>
      <FilterProvider {...args} defaultDataPool={{ name: 'TacoSoft Demo Data' }}>
        <SimpleFilter query={{ columnName: 'taco_name' }} />
        <TimeRangePicker />
        <Counter query={{ metric: { count: {} } }} />
        <TimeSeries query={{ metric: { count: {} } }} />
        <Leaderboard query={{ metric: { count: {} }, dimensions: [{ columnName: 'taco_name' }] }} />
        <DataGrid />
        <PieChart query={{ metric: { count: {} } }} />
      </FilterProvider>
    </TokenProvider>
  )
}

export const DefaultTimeRange: Story = {
  render: (args) => (
    <TokenProvider>
      <FilterProvider
        {...args}
        defaultDataPool={{ name: 'TacoSoft Demo Data' }}
        defaultTimeRange={{ timestamp: 'order_generated_at', relative: RelativeTimeRange.LastNDays, n: 7 }}
      >
        <TimeRangePicker />
        <TimeSeries query={{ metric: { count: {} } }} />
      </FilterProvider>
    </TokenProvider>
  )
}

export const PieChartGroupBy: Story = {
  render: (args) => (
    <TokenProvider>
      <FilterProvider
        {...args}
        defaultDataPool={{ name: 'TacoSoft Demo Data' }}
        defaultGroupBy={['restaurant_name', 'taco_name']}
      >
        <PieChart query={{ metric: { count: {} } }} showGroupByOther={false} />
      </FilterProvider>
    </TokenProvider>
  )
}

export const FilterSql: Story = {
  name: 'FilterSql',
  render: (args) => (
    <TokenProvider>
      <FilterProvider
        {...args}
        defaultDataPool={{ name: 'TacoSoft Demo Data' }}
        baseFilterSql="taco_name = 'Veggie' AND sauce_name = 'Queso Blanco'"
      >
        <SimpleFilter query={{ columnName: 'taco_name' }} />
        <SimpleFilter query={{ columnName: 'sauce_name' }} />
        <TimeRangePicker />
        <Counter query={{ metric: { count: {} } }} />
        <TimeSeries query={{ metric: { count: {} } }} />
        <Leaderboard query={{ metric: { count: {} }, dimensions: [{ columnName: 'taco_name' }] }} />
        <DataGrid />
        <PieChart query={{ metric: { count: {} } }} />
      </FilterProvider>
    </TokenProvider>
  )
}
