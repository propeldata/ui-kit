import React from 'react'
import { render } from '@testing-library/react'

import { Counter, RelativeTimeRange } from '@/counter'
import { Dom } from '@/testing'

import { setupHandlers } from './mswHandlers'

describe('Counter', () => {
  let dom: Dom

  beforeEach(() => {
    setupHandlers()
  })

  it('should render a static counter', async () => {
    dom = render(<Counter value="123" />)

    expect(2 + 2).toBe(4)
    await dom.findByText('123')
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

    await dom.findByText('123')
  })
})
