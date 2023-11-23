import { Chart as ChartJS, ChartDataset, ChartOptions, ChartConfiguration, Color, LineController } from 'chart.js'
import * as chartJsAdapterLuxon from 'chartjs-adapter-luxon'
import classnames from 'classnames'
import React from 'react'
import {
  customCanvasBackgroundColor,
  formatLabels,
  getTimeZone,
  PROPEL_GRAPHQL_API_ENDPOINT,
  useSetupComponentDefaultChartStyles,
  useTimeSeriesQuery,
  useCombinedRefsCallback,
  convertHexToRGBA
} from '../../helpers'
import { ErrorFallback } from '../ErrorFallback'
import { Loader } from '../Loader'
import { useGlobalChartConfigProps, useTheme } from '../ThemeProvider'
import { withContainer } from '../withContainer'
import componentStyles from './TimeSeries.module.scss'
import type { TimeSeriesData, TimeSeriesProps, TimeSeriesChartVariant } from './TimeSeries.types'
import { getDefaultGranularity, getScales, tooltipTitleCallback } from './utils'

let idCounter = 0

// Add shadow to the line chart
class CustomLineController extends LineController {
  draw(): void {
    const ctx = (this.chart as ChartJS).ctx
    ctx.save()

    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 6

    super.draw()
    ctx.restore()
  }
}

CustomLineController.id = 'shadowLine'
CustomLineController.defaults = {
  ...LineController.defaults
}

ChartJS.register(CustomLineController)

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
      baseTheme,
      chartConfigProps,
      loaderProps,
      errorFallbackProps,
      card = false,
      chartProps = {},
      ...other
    },
    forwardedRef
  ) => {
    const innerRef = React.useRef<HTMLDivElement>(null)
    const { componentContainer, setRef } = useCombinedRefsCallback({ innerRef, forwardedRef })
    const theme = useTheme({ componentContainer, baseTheme })

    const globalChartConfigProps = useGlobalChartConfigProps()
    const isLoadingStatic = loading
    useSetupComponentDefaultChartStyles({ theme, globalChartConfigProps: globalChartConfigProps })

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
          (variant !== 'bar' && variant !== 'line') ||
          !theme
        ) {
          return
        }

        const { grid = false, fillArea = false } = chartProps

        const labels = formatLabels({ labels: data.labels, formatter: labelFormatter }) || []
        const values = data.values || []

        const plugins = [customCanvasBackgroundColor]

        const customPlugins = {
          customCanvasBackgroundColor: {
            color: card ? theme?.bgPrimary : 'transparent'
          },
          tooltip: {
            callbacks: {
              title: (context: { label: string }[]) => tooltipTitleCallback(context, granularity)
            }
          }
        }

        let backgroundColor: Color | CanvasGradient = theme?.accent

        const fill = fillArea && variant === 'line'
        if (fill) {
          const ctx = canvasRef.current.getContext('2d')
          backgroundColor = ctx.createLinearGradient(0, 0, 0, ctx.canvas.clientHeight)
          // @TODO: need to refactor this logic due to the possible different types of the color value, e.g. hex, rgb, rgba, etc.
          backgroundColor.addColorStop(0, convertHexToRGBA(theme?.accentHover, 0.35))
          backgroundColor.addColorStop(1, convertHexToRGBA(theme?.accentHover, 0.05))
        }

        const dataset = {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: backgroundColor,
              borderColor: theme?.accent,
              pointBackgroundColor: theme?.accentHover,
              pointHoverBackgroundColor: theme?.accentHover,
              pointHoverBorderWidth: 2,
              pointHoverBorderColor: theme?.bgPrimary,
              fill
            } as ChartDataset<TimeSeriesChartVariant>
          ]
        }

        // @TODO: need to refactor this logic
        const scales = getScales({ granularity, isFormatted, zone, chart: chartRef.current, variant, grid })

        if (chartRef.current) {
          const chart = chartRef.current
          chart.data.labels = labels
          chart.options.scales = scales
          chart.options.plugins = {
            ...chart.options.plugins,
            ...customPlugins
          }

          const dataset = chart.data.datasets[0]
          dataset.data = values

          chart.update()
          return
        }

        const options: ChartOptions<TimeSeriesChartVariant> = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: customPlugins,
          layout: {
            padding: parseInt(theme?.spaceXxs as string)
          },
          scales
        }

        let config: ChartConfiguration<TimeSeriesChartVariant> = {
          // @TODO: require to refactor
          type: variant === 'line' ? ('shadowLine' as TimeSeriesChartVariant) : 'bar',
          data: dataset,
          options,
          plugins
        }

        if (chartConfigProps) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          config = chartConfigProps(config)
        }

        chartRef.current = new ChartJS(canvasRef.current, config)
      },
      [granularity, hasError, isFormatted, variant, zone, theme, card, chartProps, labelFormatter, chartConfigProps]
    )

    const destroyChart = React.useCallback(() => {
      if (!chartRef.current) {
        return
      }

      chartRef.current.destroy()
      chartRef.current = null
    }, [chartRef])

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
    }, [isStatic, isLoadingStatic, variant, labels, values, renderChart])

    React.useEffect(() => {
      if (serverData && !isStatic) {
        const labels = serverData.timeSeries.labels ?? []
        const values = (serverData.timeSeries.values ?? []).map((value) => (value == null ? null : Number(value)))

        renderChart({ labels, values })
      }
    }, [serverData, variant, isStatic, renderChart])

    React.useEffect(() => {
      return () => {
        destroyChart()
      }
    }, [destroyChart])

    if (hasError || propsMismatch) {
      destroyChart()
      return <ErrorFallback error={error} {...errorFallbackProps} />
    }

    // @TODO: encapsulate this logic in a shared hook/component
    // @TODO: refactor the logic around the loading state, static and server data, and errors handling (data fetching and props mismatch)
    if (((isStatic && isLoadingStatic) || (!isStatic && isLoadingQuery)) && !canvasRef.current) {
      destroyChart()
      return <Loader {...loaderProps} />
    }

    return (
      <div ref={setRef} className={classnames(componentStyles.rootTimeSeries, className)} {...other}>
        <canvas
          id={id}
          ref={canvasRef}
          height={theme?.componentHeight}
          role={role || 'img'}
          aria-label={ariaLabel || ''}
          style={{
            opacity: isLoadingQuery || isLoadingStatic ? '0.3' : '1',
            transition: 'opacity 0.2s ease-in-out'
          }}
        />
      </div>
    )
  }
)

TimeSeriesComponent.displayName = 'TimeSeriesComponent'

export const TimeSeries = withContainer(TimeSeriesComponent, ErrorFallback) as typeof TimeSeriesComponent
