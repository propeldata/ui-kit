import type { Meta, StoryObj } from '@storybook/react'
import { Chart, registerables } from 'chart.js'
import React from 'react'
import axiosInstance from '../../../../../app/storybook/src/axios'
import { RelativeTimeRange, TimeSeriesGranularity } from '../../graphql'
import { storybookCodeTemplate } from '../../helpers'
import { useStorybookAccessToken } from '../../helpers/useStorybookAccessToken'
import { useTimeSeries } from './useTimeSeries'

Chart.register(...registerables)

const args = {
  accessToken: '<PROPEL_ACCESS_TOKEN>',
  metric: process.env.STORYBOOK_METRIC_UNIQUE_NAME_1,
  timeRange: {
    relative: RelativeTimeRange.LastNDays,
    n: 30
  },
  granularity: TimeSeriesGranularity.Week
}

const meta: Meta = {
  title: 'Components/TimeSeriesChart',
  tags: ['hidden'],
  parameters: {
    imports: ['useTimeSeries', 'useAccessToken'],
    isFunction: true,
    codeTemplate: storybookCodeTemplate,
    transformBody: (body: string) =>
      body
        .replace(`useStorybookAccessToken(axiosInstance)`, 'useAccessToken()')
        .replace(
          `{
      ...args,
      accessToken
    }`,
          `${JSON.stringify(args)}`
        )
        .concat(' }')
  }
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

let id = 0

export const TimeSeriesChart: Story = {
  args,
  render: (args) =>
    (function TimeSeries() {
      const { accessToken } = useStorybookAccessToken(axiosInstance)
      const { data } = useTimeSeries({ ...args, accessToken })
      const { labels, values } = data?.timeSeries ?? {}

      const canvasRef = React.useRef<HTMLCanvasElement>(null)
      const chartRef = React.useRef<Chart | null>(null)

      const destroyChart = React.useCallback(() => {
        if (!chartRef.current) return
        chartRef.current.destroy()
        chartRef.current = null
      }, [chartRef])

      React.useEffect(() => {
        if (labels && labels.length > 0 && canvasRef.current != null) {
          chartRef.current = new Chart(canvasRef.current, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'TimeSeries',
                  data: values?.map((v) => Number(v)) ?? [],
                  borderWidth: 1
                }
              ]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          })
        } else {
          destroyChart()
        }

        return () => {
          destroyChart()
        }
      }, [labels, values, destroyChart])

      return (
        <div>
          <canvas id={`time-series-chart-${React.useRef(id++)}`} ref={canvasRef} height={80}></canvas>
        </div>
      )
    })()
}
