import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import { Dom, mockCounterQuery, RelativeTimeRange, setupTestHandlers } from '../../testing'
import { AccessTokenProvider } from '../AccessTokenProvider'
import { Counter } from './Counter'
import { mockServer } from '../../testing'
import { sleep } from '../../helpers'

const mockData = {
  value: '123'
}

const handlers = [
  mockCounterQuery((req, res, ctx) => {
    const { metricName, timeZone } = req.variables.counterInput

    if (metricName === 'test-time-zone') {
      return res(
        ctx.data({
          counter: {
            value: timeZone
          }
        })
      )
    }

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

  it('Should show error state when data is empty', async () => {
    const TestWrapper = () => {
      const [metric, setMetric] = React.useState<string>('lack-of-data')

      return (
        <>
          <button data-testid="change-metric" onClick={() => setMetric('test-metric')}>
            Change Metric
          </button>
          <Counter
            renderEmpty={() => <h1>Empty State</h1>}
            query={{
              metric,
              accessToken: 'test-token',
              timeRange: { relative: RelativeTimeRange.LastNDays, n: 30 }
            }}
          />
        </>
      )
    }

    dom = render(<TestWrapper />)

    await dom.findByText('Empty State')

    fireEvent.click(dom.getByTestId('change-metric'))

    await dom.findByText(mockData.value)
  })

  it('Should pass timeZone to the query', async () => {
    dom = render(
      <Counter
        timeZone="Europe/Rome"
        query={{
          metric: 'test-time-zone',
          accessToken: 'test-token',
          timeRange: { relative: RelativeTimeRange.LastNDays, n: 30 }
        }}
      />
    )

    await dom.findByText('Europe/Rome')
  })

  it('Should pass query.timeZone to the query', async () => {
    dom = render(
      <Counter
        timeZone="Europe/Rome"
        query={{
          metric: 'test-time-zone',
          timeZone: 'Europe/Berlin',
          accessToken: 'test-token',
          timeRange: { relative: RelativeTimeRange.LastNDays, n: 30 }
        }}
      />
    )

    await dom.findByText('Europe/Berlin')
  })

  it('Should NOT fetch data in static mode', async () => {
    mockServer.events.on('request:start', async () => {
      throw new Error('Should not fetch data in static mode')
    })

    dom = render(
      <AccessTokenProvider accessToken="abc">
        <Counter value="123" />
      </AccessTokenProvider>
    )

    await sleep(100)
  })

  it('Should receive errorFallbackProp', () => {
    dom = render(
      <Counter
        errorFallbackProps={{
          error: {
            title: 'Custom title',
            body: 'Custom body'
          }
        }}
      />
    )

    dom.getByText('Custom title')
    dom.getByText('Custom body')
  })
})
