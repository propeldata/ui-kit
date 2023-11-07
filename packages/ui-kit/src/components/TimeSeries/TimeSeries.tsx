import { Chart as ChartJS, ChartOptions } from 'chart.js'
import * as chartJsAdapterLuxon from 'chartjs-adapter-luxon'
import classnames from 'classnames'
import React from 'react'
import {
  customCanvasBackgroundColor,
  formatLabels,
  getTimeZone,
  PROPEL_GRAPHQL_API_ENDPOINT,
  useSetupComponentDefaultChartStyles,
  useTimeSeriesQuery
} from '../../helpers'
import { ChartPlugins, defaultAriaLabel, defaultChartHeight, defaultStyles } from '../../themes'
import themes from '../../themes/themes.module.css'
import { ErrorFallback } from '../ErrorFallback'
import { Loader } from '../Loader'
import { useGlobalChartProps, useTheme } from '../ThemeProvider'
import { withContainer } from '../withContainer'
import { useLog } from '../Log'
import componentStyles from './TimeSeries.module.css'
import type { TimeSeriesData, TimeSeriesProps } from './TimeSeries.types'
import {
  getDefaultGranularity,
  getNumericValues,
  getScales,
  tooltipTitleCallback,
  updateChartConfig
  // updateChartStyles,
} from './utils'
import { useAccessToken } from '../AccessTokenProvider/useAccessToken'

let idCounter = 0

// @TODO: refactor due to query and styles causing a re-render even if they are the same

export const TimeSeriesComponent = React.forwardRef<HTMLDivElement, TimeSeriesProps>(
  (
    {
      variant = 'bar',
      labels,
      values,
      query,
      error,
      loading = false,
      labelFormatter,
      ariaLabel,
      role,
      timeZone,
      className,
      chartProps,
      ...rest
    },
    forwardedRef
  ) => {
    const styles = undefined
    const theme = useTheme()
    const globalChartProps = useGlobalChartProps()
    const isLoadingStatic = loading
    useSetupComponentDefaultChartStyles({ theme, chartProps: globalChartProps })

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

    const {
      isInitialLoading: isLoadingQuery,
      error: hasError,
      data: serverData
    } = useTimeSeriesQuery(
      {
        endpoint: query?.propelApiUrl ?? PROPEL_GRAPHQL_API_ENDPOINT,
        fetchParams: {
          headers: {
            'content-type': 'application/graphql-response+json',
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
          filters: query?.filters
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
        if (
          !canvasRef.current ||
          !data?.labels ||
          !data.values ||
          hasError ||
          (variant !== 'bar' && variant !== 'line')
        )
          return

        const labels = formatLabels({ labels: data.labels, formatter: labelFormatter }) || []
        const values = data.values || []

        // const backgroundColor = styles?.[variant]?.backgroundColor || defaultStyles[variant].backgroundColor
        const backgroundColor = theme?.accent
        // console.log({ backgroundColor })
        const borderColor = styles?.[variant]?.borderColor || defaultStyles[variant].borderColor

        const plugins = [customCanvasBackgroundColor]

        const customPlugins: ChartPlugins = {
          customCanvasBackgroundColor: {
            // color: styles?.canvas?.backgroundColor
            color: theme?.bgPrimary
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

        // const scales = getScales({ granularity, isFormatted, styles, zone })
        const scales = getScales({ granularity, isFormatted, zone })

        if (chartRef.current) {
          updateChartConfig({
            chart: chartRef.current,
            labels,
            values,
            scales,
            variant,
            customPlugins
          })

          // updateChartStyles({ theme: theme, chart: chartRef.current, styles, variant })

          chartRef.current.update()
          return
        }

        let options: ChartOptions = {
          responsive: !styles?.canvas?.width,
          maintainAspectRatio: false,
          plugins: customPlugins,
          layout: {
            padding: styles?.canvas?.padding || defaultStyles.canvas.padding
          },
          scales
        }

        if (chartProps) {
          options = chartProps(options)
        }

        console.log('Final', options)

        chartRef.current = new ChartJS(canvasRef.current, {
          type: variant,
          data: dataset,
          options,
          plugins
        })

        canvasRef.current.style.borderRadius = styles?.canvas?.borderRadius || defaultStyles.canvas.borderRadius
      },
      [granularity, hasError, isFormatted, styles, variant, zone, labelFormatter, theme, chartProps]
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
        renderChart({ labels, values })
      }
    }, [isStatic, isLoadingStatic, styles, variant, labels, values, renderChart])

    React.useEffect(() => {
      if (serverData && !isStatic) {
        const labels = serverData.timeSeries.labels ?? []
        const values = (serverData.timeSeries.values ?? []).map((value) => (value == null ? null : Number(value)))

        renderChart({ labels, values })
      }
    }, [serverData, variant, styles, isStatic, renderChart])

    React.useEffect(() => {
      return () => {
        destroyChart()
      }
    }, [])

    if (hasError || propsMismatch) {
      destroyChart()
      return <ErrorFallback error={error} />
    }

    // @TODO: encapsulate this logic in a shared hook/component
    // @TODO: refactor the logic around the loading state, static and server data, and errors handling (data fetching and props mismatch)
    if (((isStatic && isLoadingStatic) || (!isStatic && isLoadingQuery)) && !canvasRef.current) {
      destroyChart()
      return <Loader />
    }

    return (
      <div
        ref={forwardedRef}
        className={classnames(!theme?.themeClassName && themes.lightTheme, componentStyles.rootTimeSeries, className)}
      >
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
)

TimeSeriesComponent.displayName = 'TimeSeriesComponent'

export const TimeSeries = withContainer(TimeSeriesComponent, ErrorFallback) as typeof TimeSeriesComponent
