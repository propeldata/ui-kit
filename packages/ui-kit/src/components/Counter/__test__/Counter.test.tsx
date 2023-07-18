import { render } from '@testing-library/react'
import React from 'react'
import { RelativeTimeRange } from '../../../helpers'
import { Counter } from '../index'
import { counter } from './mockData'
import { setupHandlers } from './mswHandlers'

describe('Counter', () => {
  let dom: ReturnType<typeof render>

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

  it('Should show error fallback on props mismatch', async () => {
    dom = render(<Counter />)

    await dom.findByRole('img')
  })
})
