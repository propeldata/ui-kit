import React from 'react'

import { render, waitFor } from '@testing-library/react'
import { Chart } from 'chart.js'

import { Dom } from '@/testing'
import { RelativeTimeRange, TimeSeries, TimeSeriesGranularity } from '@/time-series'

import { setupHandlers } from './mswHandlers'
import { timeSeries } from './mockData'

describe('TimeSeries', () => {
  let dom: Dom

  beforeEach(() => {
    setupHandlers()
  })

  it('should render static data', () => {
    dom = render(<TimeSeries labels={timeSeries.labels} values={timeSeries.values} />)

    const chartElement = dom.getByTestId('chart-canvas') as HTMLCanvasElement
    const chartInstance = Chart.getChart(chartElement)

    const chartData = chartInstance?.data.datasets[0].data
    const chartLabels = chartInstance?.data.labels

    expect(chartLabels).toEqual(timeSeries.labels)
    expect(chartData).toEqual(timeSeries.values)
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

    const chartElement = (await dom.findByTestId('chart-canvas')) as HTMLCanvasElement
    const chartInstance = Chart.getChart(chartElement)

    const chartData = chartInstance?.data.datasets[0].data
    const chartLabels = chartInstance?.data.labels

    expect(chartLabels).toEqual(timeSeries.labels)
    expect(chartData).toEqual(timeSeries.values)
  })
})
