import { render } from '@testing-library/react'
import React from 'react'
import { CounterQueryProps } from '../../components'
import { QueryClient, QueryClientProvider } from '../../graphql'
import { Dom, mockCounterQuery, RelativeTimeRange, setupTestHandlers } from '../../testing'
import { useCounter } from './useCounter'

const mockData = {
  value: '123'
}

const handlers = [
  mockCounterQuery((req, res, ctx) => {
    const metric = req.variables.counterInput.metricName
    const timeRange = req.variables.counterInput.timeRange

    if (metric === 'not-receive-timerange' && timeRange != null) {
      return res(ctx.errors([{ message: 'timeRange should not be provided' }]))
    }

    return res(
      ctx.data({
        counter: mockData
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

describe('useCounter', () => {
  let dom: Dom

  const queryClient = new QueryClient()

  // CustomComponent is a component that uses useCounter hook
  const CustomComponent = (props: CounterQueryProps) => {
    const { data } = useCounter(props)
    return <div>{data?.counter?.value ?? ''}</div>
  }

  // Setup QueryClientProvider for react-query
  const QueryClientProviderComponent = (props: CounterQueryProps) => (
    <QueryClientProvider client={queryClient}>
      <CustomComponent {...props} />
    </QueryClientProvider>
  )

  beforeEach(() => {
    setupTestHandlers(handlers)
  })

  it('should useCounter return value', async () => {
    dom = render(<QueryClientProviderComponent {...mockQuery} />)

    await dom.findByText(mockData.value)
  })

  it('should not send timeRange when not provided', async () => {
    dom = render(<QueryClientProviderComponent accessToken="token" metric="not-receive-timerange" />)

    await dom.findByText(mockData.value)
  })
})
