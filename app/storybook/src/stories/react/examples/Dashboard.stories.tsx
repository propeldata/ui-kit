import React from 'react'
import { Story } from '@storybook/react'
import { RelativeTimeRange, TimeSeriesGranularity } from '@propeldata/ui-kit-graphql'

import { Counter } from '@propeldata/react-counter'
import { TimeSeries } from '@propeldata/react-time-series'
import { Leaderboard } from '@propeldata/react-leaderboard'

import * as S from './styles'

export default {
  title: 'Examples/Dashboard',
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    (Story: Story) => (
      <S.Body>
        <Story />
      </S.Body>
    )
  ],
  argTypes: {
    query: {
      table: {
        disable: true
      }
    }
  }
}

const queryBase = {
  accessToken: process.env.STORYBOOK_PROPEL_ACCESS_TOKEN,
  metric: process.env.STORYBOOK_METRIC_UNIQUE_NAME_1,
  timeRange: {
    relative: RelativeTimeRange.LastNDays,
    n: 30
  }
}

const Template: Story = () => (
  <>
    <S.Nav>
      <S.NavContent>
        <S.NavItem selected>
          Sales
          <S.SelectedBar />
        </S.NavItem>

        <S.NavItem>Opportunity</S.NavItem>

        <S.NavItem>Accounting</S.NavItem>
      </S.NavContent>
    </S.Nav>
    <S.Main>
      <header>
        <h1>Inventory</h1>
      </header>
      <S.ProdsContainer>
        <S.Card>
          <S.CardHeader>Prod 1</S.CardHeader>
          <S.ProdValue>
            <Counter
              localize
              prefixValue="$"
              query={{
                ...queryBase
              }}
            />
          </S.ProdValue>
        </S.Card>
        <S.Card>
          <S.CardHeader>Prod 2</S.CardHeader>
          <S.ProdValue>
            <Counter
              localize
              prefixValue="$"
              query={{
                ...queryBase
              }}
            />
          </S.ProdValue>
        </S.Card>
        <S.Card>
          <S.CardHeader>Prod 3</S.CardHeader>
          <S.ProdValue>
            <Counter
              localize
              prefixValue="$"
              query={{
                ...queryBase
              }}
            />
          </S.ProdValue>
        </S.Card>
        <S.Card>
          <S.CardHeader>Prod 4</S.CardHeader>
          <S.ProdValue>
            <Counter
              localize
              prefixValue="$"
              query={{
                ...queryBase
              }}
            />
          </S.ProdValue>
        </S.Card>
      </S.ProdsContainer>
      <S.DashboardGrid>
        <S.SalesCard>
          <h2>Sales</h2>
          <TimeSeries
            query={{ ...queryBase, granularity: TimeSeriesGranularity.Week }}
            variant="line"
            styles={{ line: { borderColor: '#2566EA' } }}
          />
        </S.SalesCard>
        <S.TopStoresCard>
          <Leaderboard
            query={{
              ...queryBase,
              rowLimit: 10,
              dimensions: [
                {
                  columnName: process.env.STORYBOOK_DIMENSION_1 as string
                }
              ]
            }}
            styles={{ canvas: { height: 500 }, bar: { borderColor: '#2566EA', backgroundColor: '#2566EA' } }}
          />
        </S.TopStoresCard>
        <S.TargetCard>
          <Counter query={{ ...queryBase }} styles={{ font: { size: '3rem' } }} />
          <h3>Sales</h3>
        </S.TargetCard>
        <S.SalesVolumeCard>
          <h3>Sales Volume</h3>
          <S.SalesVolumeChartContainer>
            <TimeSeries
              query={{ ...queryBase, granularity: TimeSeriesGranularity.Week }}
              styles={{ canvas: { width: 500 }, bar: { borderColor: '#2566EA', backgroundColor: '#2566EA' } }}
            />
          </S.SalesVolumeChartContainer>
        </S.SalesVolumeCard>
      </S.DashboardGrid>
    </S.Main>
  </>
)
export const Dashboard = Template.bind({})
