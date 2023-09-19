import { css } from '@emotion/css'
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Colors,
  LinearScale,
  LineController,
  LineElement,
  LogarithmicScale,
  PointElement,
  TimeSeriesScale,
  Tooltip
} from 'chart.js'
import React from 'react'
import {
  customCanvasBackgroundColor,
  getTimeZone,
  PROPEL_GRAPHQL_API_ENDPOINT,
  useTimeSeriesQuery
} from '../../helpers'
import * as chartJsAdapterLuxon from 'chartjs-adapter-luxon'
import { ChartPlugins, ChartStyles, defaultAriaLabel, defaultChartHeight, defaultStyles } from '../../themes'
import { ErrorFallback } from '../ErrorFallback'
import { Loader } from '../Loader'
import { withContainer } from '../withContainer'
import type { TimeSeriesData, TimeSeriesProps } from './TimeSeries.types'
import {
  formatLabels,
  getDefaultGranularity,
  getScales,
  tooltipTitleCallback,
  updateChartConfig,
  updateChartStyles,
  useSetupDefaultStyles
} from './utils'

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

// @TODO: refactor due to query and styles causing a re-render even if they are the same

export const TimeSeriesComponent: React.FC<TimeSeriesProps> = ({
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
  timeZone,
  ...rest
}) => {
  const isLoadingStatic = loading

  React.useEffect(() => {
    chartJsAdapterLuxon
  }, [])

  const granularity =
    query?.granularity ??
    getDefaultGranularity({
      timeRange: query?.timeRange,
      labels
    })
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

  const zone = timeZone ?? getTimeZone()

  useSetupDefaultStyles(styles)

  const {
    isInitialLoading: isLoadingQuery,
    error: hasError,
    data: serverData
  } = useTimeSeriesQuery(
    {
      endpoint: query?.propelApiUrl ?? PROPEL_GRAPHQL_API_ENDPOINT,
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
        timeZone: zone,
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
        },
        tooltip: {
          callbacks: {
            title: (context: { label: string }[]) => tooltipTitleCallback(context, granularity)
          }
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

      const scales = getScales({ granularity, isFormatted, styles, zone })

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
    [granularity, hasError, isFormatted, styles, variant, zone]
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

    if (!isLoadingStatic) {
      handlePropsMismatch()
    }
  }, [isStatic, labels, values, query, isLoadingStatic])

  React.useEffect(() => {
    if (isStatic) {
      const formattedLabels = formatLabels({ labels, formatter: labelFormatter })
      renderChart({ labels: formattedLabels, values })
    }
  }, [isStatic, isLoadingStatic, styles, variant, labels, values, labelFormatter, renderChart])

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
  if (((isStatic && isLoadingStatic) || (!isStatic && isLoadingQuery)) && !canvasRef.current) {
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
          opacity: isLoadingQuery || isLoadingStatic ? '0.3' : '1',
          transition: 'opacity 0.2s ease-in-out'
        }}
        {...rest}
      />
    </div>
  )
}

export const TimeSeries = withContainer(TimeSeriesComponent, ErrorFallback) as typeof TimeSeriesComponent

const getContainerStyles = (styles?: ChartStyles) => css`
  width: ${styles?.canvas?.width};
  height: ${styles?.canvas?.height || defaultChartHeight};
`
