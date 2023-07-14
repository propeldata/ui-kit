import React from 'react'
import { css } from '@emotion/css'
import {
  TimeSeriesGranularity,
  TimeRangeInput,
  FilterInput,
  PROPEL_GRAPHQL_API_ENDPOINT,
  Propeller,
  useTimeSeriesQuery
} from '@propeldata/ui-kit-graphql'
import { customCanvasBackgroundColor } from '@propeldata/ui-kit-plugins'
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
  LinearScale,
  LogarithmicScale
} from 'chart.js'

import './chartJsAdapterDateFns'
import { Styles, TimeSeriesData, ChartVariant, ChartPlugins } from './types'
import { defaultAriaLabel, defaultChartHeight, defaultStyles } from './defaults'
import {
  useSetupDefaultStyles,
  getDefaultGranularity,
  formatLabels,
  updateChartStyles,
  updateChartConfig,
  getScales
} from './utils'
import { ErrorFallback, ErrorFallbackProps } from './ErrorFallback'
import { Loader } from './Loader'

/**
 * It registers only the modules that will be used
 * in the context of a BarChart and LineChart so
 * we reduce bundle weight
 */
ChartJS.register(
  LogarithmicScale,
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

let idCounter = 0

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

  /** Canvas aria-label prop, if not passed we handle it */
  ariaLabel?: string

  /** Canvas role prop, if not passed we handle it */
  role?: string

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

    /** Interval in milliseconds for refetching the data */
    refetchInterval?: number

    /** Whether to retry on errors. */
    retry?: boolean
  }
  /** Format function for labels, must return an array with the new labels */
  labelFormatter?: (labels: string[]) => string[]
}

// @TODO: refactor due to query and styles causing a re-render even if they are the same

export function TimeSeries(props: TimeSeriesProps) {
  const {
    variant = 'bar',
    styles,
    labels,
    values,
    query,
    error,
    loading = false,
    labelFormatter,
    ariaLabel,
    role,
    ...rest
  } = props

  const granularity = query?.granularity ?? getDefaultGranularity(query?.timeRange)
  const [propsMismatch, setPropsMismatch] = React.useState(false)

  const idRef = React.useRef(idCounter++)
  const id = `time-series-${idRef.current}`

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

  const {
    isLoading,
    error: hasError,
    data: serverData
  } = useTimeSeriesQuery(
    {
      endpoint: PROPEL_GRAPHQL_API_ENDPOINT,
      fetchParams: {
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${query?.accessToken}`
        }
      }
    },
    {
      timeSeriesInput: {
        metricName: query?.metric,
        timeRange: {
          relative: query?.timeRange?.relative ?? null,
          n: query?.timeRange?.n ?? null,
          start: query?.timeRange?.start ?? null,
          stop: query?.timeRange?.stop ?? null
        },
        granularity,
        filters: query?.filters,
        propeller: query?.propeller
      }
    },
    {
      refetchInterval: query?.refetchInterval,
      retry: query?.retry,
      enabled: !isStatic
    }
  )

  const renderChart = React.useCallback(
    (data?: TimeSeriesData) => {
      if (!canvasRef.current || !data?.labels || !data.values || hasError || (variant !== 'bar' && variant !== 'line'))
        return

      const labels = data.labels || []
      const values = data.values || []

      const backgroundColor = styles?.[variant]?.backgroundColor || defaultStyles[variant].backgroundColor
      const borderColor = styles?.[variant]?.borderColor || defaultStyles[variant].borderColor

      const plugins = [customCanvasBackgroundColor]

      const customPlugins: ChartPlugins = {
        customCanvasBackgroundColor: {
          color: styles?.canvas?.backgroundColor
        }
      }

      const dataset = {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor,
            borderColor
          }
        ]
      }

      const scales = getScales({ granularity, isFormatted, isStatic, styles })

      if (chartRef.current) {
        updateChartConfig({
          chart: chartRef.current,
          labels,
          values,
          scales,
          variant,
          customPlugins
        })

        updateChartStyles({ chart: chartRef.current, styles, variant })

        chartRef.current.update()
        return
      }

      chartRef.current = new ChartJS(canvasRef.current, {
        type: variant,
        data: dataset,
        options: {
          responsive: !styles?.canvas?.width,
          maintainAspectRatio: false,
          plugins: customPlugins,
          layout: {
            padding: styles?.canvas?.padding || defaultStyles.canvas.padding
          },
          scales
        },
        plugins
      })

      canvasRef.current.style.borderRadius = styles?.canvas?.borderRadius || defaultStyles.canvas.borderRadius
    },
    [granularity, hasError, isFormatted, isStatic, styles, variant]
  )

  const destroyChart = () => {
    if (chartRef.current) {
      chartRef.current.destroy()
      chartRef.current = null
    }
  }

  React.useEffect(() => {
    function handlePropsMismatch() {
      if (isStatic && !labels && !values) {
        // console.error('InvalidPropsError: You must pass either `labels` and `values` or `query` props') we will set logs as a feature later
        setPropsMismatch(true)
        return
      }

      if (isStatic && (!labels || !values)) {
        // console.error('InvalidPropsError: When passing the data via props you must pass both `labels` and `values`') we will set logs as a feature later
        setPropsMismatch(true)
        return
      }

      if (!isStatic && (!query.accessToken || !query.metric || !query.timeRange)) {
        // console.error(
        //   'InvalidPropsError: When opting for fetching data you must pass at least `accessToken`, `metric` and `timeRange` in the `query` prop'
        // ) we will set logs as a feature later
        setPropsMismatch(true)
        return
      }

      setPropsMismatch(false)
    }

    if (!loading) {
      handlePropsMismatch()
    }
  }, [isStatic, labels, values, query, loading])

  React.useEffect(() => {
    if (isStatic) {
      const formattedLabels = formatLabels({ labels, formatter: labelFormatter })
      renderChart({ labels: formattedLabels, values })
    }
  }, [isStatic, loading, styles, variant, labels, values, labelFormatter, renderChart])

  React.useEffect(() => {
    if (serverData && !isStatic) {
      const labels = serverData.timeSeries.labels ?? []
      const values = (serverData.timeSeries.values ?? []).map((value) => (value == null ? null : Number(value)))

      const formattedLabels = formatLabels({ labels, formatter: labelFormatter })
      renderChart({ labels: formattedLabels, values })
    }
  }, [serverData, variant, styles, isStatic, labelFormatter, renderChart])

  React.useEffect(() => {
    return () => {
      destroyChart()
    }
  }, [])

  if (hasError || propsMismatch) {
    destroyChart()
    return <ErrorFallback error={error} styles={styles} />
  }

  // @TODO: encapsulate this logic in a shared hook/component
  // @TODO: refactor the logic around the loading state, static and server data, and errors handling (data fetching and props mismatch)
  if (((isStatic && loading) || (!isStatic && isLoading)) && !canvasRef.current) {
    destroyChart()
    return <Loader styles={styles} />
  }

  return (
    <div className={getContainerStyles(styles)}>
      <canvas
        id={id}
        ref={canvasRef}
        width={styles?.canvas?.width}
        height={styles?.canvas?.height || defaultChartHeight}
        role={role || 'img'}
        aria-label={ariaLabel || defaultAriaLabel}
        style={{
          opacity: isLoading || loading ? '0.3' : '1',
          transition: 'opacity 0.2s ease-in-out'
        }}
        {...rest}
      />
    </div>
  )
}

const getContainerStyles = (styles?: Styles) => css`
  width: ${styles?.canvas?.width};
  height: ${styles?.canvas?.height || defaultChartHeight};
`
