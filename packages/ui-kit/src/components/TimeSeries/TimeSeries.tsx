'use client'

import { Chart as ChartJS, ChartConfiguration, ChartOptions, Color, LineController } from 'chart.js'
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
  useEmptyableData,
  useForwardedRefCallback,
  withThemeWrapper
} from '../../helpers'
import { useTimeSeries } from '../../hooks'
import { useParsedComponentProps } from '../../themes'
import { ErrorFallback, ErrorFallbackProps } from '../ErrorFallback'
import { Loader, LoaderProps } from '../Loader'
import { useLog } from '../Log'
import { useSetupTheme } from '../ThemeProvider'
import { withContainer } from '../withContainer'
import componentStyles from './TimeSeries.module.scss'
import type { TimeSeriesChartVariant, TimeSeriesData, TimeSeriesProps } from './TimeSeries.types'
import { buildDatasets, getDefaultGranularity, getScales, tooltipTitleCallback } from './utils'

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
      timeZone: timeZoneInitial,
      className,
      chartConfigProps,
      loaderProps: loaderPropsInitial,
      renderLoader,
      errorFallbackProps: errorFallbackPropsInitial,
      errorFallback,
      renderEmpty,
      card = false,
      chartProps,
      ...rest
    },
    forwardedRef
  ) => {
    const { themeSettings, parsedProps } = useParsedComponentProps(rest)
    const { componentContainer, setRef } = useForwardedRefCallback(forwardedRef)
    const themeWrapper = withThemeWrapper(setRef)
    const type = variant === 'line' ? ('shadowLine' as TimeSeriesChartVariant) : 'bar'

    const {
      theme,
      chartConfig,
      renderLoader: renderLoaderComponent,
      errorFallback: errorFallbackComponent,
      renderEmpty: renderEmptyComponent
    } = useSetupTheme<typeof type>({
      componentContainer,
      renderLoader,
      errorFallback,
      renderEmpty,
      ...themeSettings
    })

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
    const timeZone = getTimeZone(query?.timeZone ?? timeZoneInitial)

    const {
      data: serverData,
      isLoading,
      error: hasError
    } = useTimeSeries({ ...query, timeZone, granularity, enabled: !isStatic })

    const destroyChart = React.useCallback(() => {
      if (!chartRef.current) {
        return
      }

      chartRef.current.destroy()
      chartRef.current = null
    }, [chartRef])

    const { data, isEmptyState, setData } = useEmptyableData<TimeSeriesData>({
      onEmptyData: destroyChart,
      isDataEmpty: (data) => !data.values || !data.labels || data.values.length === 0
    })

    const renderChart = React.useCallback(
      (data: TimeSeriesData) => {
        if (!canvasRef.current || hasError || !theme) {
          return
        }

        const { grid = false, fillArea = false } = chartProps ?? {}
        const labels = formatLabels({ labels: data.labels, formatter: labelFormatter }) ?? []

        const plugins = [customCanvasBackgroundColor]

        const customPlugins = {
          customCanvasBackgroundColor: {
            color: card ? 'transparent' : theme?.getVar('--propel-color-background')
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

        let backgroundColor: Color | CanvasGradient = theme?.getVar('--propel-accent-8') ?? ''

        const fill = fillArea && variant === 'line'
        if (fill) {
          const ctx = canvasRef.current.getContext('2d')
          if (ctx) {
            backgroundColor = ctx.createLinearGradient(0, 0, 0, ctx.canvas.clientHeight)
            // @TODO: need to refactor this logic due to the possible different types of the color value, e.g. hex, rgb, rgba, etc.
            backgroundColor.addColorStop(0, convertHexToRGBA(theme?.getVar('--propel-accent-10'), 0.35))
            backgroundColor.addColorStop(1, convertHexToRGBA(theme?.getVar('--propel-accent-10'), 0.05))
          }
        }

        const datasets = buildDatasets(data, theme, { fill }, log)

        const dataset = {
          labels,
          datasets
        }

        // @TODO: need to refactor this logic
        const scales = getScales({
          granularity,
          isFormatted,
          zone: timeZone,
          chart: chartRef.current,
          variant,
          grid,
          theme
        })

        const options: ChartOptions<TimeSeriesChartVariant> = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: customPlugins,
          layout: {
            padding: parseInt(theme?.getVar('--propel-space-4') ?? '') ?? 4
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

          chart.options = { ...config.options }

          if (JSON.stringify(chart.data) !== JSON.stringify(config.data)) {
            chart.data = { ...config.data }
          }

          chart.resize()
          chart.update('none')
          return
        }

        chartRef.current = new ChartJS(canvasRef.current, config)
      },
      [
        granularity,
        hasError,
        isFormatted,
        variant,
        timeZone,
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

    React.useEffect(() => {
      if (!isEmptyState && data) {
        renderChart(data)
      }
    }, [isEmptyState, data, renderChart])

    // @TODO: we should abstract this logic to a hook
    React.useEffect(() => {
      function handlePropsMismatch() {
        if (isStatic && !labels && !values) {
          log.error('InvalidPropsError: You must pass either `labels` and `values` or `query` props')
          setPropsMismatch(true)
          return
        }

        if (isStatic && (!labels || !values)) {
          log.error('InvalidPropsError: When passing the data via props you must pass both `labels` and `values`')
          setPropsMismatch(true)
          return
        }

        if (!isStatic && (hasError?.name === 'AccessTokenError' || !query?.metric)) {
          log.error(
            'InvalidPropsError: When opting for fetching data you must pass at least `accessToken` and `metric` in the `query` prop'
          )
          setPropsMismatch(true)
          return
        }

        setPropsMismatch(false)
      }

      if (!isLoadingStatic) {
        handlePropsMismatch()
      }
    }, [isStatic, labels, values, query, isLoadingStatic, hasError?.name, log])

    React.useEffect(() => {
      destroyChart()
    }, [destroyChart, variant])

    React.useEffect(() => {
      if (isStatic) {
        setData({ labels, values })
      }
    }, [isStatic, isLoadingStatic, variant, labels, values, setData])

    React.useEffect(() => {
      if (serverData && !isStatic) {
        const labels = serverData.timeSeries?.labels ?? []
        const values = (serverData.timeSeries?.values ?? []).map((value) => (value == null ? null : Number(value)))

        const groups = serverData.timeSeries?.groups?.map((group) => ({
          ...group,
          values: group.values.map((value) => (value == null ? null : Number(value)))
        }))

        setData({ labels, values, groups })
      }
    }, [serverData, variant, isStatic, setData])

    React.useEffect(() => {
      return () => {
        destroyChart()
      }
    }, [destroyChart])

    if (hasError || propsMismatch) {
      destroyChart()

      const errorFallbackProps: ErrorFallbackProps = {
        error,
        ...errorFallbackPropsInitial
      }

      if (errorFallbackComponent) {
        return themeWrapper(errorFallbackComponent({ errorFallbackProps, ErrorFallback, theme }))
      }

      return <ErrorFallback ref={setRef} {...errorFallbackProps} />
    }

    // @TODO: encapsulate this logic in a shared hook/component
    // @TODO: refactor the logic around the loading state, static and server data, and errors handling (data fetching and props mismatch)

    if (((isStatic && isLoadingStatic) || (!isStatic && isLoading)) && !canvasRef.current) {
      destroyChart()

      const loaderProps: LoaderProps = { ...loaderPropsInitial }

      if (renderLoaderComponent) {
        return themeWrapper(renderLoaderComponent({ loaderProps, Loader, theme }))
      }

      return <Loader ref={setRef} {...loaderProps} />
    }

    if (isEmptyState && renderEmptyComponent) {
      return themeWrapper(renderEmptyComponent({ theme }))
    }

    return (
      <div
        ref={setRef}
        className={classnames(componentStyles.rootTimeSeries, className)}
        {...parsedProps}
        data-container
      >
        <canvas
          id={id}
          ref={canvasRef}
          height={theme?.getVar('--propel-component-height')}
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
