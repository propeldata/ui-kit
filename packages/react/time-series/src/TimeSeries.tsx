import React from 'react'
import request from 'graphql-request'
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
import { generateBarConfig, generateLineConfig, useSetupDefaultStyles } from './__utils__'
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
export type Styles = BarStyles | LineStyles

export interface Props {
  /** The variant the chart will respond to, can be either `bar` or `line` */
  variant?: ChartVariant

  /** `styles` attribute can be either `BarStyles` or `LineStyles` */
  styles?: Styles

  /** If passed along with `values` the component will ignore the built-in graphql operations */
  labels?: TimeSeriesData['labels']

  /** If passed along with `labels` the component will ignore the built-in graphql operations  */
  values?: TimeSeriesData['values']

  query?: {
    /** This should eventually be replaced to customer's app credentials */
    accessToken?: string

    /** Metric unique name */
    metric?: string

    /** Time range that the chart will respond to */
    timeRange?: TimeRangeInput

    /** Granularity that the chart will respond to */
    granularity?: TimeSeriesGranularity

    /** Filters that the chart will respond to */
    filters?: FilterInput[]

    /** Propeller that the chart will respond to */
    propeller?: Propeller
  }
}

export function TimeSeries(props: Props) {
  const { variant = 'bar', styles = stylesInitialState, labels, values, query } = props

  const barStyles = variant === 'bar' ? (styles as BarStyles) : undefined
  const lineStyles = variant === 'line' ? (styles as LineStyles) : undefined

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

  useSetupDefaultStyles(styles, barStyles, lineStyles)

  /**
   * Sets up chatjs instance
   */
  const setupChart = React.useCallback(
    (params: TimeSeriesData) => {
      // If a root element is not found, Chart.js won't be able to render anything
      if (!rootRef.current) return

      const config = {
        bar: generateBarConfig({
          styles,
          barStyles,
          data: params
        }),
        line: generateLineConfig({
          styles,
          lineStyles,
          data: params
        })
      }[variant]

      new Chart(rootRef.current, config)

      rootRef.current.style.borderRadius = styles.canvas?.borderRadius as string
      rootRef.current.style.height = `${styles.canvas?.height}px`
      rootRef.current.style.width = `${styles.canvas?.width}px`
    },
    [styles, variant, barStyles, lineStyles]
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
        uniqueName: query?.metric,
        timeSeriesInput: {
          timeRange: query?.timeRange,
          granularity: query?.granularity
        }
      },
      {
        authorization: `Bearer ${query?.accessToken}`
      }
    )

    const metricData = response.metricByName.timeSeries

    const labels: string[] = [...metricData.labels]
    const values: number[] = [...metricData.values]
    return { labels, values }
  }, [query])

  React.useEffect(() => {
    const setup = async () => {
      const data = isDumb ? { labels, values } : await fetchData()
      setupChart(data)
    }
    setup()
  }, [isDumb, setupChart, fetchData, labels, values])

  return (
    <div className={scopedStyles.chartContainer}>
      <canvas ref={rootRef}></canvas>
    </div>
  )
}
