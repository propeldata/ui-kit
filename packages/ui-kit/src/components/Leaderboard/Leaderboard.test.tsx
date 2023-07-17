import React from 'react'
import { render } from '@testing-library/react'
import { Chart } from 'chart.js'
import { graphql } from 'msw'
import { RelativeTimeRange } from '../../helpers'
import { setupTestHandlers } from '../../helpers/testing'
import { Leaderboard } from './Leaderboard'

const mockData = {
  headers: ['header-1', 'header-2', 'header-3'],
  rows: [
    ['dim-1', 'dim-2', '30'],
    ['dim1', 'dim-2', '60'],
    ['dim-1', 'dim-2', '90']
  ]
}

const handlers = [
  graphql.query('Leaderboard', (req, res, ctx) => {
    return res(
      ctx.data({
        leaderboard: mockData
      })
    )
  })
]

describe('Leaderboard', () => {
  let dom: ReturnType<typeof render>

  beforeEach(() => {
    setupTestHandlers(handlers)
  })

  it('should render the leaderboard with static data', () => {
    dom = render(<Leaderboard headers={mockData.headers} rows={mockData.rows} />)

    const chartElement = dom.getByRole('img') as HTMLCanvasElement
    const chartInstance = Chart.getChart(chartElement)

    const chartData = chartInstance?.data.datasets[0].data
    const chartLabels = chartInstance?.data.labels

    const resultingRows = mockData.rows.map((row) => parseInt(row[row.length - 1]))
    const resultingLabels = mockData.rows.map((row) => row[0])

    expect(chartData).toEqual(resultingRows)
    expect(chartLabels).toEqual(resultingLabels)
  })

  it('should render the leaderboard with server data', async () => {
    dom = render(
      <Leaderboard
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

    const resultingRows = mockData.rows.map((row) => parseInt(row[row.length - 1]))
    const resultingLabels = mockData.rows.map((row) => row[0])

    expect(chartData).toEqual(resultingRows)
    expect(chartLabels).toEqual(resultingLabels)
  })
})
