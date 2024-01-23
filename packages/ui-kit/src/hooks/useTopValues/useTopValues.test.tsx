import React from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '../../helpers'
import { Dom, mockTopValuesQuery, RelativeTimeRange, setupTestHandlers } from '../../testing'
import { useTopValues } from './useTopValues'
import { TopValuesQueryProps } from '../../components/TopValues/TopValues.types'

const mockData = {
  values: ['a', 'b', 'c', 'd']
}

const handlers = [
  mockTopValuesQuery((req, res, ctx) => {
    return res(
      ctx.data({
        topValues: mockData
      })
    )
  })
]

const mockQuery: TopValuesQueryProps = {
  columnName: 'column',
  dataPool: {
    name: 'dataPool'
  },
  timeRange: {
    relative: RelativeTimeRange.LastNDays,
    n: 30
  },
  maxValues: 10
}

describe('useTopValues', () => {
  let dom: Dom

  const queryClient = new QueryClient()

  // CustomComponent is a component that uses useTopValues hook
  const CustomComponent = (props: TopValuesQueryProps) => {
    const { data } = useTopValues({ ...props, accessToken: 'token' })
    const { values } = data?.topValues ?? {}
    return (
      <>
        {values?.map((value) => (
          <div key={value}>{value}</div>
        ))}
      </>
    )
  }

  // Setup QueryClientProvider for react-query
  const QueryClientProviderComponent = (props: TopValuesQueryProps) => (
    <QueryClientProvider client={queryClient}>
      <CustomComponent {...props} />
    </QueryClientProvider>
  )

  beforeEach(() => {
    setupTestHandlers(handlers)
  })

  it('should useTopValues return value', async () => {
    dom = render(<QueryClientProviderComponent {...mockQuery} />)

    await dom.findByText(mockData.values[2])
  })
})
