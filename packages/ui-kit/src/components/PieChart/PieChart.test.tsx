import { render, waitFor } from '@testing-library/react'
import { Chart } from 'chart.js'
import React from 'react'
import { RelativeTimeRange, sleep } from '../../helpers'
import { Dom, mockLeaderboardQuery, mockCounterQuery, setupTestHandlers, mockServer } from '../../testing'
import { AccessTokenProvider } from '../AccessTokenProvider'
import { PieChart } from './PieChart'

const mockCounterData = {
  value: '87560'
}

const mockData = {
  headers: ['Taco name', 'value'],
  rows: [
    ['Carnitas', '21250'],
    ['Al Pastor', '14385'],
    ['Carne Asada', '8445'],
    ['Pollo', '15600'],
    ['Barbacoa', '5560'],
    ['Veggie', '11320']
  ]
}

const handlers = [
  mockLeaderboardQuery((req, res, ctx) => {
    const { metricName } = req.variables.leaderboardInput

    if (metricName === 'should-fail') {
      return res(
        ctx.errors([
          {
            message: 'Something went wrong'
          }
        ])
      )
    }

    return res(
      ctx.data({
        leaderboard: mockData
      })
    )
  }),
  mockCounterQuery((req, res, ctx) => {
    const { metricName } = req.variables.counterInput

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
        counter: mockCounterData
      })
    )
  })
]

describe('PieChart', () => {
  let dom: Dom

  beforeEach(() => {
    setupTestHandlers(handlers)
    jest.useFakeTimers()
  })

  // Running all pending timers and switching to real timers using Jest
  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should render the piechart with static data', () => {
    dom = render(<PieChart headers={mockData.headers} rows={mockData.rows} />)

    const chartElement = dom.getByRole('img') as HTMLCanvasElement
    const chartInstance = Chart.getChart(chartElement)

    const chartData = chartInstance?.data.datasets[0].data
    const chartLabels = chartInstance?.data.labels

    const resultingRows = mockData.rows.map((row) => parseInt(row[row.length - 1]))
    const resultingLabels = mockData.rows.map((row) => row[0])

    expect(chartData).toEqual(resultingRows)
    expect(chartLabels).toEqual(resultingLabels)
  })

  it('should render the piechart with server data', async () => {
    dom = render(
      <PieChart
        query={{
          accessToken: 'test-token',
          metric: 'test-metric',
          dimension: {
            columnName: 'test-column'
          },
          rowLimit: 10,
          timeRange: {
            relative: RelativeTimeRange.LastNDays,
            n: 30
          }
        }}
      />
    )

    const chartElement = (await dom.findByRole('img')) as HTMLCanvasElement
    const chartInstance = Chart.getChart(chartElement)

    const chartData = chartInstance?.data.datasets[0].data
    const chartLabels = chartInstance?.data.labels

    // extend mock data with other value
    // Total value = 87560
    // existing mock data total= 76560
    // other value = 11000
    const extendedMockData = {
      headers: [...mockData.headers],
      rows: [...mockData.rows, ['Other', '11000']]
    }
    const resultingRows = extendedMockData.rows.map((row) => parseInt(row[row.length - 1]))
    const resultingLabels = extendedMockData.rows.map((row) => row[0])

    expect(chartData).toEqual(resultingRows)
    expect(chartLabels).toEqual(resultingLabels)
  })

  it('should show error fallback when query fails', async () => {
    console.error = jest.fn()
    dom = render(
      <PieChart
        query={{
          accessToken: 'test-token',
          metric: 'should-fail',
          dimension: {
            columnName: 'test-column'
          },
          rowLimit: 10,
          timeRange: {
            relative: RelativeTimeRange.LastNDays,
            n: 30
          },
          retry: false
        }}
      />
    )

    await dom.findByText('Unable to connect')

    await dom.findByText('Sorry we are not able to connect at this time due to a technical error.')

    expect(console.error).toHaveBeenCalled()
  })

  it('should show error fallback on props mismatch', async () => {
    dom = render(<PieChart headers={['a', 'b', 'c']} />)

    await waitFor(async () => {
      await dom.findByText('Unable to connect')

      // TODO: this message suggests that the error is due to a network issue when it's not, maybe we should think about changing the message depending on the error
      await dom.findByText('Sorry we are not able to connect at this time due to a technical error.')
    })
  })

  it('Should NOT fetch data in static mode', async () => {
    jest.useRealTimers()

    mockServer.events.on('request:start', async () => {
      throw new Error('Should not fetch data in static mode')
    })

    dom = render(
      <AccessTokenProvider accessToken="abc">
        <PieChart {...mockData} />
      </AccessTokenProvider>
    )

    await sleep(100)
  })

  it('Should receive errorFallbackProp', () => {
    dom = render(
      <PieChart
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
