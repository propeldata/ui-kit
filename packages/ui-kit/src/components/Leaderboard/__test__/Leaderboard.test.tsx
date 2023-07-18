import React from 'react'
import { Chart } from 'chart.js'
import { render, waitFor } from '@testing-library/react'
import { RelativeTimeRange } from '../../../helpers'
import { Leaderboard } from '../index'
import { setupHandlers } from './mswHandlers'
import { leaderboard } from './mockData'

describe('Leaderboard', () => {
  let dom: ReturnType<typeof render>

  beforeEach(() => {
    setupHandlers()
  })

  it('should render the leaderboard with static data', () => {
    dom = render(<Leaderboard headers={leaderboard.headers} rows={leaderboard.rows} />)

    const chartElement = dom.getByRole('img') as HTMLCanvasElement
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

    const chartElement = (await dom.findByRole('img')) as HTMLCanvasElement
    const chartInstance = Chart.getChart(chartElement)

    const chartData = chartInstance?.data.datasets[0].data
    const chartLabels = chartInstance?.data.labels

    const resultingRows = leaderboard.rows.map((row) => parseInt(row[row.length - 1]))
    const resultingLabels = leaderboard.rows.map((row) => row[0])

    expect(chartData).toEqual(resultingRows)
    expect(chartLabels).toEqual(resultingLabels)
  })

  it('should show error fallback when query fails', async () => {
    dom = render(
      <Leaderboard
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
  })

  it('should show error fallback on props mismatch', async () => {
    dom = render(<Leaderboard headers={['a', 'b', 'c']} />)

    await waitFor(async () => {
      await dom.findByText('Unable to connect')

      // TODO: this message suggests that the error is due to a network issue when it's not, maybe we should think about changing the message depending on the error
      await dom.findByText('Sorry we are not able to connect at this time due to a technical error.')
    })
  })
})
