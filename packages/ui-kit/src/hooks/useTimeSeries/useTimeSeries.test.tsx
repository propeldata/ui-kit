import React from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '../../helpers'
import { Dom, mockTimeSeriesQuery, RelativeTimeRange, setupTestHandlers } from '../../testing'
import { TimeSeriesQueryProps } from '../../components'
import { useTimeSeries } from './useTimeSeries'

const mockData = {
  labels: ['2023-07-01', '2023-07-02', '2023-07-03'],
  values: ['10', '25', '42']
}

const handlers = [
  mockTimeSeriesQuery((req, res, ctx) => {
    return res(
      ctx.data({
        timeSeries: mockData
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

describe('useTimeSeries', () => {
  let dom: Dom

  const queryClient = new QueryClient()

  // CustomComponent is a component that uses useTimeSeries hook
  const CustomComponent = (props: TimeSeriesQueryProps) => {
    const { data } = useTimeSeries(props)
    const { labels, values } = data?.timeSeries ?? {}
    return (
      <>
        {labels?.map((label) => (
          <div key={label}>{label}</div>
        ))}
        {values?.map((value) => (
          <div key={value}>{value}</div>
        ))}
      </>
    )
  }

  // Setup QueryClientProvider for react-query
  const QuerClientProviderComponent = (props: TimeSeriesQueryProps) => (
    <QueryClientProvider client={queryClient}>
      <CustomComponent {...props} />
    </QueryClientProvider>
  )

  beforeEach(() => {
    setupTestHandlers(handlers)
  })

  it('should useTimeSeries return value', async () => {
    dom = render(<QuerClientProviderComponent {...mockQuery} />)

    await dom.findByText(mockData.labels[1])
    await dom.findByText(mockData.values[2])
  })
})
