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
  Colors,
  ChartTypeRegistry,
  ElementOptionsByType
} from 'chart.js'

import { BarStyles, LineStyles, TimeSeriesData, ChartVariant } from './__types__'
import { stylesInitialState } from './__defaults__'
import scopedStyles from './TimeSeries.module.css'
import { generateBarConfig } from './__utils__'

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

type ElementOptions = ElementOptionsByType<keyof ChartTypeRegistry>

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

  const barStyles = variant === 'bar' ? (styles as BarStyles) : undefined
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
    const pointOptions: ElementOptions['point'] = {
      radius: 3,
      backgroundColor: '#fff',
      borderColor: '#000',
      borderWidth: 1,
      hitRadius: 1,
      hoverRadius: 4,
      hoverBorderWidth: 1,
      pointStyle: 'circle',
      rotation: 0,
      hoverBorderColor: 'rgba(0,0,0,0)',
      hoverBackgroundColor: 'rgba(0,0,0,0)',
      drawActiveElementsOnTop: true
    }

    const barOptions: ElementOptions['bar'] = {
      backgroundColor: '#000',
      borderWidth: 3,
      borderRadius: 10,
      borderColor: 'orange',
      borderSkipped: 'bottom',
      hoverBackgroundColor: 'green',
      hoverBorderColor: 'red',
      hoverBorderWidth: 6,
      hoverBorderRadius: 2,
      base: 0,
      inflateAmount: 0
    }

    const lineOptions: ElementOptions['line'] = {
      tension: 0.4,
      backgroundColor: 'rgba(0,0,0,0)',
      borderWidth: 2,
      borderColor: '#000',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      capBezierPoints: true,
      fill: true,
      segment: {
        backgroundColor: 'rgba(0,0,0,0)',
        borderWidth: 2,
        borderColor: '#000',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter'
      },
      stepped: false,
      cubicInterpolationMode: 'default',
      spanGaps: false,
      hoverBackgroundColor: 'rgba(0,0,0,0)',
      hoverBorderCapStyle: 'butt',
      hoverBorderDash: [],
      hoverBorderDashOffset: 0.0,
      hoverBorderJoinStyle: 'miter',
      hoverBorderColor: 'rgba(0,0,0,0)',
      hoverBorderWidth: 2
    }

    Chart.defaults.elements.bar = barOptions
    Chart.defaults.elements.line = lineOptions
    Chart.defaults.elements.point = pointOptions

    Chart.defaults.plugins.tooltip.enabled = true
    Chart.defaults.plugins.tooltip.padding = 8
    Chart.defaults.plugins.tooltip.backgroundColor = 'white'
    Chart.defaults.plugins.tooltip.bodyColor = 'cornflowerblue'
    Chart.defaults.plugins.tooltip.titleColor = 'cornflowerblue'
    Chart.defaults.plugins.tooltip.borderColor = 'cornflowerblue'
    Chart.defaults.plugins.tooltip.borderWidth = 2
    Chart.defaults.plugins.tooltip.titleFont = {
      family: 'Helvetica Neue',
      size: 14,
      style: 'normal',
      lineHeight: 1.2
    }
    Chart.defaults.plugins.tooltip.titleAlign = 'right'
    Chart.defaults.plugins.tooltip.bodyFont = {
      family: 'Helvetica Neue',
      size: 12,
      style: 'normal',
      lineHeight: 1.2
    }

    Chart.defaults.plugins.tooltip.bodyAlign = 'right'
    Chart.defaults.plugins.tooltip.caretSize = 2

    Chart.defaults.plugins.tooltip.cornerRadius = 6
  }, [])

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
            borderWidth: barStyles?.bar?.borderWidth,
            borderRadius: barStyles?.bar?.borderRadius,
            borderColor: barStyles?.bar?.borderColor,
            hoverBorderColor: barStyles?.bar?.hoverBorderColor,
            backgroundColor: barStyles?.bar?.backgroundColor,
            hoverBackgroundColor: barStyles?.bar?.hoverBackgroundColor,
            barThickness: barStyles?.bar?.thickness
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
    [barStyles, variant, styles]
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

      new Chart(rootRef.current, generateBarConfig(styles) as never)

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
