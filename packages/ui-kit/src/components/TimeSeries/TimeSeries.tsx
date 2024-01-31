import { Chart as ChartJS, ChartConfiguration, ChartDataset, ChartOptions, Color, LineController } from 'chart.js'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as chartJsAdapterLuxon from 'chartjs-adapter-luxon'
import classnames from 'classnames'
import React from 'react'
import {
  convertHexToRGBA,
  customCanvasBackgroundColor,
  formatLabels,
  getTimeZone,
  useForwardedRefCallback
} from '../../helpers'
import { ErrorFallback } from '../ErrorFallback'
import { Loader } from '../Loader'
import { useLog } from '../Log'
import { useSetupTheme } from '../ThemeProvider'
import { withContainer } from '../withContainer'
import componentStyles from './TimeSeries.module.scss'
import type { TimeSeriesChartVariant, TimeSeriesData, TimeSeriesProps } from './TimeSeries.types'
import { getDefaultGranularity, getNumericValues, getScales, tooltipTitleCallback } from './utils'
import { useTimeSeries } from '../../hooks'

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
      ...rest
    },
    forwardedRef
  ) => {
    const { componentContainer, setRef } = useForwardedRefCallback(forwardedRef)
    const type = variant === 'line' ? ('shadowLine' as TimeSeriesChartVariant) : 'bar'
    const { theme, chartConfig } = useSetupTheme<typeof type>({ componentContainer, baseTheme })
    const log = useLog()
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

    const {
      data: serverData,
      isLoading,
      error: hasError
    } = useTimeSeries({ ...query, granularity, timeZone: zone, enabled: !isStatic })

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

        const labels = formatLabels({ labels: data.labels, formatter: labelFormatter }) ?? []
        const values = getNumericValues(data.values, log)

        const plugins = [customCanvasBackgroundColor]

        const customPlugins = {
          customCanvasBackgroundColor: {
            color: card ? theme?.bgPrimary : 'transparent'
          },
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: (context: { label: string }[]) => tooltipTitleCallback(context, granularity)
            }
          }
        }

        let backgroundColor: Color | CanvasGradient = theme?.accent ?? ''

        const fill = fillArea && variant === 'line'
        if (fill) {
          const ctx = canvasRef.current.getContext('2d')
          if (ctx) {
            backgroundColor = ctx.createLinearGradient(0, 0, 0, ctx.canvas.clientHeight)
            // @TODO: need to refactor this logic due to the possible different types of the color value, e.g. hex, rgb, rgba, etc.
            backgroundColor.addColorStop(0, convertHexToRGBA(theme?.accentHover, 0.35))
            backgroundColor.addColorStop(1, convertHexToRGBA(theme?.accentHover, 0.05))
          }
        }

        const dataset = {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: backgroundColor,
              hoverBackgroundColor: theme?.accentHover,
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
        const scales = getScales({ granularity, isFormatted, zone, chart: chartRef.current, variant, grid, theme })

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
          ...chartConfig,
          type,
          data: dataset,
          options,
          plugins
        }

        if (chartConfigProps) {
          // @TODO: fix this complex type
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          config = chartConfigProps(config)
        }

        if (chartRef.current) {
          const chart = chartRef.current

          chart.data.labels = labels
          chart.options.scales = {
            ...chart.options.scales,
            ...scales
          }
          chart.options.plugins = {
            ...chart.options.plugins,
            ...customPlugins
          }

          const dataset = chart.data.datasets[0]
          dataset.data = values

          chartConfigProps?.(chart.config as never)

          chart.update()
          return
        }

        chartRef.current = new ChartJS(canvasRef.current, config)
      },
      [
        granularity,
        hasError,
        isFormatted,
        variant,
        zone,
        theme,
        card,
        chartProps,
        log,
        labelFormatter,
        chartConfigProps,
        type,
        chartConfig
      ]
    )

    const destroyChart = React.useCallback(() => {
      if (!chartRef.current) {
        return
      }

      chartRef.current.destroy()
      chartRef.current = null
    }, [chartRef])

    // @TODO: we should abstract this logic to a hook
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

        if (!isStatic && (hasError?.name === 'AccessTokenError' || !query?.metric || !query?.timeRange)) {
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
    }, [isStatic, labels, values, query, isLoadingStatic, hasError?.name])

    React.useEffect(() => {
      destroyChart()
    }, [destroyChart, variant])

    React.useEffect(() => {
      if (isStatic) {
        renderChart({ labels, values })
      }
    }, [isStatic, isLoadingStatic, variant, labels, values, renderChart])

    React.useEffect(() => {
      if (serverData && !isStatic) {
        const labels = serverData.timeSeries?.labels ?? []
        const values = (serverData.timeSeries?.values ?? []).map((value) => (value == null ? null : Number(value)))

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
    if (((isStatic && isLoadingStatic) || (!isStatic && isLoading)) && !canvasRef.current) {
      destroyChart()
      return <Loader {...loaderProps} />
    }

    return (
      <div ref={setRef} className={classnames(componentStyles.rootTimeSeries, className)} {...rest}>
        <canvas
          id={id}
          ref={canvasRef}
          height={theme?.componentHeight}
          role={role || 'img'}
          aria-label={ariaLabel || ''}
          style={{
            opacity: isLoading || isLoadingStatic ? '0.3' : '1',
            transition: 'opacity 0.2s ease-in-out'
          }}
        />
      </div>
    )
  }
)

TimeSeriesComponent.displayName = 'TimeSeriesComponent'

// @TODO: fix this complex type
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const TimeSeries = withContainer(TimeSeriesComponent, ErrorFallback) as typeof TimeSeriesComponent
