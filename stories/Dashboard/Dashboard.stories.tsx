import React from 'react'
import { Story } from '@storybook/react'
import { RelativeTimeRange, TimeSeriesGranularity } from '@propeldata/ui-kit-graphql'

import { Counter } from '../../packages/react/counter/dist'
import { TimeSeries } from '../../packages/react/time-series/dist'

import * as S from './styles'

export default {
  title: 'Examples/Dashboard',
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    (Story) => (
      <S.Body>
        <Story />
      </S.Body>
    )
  ]
}

const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3RpbWUiOjE2NzQ1NzMxOTYsImNsaWVudF9pZCI6Ijd0dDVpbDE5MmhsYmthZGYwY2NnNGk3c3Q2IiwiZXhwIjoxNjc0NTc2Nzk2LCJpYXQiOjE2NzQ1NzMxOTYsImlzcyI6Imh0dHBzOi8vYXV0aC51cy1lYXN0LTIuZGV2LnByb3BlbGRhdGEuY29tIiwianRpIjoiMjk4MDI3NzctZGNhNi00OWIwLWFiOTctMzM1YzEyNGVkNWQ2IiwicHJvcGVsL3RlbmFudCI6IkVOVjAxR0paRzIyNlk3SFlISjNGQkg1NzAwR1I5Iiwic2NvcGUiOiJtZXRyaWM6cXVlcnkgcHJvcGVsL21ldHJpYzpxdWVyeSIsInN1YiI6Ijd0dDVpbDE5MmhsYmthZGYwY2NnNGk3c3Q2IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwidmVyc2lvbiI6MX0.6Oy7QNjhbuC9PC_ZiCt0roIkgC_BLUf9ZW3xe9qQaZE'

const queryBase = {
  accessToken,
  metric: 'syncRecordsAdded',
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
        <S.TopStoresCard>Leaderboard</S.TopStoresCard>
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
