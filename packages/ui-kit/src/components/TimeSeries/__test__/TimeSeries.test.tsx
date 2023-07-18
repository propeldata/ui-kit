import { render } from '@testing-library/react'
import { Chart } from 'chart.js'
import React from 'react'
import { RelativeTimeRange, TimeSeriesGranularity } from '../../../helpers'
import { TimeSeries } from '../index'
import { timeSeries } from './mockData'
import { setupHandlers } from './mswHandlers'

describe('TimeSeries', () => {
  let dom: ReturnType<typeof render>

  beforeEach(() => {
    setupHandlers()
  })

  it('should render static data', () => {
    dom = render(<TimeSeries labels={timeSeries.labels} values={timeSeries.values} />)

    const chartElement = dom.getByRole('img') as HTMLCanvasElement
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

    const chartElement = (await dom.findByRole('img')) as HTMLCanvasElement
    const chartInstance = Chart.getChart(chartElement)

    const chartData = chartInstance?.data.datasets[0].data
    const chartLabels = chartInstance?.data.labels

    expect(chartLabels).toEqual(timeSeries.labels)
    expect(chartData).toEqual(timeSeries.values.map((value) => Number(value)))
  })

  it('should show error fallback when query fails', async () => {
    dom = render(
      <TimeSeries
        query={{
          accessToken: 'test-token',
          metric: 'should-fail',
          timeRange: {
            relative: RelativeTimeRange.LastNDays,
            n: 30
          },
          granularity: TimeSeriesGranularity.Day,
          retry: false
        }}
      />
    )

    await dom.findByText('Unable to connect')

    await dom.findByText('Sorry we are not able to connect at this time due to a technical error.')
  })

  it('should show error fallback on props mismatch', async () => {
    dom = render(<TimeSeries labels={['a', 'b', 'c']} />)

    await dom.findByText('Unable to connect')

    // TODO: this message suggests that the error is due to a network issue when it's not, maybe we should think about changing the message depending on the error
    await dom.findByText('Sorry we are not able to connect at this time due to a technical error.')
  })
})
