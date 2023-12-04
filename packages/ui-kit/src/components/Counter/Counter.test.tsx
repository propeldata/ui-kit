import { render } from '@testing-library/react'
import React from 'react'
import { Dom, mockCounterQuery, RelativeTimeRange, setupTestHandlers } from '../../testing'
import { Counter } from './Counter'

const mockData = {
  value: '123'
}

const handlers = [
  mockCounterQuery((req, res, ctx) => {
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

    if (metricName === 'string-value') {
      return res(
        ctx.data({
          counter: {
            value: 'My string value'
          }
        })
      )
    }

    if (metricName === 'boolean-value') {
      return res(
        ctx.data({
          counter: {
            value: true
          }
        })
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
  let dom: Dom

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

    await dom.findByText('-')
  })

  it('Should show error fallback when request fails', async () => {
    console.error = jest.fn()
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

    expect(console.error).toHaveBeenCalled()
  })

  it('Should show error fallback on props mismatch', async () => {
    dom = render(<Counter />)

    await dom.findByRole('img')
  })

  it('Should work for strings', async () => {
    dom = render(
      <Counter
        query={{
          metric: 'string-value',
          accessToken: 'test-token',
          timeRange: { relative: RelativeTimeRange.LastNDays, n: 30 },
          retry: false
        }}
      />
    )

    await dom.findByText('My string value')
  })

  it('Should work for booleans', async () => {
    dom = render(
      <Counter
        query={{
          metric: 'boolean-value',
          accessToken: 'test-token',
          timeRange: { relative: RelativeTimeRange.LastNDays, n: 30 },
          retry: false
        }}
      />
    )

    await dom.findByText('true')
  })
})
