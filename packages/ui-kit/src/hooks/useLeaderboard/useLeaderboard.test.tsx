import { render } from '@testing-library/react'
import React from 'react'
import { LeaderboardQueryProps } from '../../components'
import { QueryClient, QueryClientProvider } from '../../graphql'
import { Dom, mockLeaderboardQuery, RelativeTimeRange, setupTestHandlers } from '../../testing'
import { useLeaderboard } from './useLeaderboard'

const mockData = {
  headers: ['header-1', 'header-2', 'header-3'],
  rows: [['dim-1', 'dim-2', '30']]
}

const handlers = [
  mockLeaderboardQuery((req, res, ctx) => {
    const metric = req.variables.leaderboardInput.metricName
    const timeRange = req.variables.leaderboardInput.timeRange

    if (metric === 'not-receive-timerange' && timeRange != null) {
      return res(ctx.errors([{ message: 'timeRange should not be provided' }]))
    }

    return res(
      ctx.data({
        leaderboard: mockData
      })
    )
  })
]

const mockQuery = {
  accessToken: 'token',
  metric: 'Revenue',
  timeRange: {
    relative: RelativeTimeRange.LastNDays,
    n: 30
  },
  dimensions: [{ columnName: 'some column' }]
}

describe('useLeaderboard', () => {
  let dom: Dom

  const queryClient = new QueryClient()

  // CustomComponent is a component that uses useLeaderboard hook
  const CustomComponent = (props: LeaderboardQueryProps) => {
    const { data } = useLeaderboard(props)
    return (
      <table>
        <thead>
          <tr>
            {data?.leaderboard?.headers?.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.leaderboard?.rows?.map((row, index) => (
            <tr key={index}>
              {row.map((cell, index) => (
                <td key={index}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  // Setup QueryClientProvider for react-query
  const QueryClientProviderComponent = (props: LeaderboardQueryProps) => (
    <QueryClientProvider client={queryClient}>
      <CustomComponent {...props} />
    </QueryClientProvider>
  )

  beforeEach(() => {
    setupTestHandlers(handlers)
  })

  it('should useLeaderboard return value', async () => {
    dom = render(<QueryClientProviderComponent {...mockQuery} />)

    await dom.findByText(mockData.headers[0])
    await dom.findByText(mockData.rows[0][1])
  })

  it('should not send timeRange when not provided', async () => {
    dom = render(<QueryClientProviderComponent accessToken="token" metric="not-receive-timerange" />)

    // Passing no dimensions should trigger counter and show "All"
    await dom.findByText('All')
  })
})
