import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { graphql } from 'msw'
import { RelativeTimeRange } from '../../helpers'
import { setupTestHandlers } from '../../helpers/testing'
import { Counter } from './Counter'

const mockData = {
  value: '123'
}

const handlers = [
  graphql.query('Counter', (req, res, ctx) => {
    const { metricName } = req.variables.counterInput

    if (metricName === 'lack-of-data') {
      return res(
        ctx.data({
          counter: {
            value: null
          }
        })
      )
    }

    if (metricName === 'should-fail') {
      return res(
        ctx.errors([
          {
            message: 'something went wrong'
          }
        ])
      )
    }

    return res(
      ctx.data({
        counter: mockData
      })
    )
  })
]

describe('Counter', () => {
  let dom: ReturnType<typeof render>

  beforeEach(() => {
    setupTestHandlers(handlers)
  })

  it('should render a static counter', async () => {
    dom = render(<Counter value={mockData.value} />)

    await dom.findByText(mockData.value)
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

    await dom.findByText(mockData.value)
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

    await waitFor(async () => {
      await dom.findByText('-')
    })
  })

  it('Should show error fallback when request fails', async () => {
    dom = render(
      <Counter
        query={{
          metric: 'should-fail',
          accessToken: 'test-token',
          timeRange: { relative: RelativeTimeRange.LastNDays, n: 30 }
        }}
      />
    )

    await waitFor(async () => {
      await dom.findByRole('img')
    })
  })
})
