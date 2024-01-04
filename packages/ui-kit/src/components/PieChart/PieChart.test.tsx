import { render, waitFor } from '@testing-library/react'
import { Chart } from 'chart.js'
import React from 'react'
import { RelativeTimeRange } from '../../helpers'
import { Dom, mockLeaderboardQuery, mockCounterQuery, setupTestHandlers } from '../../testing'
import { PieChart } from './PieChart'

const mockCounterData = {
  value: '2375'
}

const mockData = {
  headers: ['DATA_SOURCE_TYPE', 'value'],
  rows: [
    ['Http', '250'],
    ['Snowflake', '385'],
    ['S3', '445'],
    ['Redshift', '560']
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
    const resultingLabels = mockData.rows.map((row) => row.slice(0, row.length - 1))

    expect(chartData).toEqual(resultingRows)
    expect(chartLabels).toEqual(resultingLabels)
  })

  it('should render the piechart with server data', async () => {
    dom = render(
      <PieChart
        query={{
          accessToken: 'test-token',
          metric: 'test-metric',
          dimensions: [
            {
              columnName: 'test-column'
            }
          ],
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
    // Total value = 2375
    // existing mock data total= 1640
    // other value = 735
    const extedndedMockData = {
      headers: [...mockData.headers],
      rows: [...mockData.rows, ['Other', '735']]
    }
    const resultingRows = extedndedMockData.rows.map((row) => parseInt(row[row.length - 1]))
    const resultingLabels = extedndedMockData.rows.map((row) => row.slice(0, row.length - 1))

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
          dimensions: [
            {
              columnName: 'test-column'
            }
          ],
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
})
