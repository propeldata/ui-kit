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
  Chart as ChartJS,
  PointElement,
  Colors
} from 'chart.js'

import { Styles, TimeSeriesData, ChartVariant } from './__types__'
import { defaultStyles } from './__defaults__'
import { generateConfig, useSetupDefaultStyles } from './__utils__'

/**
 * It registers only the modules that will be used
 * in the context of a BarChart and LineChart so
 * we reduce bundle weight
 */
ChartJS.register(
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
  /**
   * The html node where the chart will render
   */
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  const chartRef = React.useRef<ChartJS | null>()

  /**
   * Checks if the component is in `dumb` or `smart` mode
   */
  const hasValues = values && values.length > 0
  const hasLabels = labels && labels.length > 0
  const isDumb = hasValues && hasLabels

  useSetupDefaultStyles(styles)

  const renderChart = (data?: TimeSeriesData) => {
    if (!canvasRef.current || !data) return

    chartRef.current = new ChartJS(canvasRef.current, generateConfig({ variant, styles, data }))

    canvasRef.current.style.borderRadius = styles.canvas?.borderRadius as string
    canvasRef.current.style.height = `${styles.canvas?.height}px`
    canvasRef.current.style.width = `${styles.canvas?.width}px`
  }

  const destroyChart = () => {
    if (chartRef.current) {
      chartRef.current.destroy()
      chartRef.current = null
    }
  }

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
    async function renderChartWithData() {
      const data = isDumb ? { labels, values } : await fetchData()
      renderChart(data)
    }
    renderChartWithData()
    return () => destroyChart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <canvas id={id} ref={canvasRef} role="img"></canvas>
    </div>
  )
}
