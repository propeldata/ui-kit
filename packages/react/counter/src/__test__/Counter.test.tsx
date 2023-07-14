import React from 'react'
import { render } from '@testing-library/react'

import { Counter, RelativeTimeRange } from '@/counter'
import { Dom } from '@/testing'

import { setupHandlers } from './mswHandlers'
import { counter } from './mockData'

describe('Counter', () => {
  let dom: Dom

  beforeEach(() => {
    setupHandlers()
  })

  it('should render a static counter', async () => {
    dom = render(<Counter value={counter.value} />)

    await dom.findByText(counter.value)
  })

  it('should show value from server', async () => {
    dom = render(
      <Counter
        query={{
          metric: 'test-metric',
          accessToken: 'test-token',
          timeRange: { relative: RelativeTimeRange.LastNDays, n: 30 }
        }}
      />
    )

    await dom.findByText(counter.value)
  })

  it('Should show "-" when value is null', async () => {
    dom = render(
      <Counter
        query={{
          metric: 'lack-of-data',
          accessToken: 'test-token',
          timeRange: { relative: RelativeTimeRange.LastNDays, n: 30 }
        }}
      />
    )

    await dom.findByText('-')
  })

  it('Should show error fallback when request fails', async () => {
    dom = render(
      <Counter
        query={{
          metric: 'should-fail',
          accessToken: 'test-token',
          timeRange: { relative: RelativeTimeRange.LastNDays, n: 30 },
          retry: false
        }}
      />
    )

    await dom.findByRole('img')
  })
})
