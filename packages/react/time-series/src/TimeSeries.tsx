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

import { Styles, TimeSeriesData, ChartVariant } from './__types__'
import { defaultStyles } from './__defaults__'
import { generateConfig, useSetupDefaultStyles } from './__utils__'
// import scopedStyles from './TimeSeries.module.css'

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
  const { variant = 'bar', styles = defaultStyles, labels, values, query } = props

  const id = React.useId()

  const [chart, setChart] = React.useState<Chart>()
  /**
   * The html node where the chart will render
   */
  const rootRef = React.useRef<HTMLCanvasElement>(null)

  /**
   * Checks if the component is in `dumb` or `smart` mode
   */
  const hasValues = values && values.length > 0
  const hasLabels = labels && labels.length > 0
  const isDumb = hasValues && hasLabels

  useSetupDefaultStyles(styles)

  /**
   * Sets up chatjs instance
   */
  const setupChart = React.useCallback(
    (params: TimeSeriesData) => {
      // If a root element is not found, Chart.js won't be able to render anything
      if (!rootRef.current) return

      setChart(new Chart(rootRef.current, generateConfig({ variant, styles, data: params })))

      rootRef.current.style.borderRadius = styles.canvas?.borderRadius as string
      rootRef.current.style.height = `${styles.canvas?.height}px`
      rootRef.current.style.width = `${styles.canvas?.width}px`
    },
    [styles, variant]
  )

  /**
   * Fetches the time series data
   * when the user doesn't provide
   * its on `labels` and `values`
   */
  const fetchData = React.useCallback(async () => {
    if (!query?.accessToken || !query?.metric || !query?.timeRange) {
      console.error('error')
      return
    }

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
      if (data) {
        setupChart(data)
      }
    }
    setup()

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  }, [isDumb, setupChart, fetchData, labels, values, chart])

  return (
    // <div className={scopedStyles.chartContainer}>
    <div>
      <canvas id={id} ref={rootRef}></canvas>
    </div>
  )
}
