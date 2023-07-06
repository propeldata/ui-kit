import React from 'react'
import { Chart } from 'chart.js'
import { render } from '@testing-library/react'

import { Dom } from '@/testing'
import { Leaderboard, RelativeTimeRange } from '@/leaderboard'

import { setupHandlers } from './mswHandlers'
import { leaderboard } from './mockData'

describe('Leaderboard', () => {
  let dom: Dom

  beforeEach(() => {
    setupHandlers()
  })

  it('should render the leaderboard with static data', () => {
    dom = render(<Leaderboard headers={leaderboard.headers} rows={leaderboard.rows} />)

    const chartElement = dom.getByTestId('chart-canvas') as HTMLCanvasElement
    const chartInstance = Chart.getChart(chartElement)

    const chartData = chartInstance?.data.datasets[0].data
    const chartLabels = chartInstance?.data.labels

    const resultingRows = leaderboard.rows.map((row) => parseInt(row[row.length - 1]))
    const resultingLabels = leaderboard.rows.map((row) => row[0])

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

    const chartElement = (await dom.findByTestId('chart-canvas')) as HTMLCanvasElement
    const chartInstance = Chart.getChart(chartElement)

    const chartData = chartInstance?.data.datasets[0].data
    const chartLabels = chartInstance?.data.labels

    const resultingRows = leaderboard.rows.map((row) => parseInt(row[row.length - 1]))
    const resultingLabels = leaderboard.rows.map((row) => row[0])

    expect(chartData).toEqual(resultingRows)
    expect(chartLabels).toEqual(resultingLabels)
  })
})
