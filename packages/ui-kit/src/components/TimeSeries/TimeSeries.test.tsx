import React from 'react'
import { render } from '@testing-library/react'
import { Chart } from 'chart.js'
import { graphql } from 'msw'
import { RelativeTimeRange, TimeSeriesGranularity } from '../../helpers'
import { setupTestHandlers } from '../../helpers/testing'
import { TimeSeries } from './TimeSeries'

const mockData = {
  labels: ['2023-07-01', '2023-07-02', '2023-07-03'],
  values: [10, 20, 15]
}

const handlers = [
  graphql.query('TimeSeries', (req, res, ctx) => {
    return res(
      ctx.data({
        timeSeries: mockData
      })
    )
  })
]

describe('TimeSeries', () => {
  let dom: ReturnType<typeof render>

  beforeEach(() => {
    setupTestHandlers(handlers)
  })

  it('should render static data', () => {
    dom = render(<TimeSeries labels={mockData.labels} values={mockData.values} />)

    const chartElement = dom.getByRole('img') as HTMLCanvasElement
    const chartInstance = Chart.getChart(chartElement)

    const chartData = chartInstance?.data.datasets[0].data
    const chartLabels = chartInstance?.data.labels

    expect(chartLabels).toEqual(mockData.labels)
    expect(chartData).toEqual(mockData.values)
  })

  it('should render data from server', async () => {
    dom = render(
      <TimeSeries
        query={{
          accessToken: 'test-token',
          metric: 'test-metric',
          timeRange: {
            relative: RelativeTimeRange.LastNDays,
            n: 30
          },
          granularity: TimeSeriesGranularity.Day
        }}
      />
    )

    const chartElement = (await dom.findByRole('img')) as HTMLCanvasElement
    const chartInstance = Chart.getChart(chartElement)

    const chartData = chartInstance?.data.datasets[0].data
    const chartLabels = chartInstance?.data.labels

    expect(chartLabels).toEqual(mockData.labels)
    expect(chartData).toEqual(mockData.values)
  })
})
