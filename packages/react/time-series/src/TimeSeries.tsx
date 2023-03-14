import React from 'react'
import request from 'graphql-request'
import { css } from '@emotion/css'
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
  CategoryScale,
  Tooltip,
  Chart as ChartJS,
  PointElement,
  Colors,
  TimeSeriesScale,
  LinearScale
} from 'chart.js'

import { Styles, TimeSeriesData, ChartVariant } from './types'
import { defaultChartHeight, defaultStyles } from './defaults'
import { generateConfig, useSetupDefaultStyles, getDefaultGranularity, formatLabels } from './utils'
import { ErrorFallback, ErrorFallbackProps } from './ErrorFallback'
import { Loader } from './Loader'

/**
 * It registers only the modules that will be used
 * in the context of a BarChart and LineChart so
 * we reduce bundle weight
 */
ChartJS.register(
  Tooltip,
  Colors,
  PointElement,
  BarElement,
  LineElement,
  BarController,
  LineController,
  TimeSeriesScale,
  CategoryScale,
  LinearScale
)

export interface TimeSeriesProps extends ErrorFallbackProps, React.ComponentProps<'canvas'> {
  /** The variant the chart will respond to, can be either `bar` or `line` */
  variant?: ChartVariant

  /** `styles` attribute can be either `BarStyles` or `LineStyles` */
  styles?: Styles

  /** If passed along with `values` the component will ignore the built-in graphql operations */
  labels?: TimeSeriesData['labels']

  /** If passed along with `labels` the component will ignore the built-in graphql operations  */
  values?: TimeSeriesData['values']

  /** When true, shows a skeleton loader */
  loading?: boolean

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

    /** Timestamp format that the chart will respond to */
    timestampFormat?: string
  }
  /** Format function for labels, must return an array with the new labels */
  labelFormatter?: (labels: string[]) => string[]
}

export function TimeSeries(props: TimeSeriesProps) {
  const { variant = 'bar', styles, labels, values, query, error, loading = false, labelFormatter, ...rest } = props

  const granularity = query?.granularity || getDefaultGranularity(query?.timeRange)
  const [hasError, setHasError] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [serverData, setServerData] = React.useState<TimeSeriesData>()

  const id = React.useId()

  /**
   * The html node where the chart will render
   */
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  const chartRef = React.useRef<ChartJS | null>()

  /**
   * Checks if the component is in `static` or `connected` mode
   */
  const isStatic = !query

  const isFormatted = !!labelFormatter

  useSetupDefaultStyles(styles)

  const renderChart = (data?: TimeSeriesData) => {
    if (!canvasRef.current || !data || (variant !== 'bar' && variant !== 'line')) return

    chartRef.current = new ChartJS(
      canvasRef.current,
      generateConfig({
        variant,
        styles,
        data,
        isFormatted,
        granularity
      })
    )

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
    canvasRef.current.style.borderRadius = styles?.canvas?.borderRadius || defaultStyles.canvas?.borderRadius!
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
  const fetchData = async () => {
    const response = await request(
      PROPEL_GRAPHQL_API_ENDPOINT,
      TimeSeriesDocument,
      {
        uniqueName: query?.metric,
        timeSeriesInput: {
          timeRange: query?.timeRange,
          granularity,
          filters: query?.filters,
          propeller: query?.propeller
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
  }

  React.useEffect(() => {
    function handlePropsMismatch() {
      if (isStatic && !labels && !values) {
        console.error('InvalidPropsError: You must pass either `labels` and `values` or `query` props')
        setHasError(true)
        return
      }

      if (isStatic && (!labels || !values)) {
        console.error('InvalidPropsError: When passing the data via props you must pass both `labels` and `values`')
        setHasError(true)
        return
      }
      if (!isStatic && (!query.accessToken || !query.metric || !query.timeRange)) {
        console.error(
          'InvalidPropsError: When opting for fetching data you must pass at least `accessToken`, `metric` and `timeRange` in the `query` prop'
        )
        setHasError(true)
        return
      }
    }

    if (!loading) {
      handlePropsMismatch()
    }
  }, [isStatic, labels, values, query, loading])

  React.useEffect(() => {
    async function fetchChartData() {
      try {
        setIsLoading(true)
        const data = await fetchData()
        setServerData(data)
      } catch {
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }
    if (!isStatic) {
      fetchChartData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStatic, query?.timeRange, query?.filters, query?.propeller, query?.granularity])

  React.useEffect(() => {
    if (isStatic) {
      destroyChart()
      const formattedLabels = formatLabels({ labels, formatter: labelFormatter })
      renderChart({ labels: formattedLabels, values })
    }

    return () => {
      destroyChart()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStatic, loading, styles, variant, labels, values])

  React.useEffect(() => {
    if (serverData && !isStatic) {
      const { labels, values } = serverData

      destroyChart()
      const formattedLabels = formatLabels({ labels, formatter: labelFormatter })
      renderChart({ labels: formattedLabels, values })
    }

    return () => {
      destroyChart()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverData, variant, styles, isStatic])

  if (isLoading || loading) {
    return <Loader styles={styles} />
  }

  if (hasError) {
    return <ErrorFallback error={error} styles={styles} />
  }

  return (
    <div className={getContainerStyles(styles)}>
      <canvas
        id={id}
        ref={canvasRef}
        width={styles?.canvas?.width}
        height={styles?.canvas?.height || defaultChartHeight}
        role="img"
        {...rest}
      />
    </div>
  )
}

const getContainerStyles = (styles?: Styles) => css`
  width: ${styles?.canvas?.width};
  height: ${styles?.canvas?.height || defaultChartHeight};
`
