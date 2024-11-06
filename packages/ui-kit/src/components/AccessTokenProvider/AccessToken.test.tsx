import { render } from '@testing-library/react'
import React from 'react'
import {
  CounterQuery,
  LeaderboardQuery,
  RelativeTimeRange,
  TimeSeriesGranularity,
  TimeSeriesQuery
} from '../../graphql'

import { Dom, mockCounterQuery, mockLeaderboardQuery, mockTimeSeriesQuery, setupTestHandlers } from '../../testing'
import { Counter } from '../Counter'
import { Leaderboard } from '../Leaderboard'
import { TimeSeries } from '../TimeSeries'
import { AccessTokenProviderProps } from './AccessTokenProvider.types'
import { AccessTokenProvider } from './AccessTokenProvider'

const counterResponse: CounterQuery = {
  counter: {
    value: '123'
  }
}

const timeSeriesResponse: TimeSeriesQuery = {
  timeSeries: {
    labels: ['2021-01-01', '2021-01-02'],
    values: ['1', '2']
  }
}

const leaderboardResponse: LeaderboardQuery = {
  leaderboard: {
    headers: ['header1', 'header2'],
    rows: [
      ['row1col1', 'row1col2'],
      ['row2col1', 'row2col2']
    ]
  }
}

const componentHandlers = [mockCounterQuery, mockTimeSeriesQuery, mockLeaderboardQuery]

const handlers = componentHandlers.map((handler) =>
  handler((req, res, ctx) => {
    const authorizationHeader = req.headers.get('Authorization')
    const accessToken = authorizationHeader?.split(' ')[1]

    const variables = req.variables

    const isCounter = 'counterInput' in variables
    const isTimeSeries = 'timeSeriesInput' in variables
    const isLeaderboard = 'leaderboardInput' in variables

    const responseData =
      (isCounter && counterResponse) || (isTimeSeries && timeSeriesResponse) || (isLeaderboard && leaderboardResponse)

    if (accessToken === 'valid-token') {
      return res(ctx.data(responseData))
    }

    return res(ctx.status(401), ctx.errors([{ message: 'AuthenticationError' }]))
  })
)

jest.mock('../../helpers', () => {
  const actual = jest.requireActual('../../helpers')
  return {
    ...actual,
    sleep: jest.fn()
  }
})

describe('AccessTokenProvider', () => {
  let dom: Dom

  beforeEach(() => {
    setupTestHandlers(handlers)
  })

  it('should provide the static accessToken to the child components', async () => {
    dom = render(<DashboardComponent accessToken="valid-token" />)

    await dom.findByText(counterResponse?.counter?.value as string)
    const charts = await dom.findAllByRole('img')

    expect(charts).toHaveLength(2)
  })

  it('should fetch the accessToken and provide it to the child components', async () => {
    const fetchToken = jest.fn(async () => 'valid-token')

    dom = render(<DashboardComponent fetchToken={fetchToken} />)

    await dom.findByText(counterResponse?.counter?.value as string)
    const charts = await dom.findAllByRole('img')

    expect(charts).toHaveLength(2)
  })

  it('should re-fetch the accessToken when the request fails', async () => {
    const createTokenFetcher = () => {
      let fetchCount = 0

      return jest.fn(async () => {
        fetchCount++
        if (fetchCount === 1) {
          throw new Error()
        }

        return 'valid-token'
      })
    }

    const fetchToken = createTokenFetcher()

    dom = render(<DashboardComponent fetchToken={fetchToken} />)

    await dom.findByText(counterResponse?.counter?.value as string)
    const charts = await dom.findAllByRole('img')

    expect(charts).toHaveLength(2)

    expect(fetchToken).toHaveBeenCalledTimes(2)
  })

  it('should refetch accessToken after interval', async () => {
    jest.useFakeTimers()

    const fetchToken = jest.fn(async () => 'valid-token')

    dom = render(<DashboardComponent fetchToken={fetchToken} />)

    await dom.findByText(counterResponse?.counter?.value as string)
    const charts = await dom.findAllByRole('img')

    expect(charts).toHaveLength(2)

    expect(fetchToken).toHaveBeenCalledTimes(1)

    jest.runOnlyPendingTimers() // Jest will finish the interval timer

    expect(fetchToken).toHaveBeenCalledTimes(2)
  })
})

function DashboardComponent(props: AccessTokenProviderProps) {
  const queryInput = { metric: 'revenue', timeRange: { relative: RelativeTimeRange.LastNDays, n: 30 }, retry: false }

  return (
    <AccessTokenProvider {...props}>
      <Counter query={queryInput} />
      <TimeSeries query={{ ...queryInput, granularity: TimeSeriesGranularity.Day }} />
      <Leaderboard query={{ ...queryInput, dimensions: [{ columnName: 'test' }], rowLimit: 1000 }} />
    </AccessTokenProvider>
  )
}
