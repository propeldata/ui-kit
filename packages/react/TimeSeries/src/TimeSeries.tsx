import React from 'react'
import request from 'graphql-request'
import { customCanvasBackgroundColor } from '@propeldata/propel-ui-plugins'
import {
  BarController,
  LineController,
  BarElement,
  LineElement,
  Colors,
  LinearScale,
  CategoryScale,
  Tooltip,
  Chart,
  PointElement
} from 'chart.js'

import { BarStyles, LineStyles, RelativeTimeRange, TimeSeriesData, TimeSeriesGranularity, Variant } from './types'
import { stylesInitialState } from './styles'
import { DEFAULT_PROPEL_API, QUERY } from './utils'
import './styles.css'

/**
 * It registers only the modules that will be used
 * in the context of a BarChart and LineChart so
 * we reduce bundle weight
 */
Chart.register(
  {
    BarController,
    LineController,
    PointElement
  },
  {
    BarElement,
    LineElement,
    PointElement
  },
  {
    Colors,
    Tooltip
  },
  {
    LinearScale,
    CategoryScale
  }
)

/**
 * `styles` attribute can be either `BarStyles` or `LineStyles`
 */
type Styles = BarStyles | LineStyles

interface Props {
  variant?: Variant
  styles?: Styles
  metric?: string
  relativeTimeRange?: RelativeTimeRange
  n?: number
  granularity?: TimeSeriesGranularity
  labels?: string[]
  values?: string[]
  accessToken?: string
}

export function TimeSeries(props: Props) {
  const {
    styles = stylesInitialState,
    variant = 'bar',
    metric,
    relativeTimeRange = RelativeTimeRange.LastNDays,
    n = 30,
    granularity = TimeSeriesGranularity.Day,
    labels,
    values,
    accessToken
  } = props

  /**
   * The html node where the chart will render
   */
  const rootRef = React.useRef<HTMLCanvasElement>(null)

  /**
   * Checks if the component is in `dumb` or `smart` mode
   */
  const isDumb = React.useMemo(() => {
    const hasValues = !!values && values.length > 0
    const hasLabels = !!labels && labels.length > 0
    return hasValues || hasLabels
  }, [labels, values])

  /**
   * Sets up chart default values
   */
  const setupChartDefaults = React.useCallback(() => {
    Chart.defaults.color = styles.font?.color as string
    Chart.defaults.font.size = styles.font?.size
    Chart.defaults.font.family = styles.font?.family
    Chart.defaults.font.weight = styles.font?.weight
    Chart.defaults.font.style = styles.font?.style
    Chart.defaults.font.lineHeight = styles.font?.lineHeight
  }, [styles])

  /**
   * Builds chartjs config
   */
  const buildChartConfig = React.useCallback(
    (params: TimeSeriesData) => {
      const { labels, values } = params

      const data = {
        labels,
        datasets: [
          {
            data: values,
            borderWidth: styles.border?.width,
            borderRadius: styles.border?.radius,
            borderColor: styles.border?.color,
            hoverBorderColor: styles.border?.hoverColor,
            backgroundColor: styles.background?.color,
            hoverBackgroundColor: styles.background?.hoverColor
          }
        ]
      }

      const options = {
        maintainAspectRatio: false,
        plugins: {
          customCanvasBackgroundColor: {
            color: styles.canvas?.backgroundColor
          }
        },
        layout: {
          padding: styles.canvas?.padding
        },
        scales: {
          x: {
            grid: { drawOnChartArea: false },
            beginAtZero: true,
            ticks: {
              callback: (_: unknown, index: number) => {
                const labelDate = new Date(labels?.[index] as string)
                const month = labelDate.getUTCMonth() + 1
                const day = labelDate.getUTCDate()

                return `${month}/${day}`
              }
            }
          }
        }
      }

      return {
        type: variant,
        responsive: true,
        data,
        options,
        plugins: [customCanvasBackgroundColor]
      } as never
    },
    [styles, variant]
  )

  /**
   * Sets up chatjs instance
   */
  const setupChart = React.useCallback(
    (params: TimeSeriesData) => {
      const { labels, values } = params

      // If a root element is not found, Chart.js won't be able to render anything
      if (!rootRef.current) return

      setupChartDefaults()

      const config = buildChartConfig({ labels, values })

      new Chart(rootRef.current, config)

      rootRef.current.style.borderRadius = styles.canvas?.borderRadius as string
    },
    [buildChartConfig, setupChartDefaults, styles]
  )

  /**
   * Fetches the time series data
   * when the user doesn't provide
   * its on `labels` and `values`
   */
  const fetchData = React.useCallback(async () => {
    const response = await request(
      DEFAULT_PROPEL_API,
      QUERY,
      {
        uniqueName: metric,
        timeSeriesInput: {
          timeRange: {
            relative: relativeTimeRange,
            n: n
          },
          granularity
        }
      },
      {
        authorization: `Bearer ${accessToken}`
      }
    )

    const metricData = response.metricByName.timeSeries

    const labels: string[] = [...metricData.labels]
    const values: string[] = [...metricData.values]
    return { labels, values }
  }, [accessToken, granularity, metric, n, relativeTimeRange])

  React.useEffect(() => {
    async function setup() {
      if (!isDumb) {
        const { labels, values } = await fetchData()
        setupChart({ labels, values })
      } else {
        setupChart({ labels, values })
      }
    }
    setup()
  }, [accessToken, isDumb, granularity, metric, n, relativeTimeRange, setupChart, fetchData, labels, values])

  return (
    <div className="chart-container">
      <canvas ref={rootRef} id="chart-root"></canvas>
    </div>
  )
}
