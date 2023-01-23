import React from 'react'
import { Story } from '@storybook/react'
import { Counter } from '../packages/react/counter'
import { TimeSeries } from '../packages/react/time-series'
import { RelativeTimeRange, TimeSeriesGranularity } from '../packages/core/graphql'

import * as S from './styles'

import './main.css'

export default {
  title: 'Examples/Dashboard'
}

const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3RpbWUiOjE2NzQ1MTY1ODYsImNsaWVudF9pZCI6Ijd0dDVpbDE5MmhsYmthZGYwY2NnNGk3c3Q2IiwiZXhwIjoxNjc0NTIwMTg2LCJpYXQiOjE2NzQ1MTY1ODYsImlzcyI6Imh0dHBzOi8vYXV0aC51cy1lYXN0LTIuZGV2LnByb3BlbGRhdGEuY29tIiwianRpIjoiNDNjOWQ1NGYtOTlmMS00MjZiLWI2YzgtYzU0MmQ0MGE1YWI4IiwicHJvcGVsL3RlbmFudCI6IkVOVjAxRlgzNjA2UjJLUUZRWVhYMzRBOTZRNlpSIiwic2NvcGUiOiJtZXRyaWM6cXVlcnkgcHJvcGVsL21ldHJpYzpxdWVyeSIsInN1YiI6Ijd0dDVpbDE5MmhsYmthZGYwY2NnNGk3c3Q2IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwidmVyc2lvbiI6MX0.2dZr-Y2EdIDpesaQq87uWdl8w6VlqvP9bhrG-_WBvOA'

const queryBase = {
  accessToken,
  metric: 'syncRecordsAdded',
  timeRange: {
    relative: RelativeTimeRange.LastNDays,
    n: 3
  }
}

const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const values = [0, 1000, 200, 3000, 4000, 500, 7000]

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
          <TimeSeries query={{ ...queryBase, granularity: TimeSeriesGranularity.Week }} />
        </S.SalesCard>
        <S.TopStoresCard></S.TopStoresCard>
        <S.TargetCard></S.TargetCard>
        <S.SalesVolumeCard></S.SalesVolumeCard>
      </S.DashboardGrid>
    </S.Main>
  </>
)
export const Dashboard = Template.bind({})
