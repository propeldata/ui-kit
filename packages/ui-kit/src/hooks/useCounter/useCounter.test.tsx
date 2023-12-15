import React from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '../../helpers'
import { Dom, mockCounterQuery, RelativeTimeRange, setupTestHandlers } from '../../testing'
import { CounterQueryProps } from '../../components'
import { useCounter } from './useCounter'

const mockData = {
  value: '123'
}

const handlers = [
  mockCounterQuery((req, res, ctx) => {
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
  const QuerClientProviderComponent = (props: CounterQueryProps) => (
    <QueryClientProvider client={queryClient}>
      <CustomComponent {...props} />
    </QueryClientProvider>
  )

  beforeEach(() => {
    setupTestHandlers(handlers)
  })

  it('should useCounter return value', async () => {
    dom = render(<QuerClientProviderComponent {...mockQuery} />)

    await dom.findByText(mockData.value)
  })
})
