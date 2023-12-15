import React from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '../../helpers'
import { Dom, mockLeaderboardQuery, RelativeTimeRange, setupTestHandlers } from '../../testing'
import { LeaderboardQueryProps } from '../../components'
import { useLeaderboard } from './useLeaderboard'

const mockData = {
  headers: ['header-1', 'header-2', 'header-3'],
  rows: [['dim-1', 'dim-2', '30']]
}

const handlers = [
  mockLeaderboardQuery((req, res, ctx) => {
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
  }
}

describe('useLeaderboard', () => {
  let dom: Dom

  const queryClient = new QueryClient()

  // CustomComponent is a component that uses useCounter hook
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
  const QuerClientProviderComponent = (props: LeaderboardQueryProps) => (
    <QueryClientProvider client={queryClient}>
      <CustomComponent {...props} />
    </QueryClientProvider>
  )

  beforeEach(() => {
    setupTestHandlers(handlers)
  })

  it('should useCounter return value', async () => {
    dom = render(<QuerClientProviderComponent {...mockQuery} />)

    await dom.findByText(mockData.headers[0])
    await dom.findByText(mockData.rows[0][1])
  })
})
