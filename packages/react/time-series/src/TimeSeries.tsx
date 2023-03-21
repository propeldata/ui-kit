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
  LinearScale
} from 'chart.js'

// TODO (jonatassales): uncomment this once this is solved: https://linear.app/propel/issue/PRO-1961/chartjs-adapter-date-fns-exporting-esm-and-ui-kit-using-commonjs
// import 'chartjs-adapter-date-fns'

import { Styles, TimeSeriesData, ChartVariant } from './types'
import { defaultAriaLabel, defaultChartHeight, defaultStyles } from './defaults'
import { useSetupDefaultStyles, getDefaultGranularity, formatLabels } from './utils'
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
  }
  /** Format function for labels, must return an array with the new labels */
  labelFormatter?: (labels: string[]) => string[]
}

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

  const renderChart = React.useCallback(
    (data?: TimeSeriesData) => {
      if (!canvasRef.current || !data || (variant !== 'bar' && variant !== 'line')) return

      const hideGridLines = styles?.canvas?.hideGridLines || defaultStyles.canvas.hideGridLines
      const backgroundColor = styles?.[variant]?.backgroundColor || defaultStyles[variant].backgroundColor
      const borderColor = styles?.[variant]?.borderColor || defaultStyles[variant].borderColor

      const labels = data.labels || []
      const values = data.values || []

      const plugins = [customCanvasBackgroundColor]

      const customPlugins = {
        customCanvasBackgroundColor: {
          color: styles?.canvas?.backgroundColor
        }
        // TODO (jonatassales): fix this type issue
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any

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

      const scalesBase = {
        x: {
          display: !hideGridLines,
          grid: {
            drawOnChartArea: false
          },
          beginAtZero: true
        },
        y: {
          display: !hideGridLines,
          grid: { drawOnChartArea: true }
        }
      }

      const customFormatScales = {
        ...scalesBase
      }

      const autoFormatScales = {
        ...scalesBase,
        x: {
          ...scalesBase.x
          // TODO (jonatassales): uncomment this once this is solved: https://linear.app/propel/issue/PRO-1961/chartjs-adapter-date-fns-exporting-esm-and-ui-kit-using-commonjs
          // type: 'timeseries',
          // type: 'time',
          // time: {
          //   unit: getGranularityBasedUnit(granularity)
          // }
        }
      }

      chartRef.current = new ChartJS(canvasRef.current, {
        type: variant,
        data: dataset,
        options: {
          responsive: !styles?.canvas?.width,
          maintainAspectRatio: false,
          plugins: customPlugins,
          layout: {
            padding: styles?.canvas?.padding
          },
          scales: isFormatted ? customFormatScales : autoFormatScales
        },
        plugins
      })

      canvasRef.current.style.borderRadius = styles?.canvas?.borderRadius || defaultStyles.canvas.borderRadius
    },
    [isFormatted, styles, variant]
  )

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
  }, [granularity, query?.accessToken, query?.filters, query?.metric, query?.propeller, query?.timeRange])

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
  }, [isStatic, query?.timeRange, query?.filters, query?.propeller, query?.granularity, query?.accessToken, fetchData])

  React.useEffect(() => {
    if (isStatic) {
      destroyChart()
      const formattedLabels = formatLabels({ labels, formatter: labelFormatter })
      renderChart({ labels: formattedLabels, values })
    }

    return () => {
      destroyChart()
    }
  }, [isStatic, loading, styles, variant, labels, values, labelFormatter, renderChart])

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
  }, [serverData, variant, styles, isStatic, labelFormatter, renderChart])

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
        role={role || 'img'}
        aria-label={ariaLabel || defaultAriaLabel}
        {...rest}
      />
    </div>
  )
}

const getContainerStyles = (styles?: Styles) => css`
  width: ${styles?.canvas?.width};
  height: ${styles?.canvas?.height || defaultChartHeight};
`
