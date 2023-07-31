import { render } from '@testing-library/react'
import { Chart } from 'chart.js'
import React from 'react'
import { mockTimeSeriesQuery, RelativeTimeRange, TimeSeriesGranularity } from '../../helpers'
import { Dom, setupTestHandlers } from '../../helpers/testing'
import { TimeSeries } from '../index'

const mockData = {
  labels: ['2023-07-01', '2023-07-02', '2023-07-03'],
  values: ['10', '20', '15']
}

// @TODO: why the values type for static data is different from the one from the server?
const mockStaticData = {
  labels: ['2023-07-01', '2023-07-02', '2023-07-03'],
  values: [10, 20, 15]
}

const handlers = [
  mockTimeSeriesQuery((req, res, ctx) => {
    const { metricName } = req.variables.timeSeriesInput

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
        timeSeries: mockData
      })
    )
  })
]

describe('TimeSeries', () => {
  let dom: Dom

  beforeEach(() => {
    setupTestHandlers(handlers)
  })

  it('should render static data', () => {
    dom = render(<TimeSeries labels={mockStaticData.labels} values={mockStaticData.values} />)

    const chartElement = dom.getByRole('img') as HTMLCanvasElement
    const chartInstance = Chart.getChart(chartElement)

    const chartData = chartInstance?.data.datasets[0].data
    const chartLabels = chartInstance?.data.labels

    expect(chartLabels).toEqual(mockStaticData.labels)
    expect(chartData).toEqual(mockStaticData.values)
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
    expect(chartData).toEqual(mockData.values.map((value) => Number(value)))
  })

  it('should show error fallback when query fails', async () => {
    console.error = jest.fn()
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

    expect(console.error).toHaveBeenCalled()
  })

  it('should show error fallback on props mismatch', async () => {
    dom = render(<TimeSeries labels={['a', 'b', 'c']} />)

    await dom.findByText('Unable to connect')

    // TODO: this message suggests that the error is due to a network issue when it's not, maybe we should think about changing the message depending on the error
    await dom.findByText('Sorry we are not able to connect at this time due to a technical error.')
  })
})
