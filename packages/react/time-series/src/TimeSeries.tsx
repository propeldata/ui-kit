import React from 'react'
import request from 'graphql-request'
import { customCanvasBackgroundColor } from '@propeldata/ui-kit-plugins'
import {
  TimeSeriesGranularity,
  TimeSeriesDocument,
  TimeRangeInput,
  FilterInput,
  PROPEL_GRAPHQL_API_ENDPOINT,
  Propeller
} from '@propeldata/ui-kit-graphql'
import {
  BarController,
  LineController,
  BarElement,
  LineElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Chart,
  PointElement,
  Colors
} from 'chart.js'

import { BarStyles, LineStyles, TimeSeriesData, ChartVariant } from './__types__'
import { stylesInitialState } from './__defaults__'
import scopedStyles from './TimeSeries.module.css'

/**
 * It registers only the modules that will be used
 * in the context of a BarChart and LineChart so
 * we reduce bundle weight
 */
Chart.register(
  BarController,
  LineController,
  PointElement,
  BarElement,
  LineElement,
  Tooltip,
  LinearScale,
  CategoryScale,
  Colors
)

/**
 * `styles` attribute can be either `BarStyles` or `LineStyles`
 */
type Styles = BarStyles | LineStyles

export interface Props {
  /** Time range that the chart will respond to */
  timeRange?: TimeRangeInput

  /** `styles` attribute can be either `BarStyles` or `LineStyles` */
  styles?: Styles

  /** The variant the chart will respond to, can be either `bar` or `line` */
  variant?: ChartVariant

  /** Metric unique name */
  metric?: string

  /** Granularity that the chart will respond to */
  granularity?: TimeSeriesGranularity

  /** Filters that the chart will respond to */
  filters?: FilterInput[]

  propeller?: Propeller

  /** If passed along with `values` the component will ignore the built-in graphql operations */
  labels?: string[]

  /** If passed along with `labels` the component will ignore the built-in graphql operations  */
  values?: string[]

  /** This should eventually be replaced to customer's app credentials */
  accessToken?: string
}

export function TimeSeries(props: Props) {
  const {
    styles = stylesInitialState,
    variant = 'bar',
    metric,
    timeRange,
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
  const hasValues = values && values.length > 0
  const hasLabels = labels && labels.length > 0
  const isDumb = React.useMemo(() => hasValues || hasLabels, [hasValues, hasLabels])

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
      PROPEL_GRAPHQL_API_ENDPOINT,
      TimeSeriesDocument,
      {
        uniqueName: metric,
        timeSeriesInput: {
          timeRange,
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
  }, [accessToken, granularity, metric, timeRange])

  React.useEffect(() => {
    const setup = async () => {
      const data = isDumb ? { labels, values } : await fetchData()
      setupChart(data)
    }
    setup()
  }, [isDumb, metric, setupChart, fetchData, labels, values])

  return (
    <div className={scopedStyles.chartContainer}>
      <canvas ref={rootRef}></canvas>
    </div>
  )
}
