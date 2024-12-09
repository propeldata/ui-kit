'use client'

import { Chart as ChartJS, ChartConfiguration, Plugin } from 'chart.js/auto'
import classnames from 'classnames'
import React from 'react'
import * as radixColors from '@radix-ui/colors'
import {
  customCanvasBackgroundColor,
  getCustomChartLabelsPlugin,
  getPixelFontSizeAsNumber,
  getTimeZone,
  useCombinedRefsCallback,
  useEmptyableData,
  withThemeWrapper
} from '../../helpers'
import { useCounter } from '../../hooks/useCounter'
import { useLeaderboard } from '../../hooks/useLeaderboard'
import { ErrorFallback, ErrorFallbackProps } from '../ErrorFallback'
import { Loader, LoaderProps } from '../Loader'
import { useSetupTheme } from '../ThemeProvider'
import { withContainer } from '../withContainer'
import componentStyles from './PieChart.module.scss'
import { PieChartData, PieChartProps, PieChartVariant } from './PieChart.types'
import {
  AccentColors,
  grayColors,
  GrayColors,
  handleArbitraryColor,
  palette,
  PaletteColor,
  useParsedComponentProps
} from '../../themes'
import { emptyStatePlugin } from './plugins/empty'
import { useFilters } from '../FilterProvider'
import { useLog } from '../Log'
import { DEFAULT_MAX_GROUP_BY } from '../shared.consts'
import { buildDimensionsInput } from './utils'

let idCounter = 0

export const PieChartComponent = React.forwardRef<HTMLDivElement, PieChartProps>(
  (
    {
      variant = 'pie',
      headers,
      rows,
      query,
      error,
      loaderProps: loaderPropsInitial,
      renderLoader,
      errorFallbackProps: errorFallbackPropsInitial,
      errorFallback,
      renderEmpty,
      timeZone: timeZoneInitial,
      card = false,
      className,
      style,
      loading: isLoadingStatic = false,
      chartProps,
      labelListClassName,
      chartConfigProps,
      accentColors,
      otherColor,
      showGroupByOther = true,
      ...rest
    }: PieChartProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>
  ) => {
    const { themeSettings, parsedProps } = useParsedComponentProps({
      ...rest,
      accentColor: (accentColors?.[0] as AccentColors) ?? rest.accentColor
    })
    const innerRef = React.useRef<HTMLDivElement>(null)
    const { componentContainer, setRef } = useCombinedRefsCallback({ innerRef, forwardedRef })
    const themeWrapper = withThemeWrapper(setRef)

    const {
      theme,
      chartConfig,
      renderLoader: renderLoaderComponent,
      errorFallback: errorFallbackComponent,
      renderEmpty: renderEmptyComponent
    } = useSetupTheme<PieChartVariant>({
      componentContainer,
      renderLoader,
      errorFallback,
      renderEmpty,
      ...themeSettings
    })

    const [propsMismatch, setPropsMismatch] = React.useState(false)

    const idRef = React.useRef(idCounter++)
    const id = `piechart-${idRef.current}`

    const { groupBy, emptyGroupBy, maxGroupBy } = useFilters()

    const log = useLog()

    /**
     * The html node where the chart will render
     */
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const chartRef = React.useRef<ChartJS | null>()

    /**
     * Checks if the component is in `static` or `connected` mode
     */
    const isStatic = !query

    const timeZone = getTimeZone(query?.timeZone ?? timeZoneInitial)

    /**
     * Fetches the leaderboard data from the API
     */
    const {
      data: leaderboardData,
      isLoading: leaderboardIsLoading,
      error: leaderboardHasError
    } = useLeaderboard({
      ...query,
      timeZone,
      dimensions: buildDimensionsInput(
        query?.dimensions ?? (query?.dimension && [query.dimension]) ?? [],
        groupBy,
        emptyGroupBy
      ),
      enabled: !isStatic,
      rowLimit: query?.rowLimit ?? maxGroupBy ?? DEFAULT_MAX_GROUP_BY
    })

    /**
     * Fetches the counter data from the API
     */
    const {
      data: counterData,
      isLoading: counterIsLoading,
      error: counterHasError
    } = useCounter({ ...query, timeZone, enabled: !isStatic })

    const isLoading = leaderboardIsLoading || counterIsLoading

    const hasError = leaderboardHasError || counterHasError

    const isPie = variant === 'pie'

    const isDoughnut = variant === 'doughnut'

    const showValues = chartProps?.showValues ?? false

    const defaultChartColorPalette = React.useMemo(() => {
      let customColors: PaletteColor[] = []

      const accentColor = accentColors?.[0] ?? theme?.accentColor

      let colorPos = palette.findIndex((value) => value?.name === accentColor)

      if (accentColors != null) {
        const isCustomColors = (accentColors?.length ?? 0) > 0

        if (isCustomColors) {
          customColors = accentColors.map(
            (color) =>
              palette.find(({ name }) => name === color) ?? {
                primary: handleArbitraryColor(color),
                secondary: handleArbitraryColor(color),
                name: color as AccentColors
              }
          )

          const lastColorName = customColors[customColors.length - 1]?.name
          const lastColorIndex = palette.findIndex((color) => color.name === lastColorName)

          colorPos = lastColorIndex + 1
        }
      }

      const additionalColors = palette.slice(colorPos)

      return [...customColors, ...additionalColors, ...palette].map(({ primary }) => primary)
    }, [accentColors, theme?.accentColor])

    const totalValue = isStatic
      ? rows?.reduce((a, b) => a + Number(b[b.length - 1]), 0) ?? 0
      : leaderboardData?.leaderboard?.rows.reduce((a, b) => a + Number(b[b.length - 1]), 0) ?? 0

    const destroyChart = React.useCallback(() => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }, [chartRef])

    const { data, isEmptyState, setData } = useEmptyableData<PieChartData>({
      onEmptyData: destroyChart,
      isDataEmpty: (data) => data.rows?.length === 0
    })

    const renderChart = React.useCallback(
      (data?: PieChartData) => {
        if (!canvasRef.current || !data || !theme || !chartConfig) {
          return
        }

        const {
          chartColorPalette = defaultChartColorPalette,
          legendPosition = 'top',
          hideLegend = false,
          hideTotal = false,
          totalPosition = 'bottom'
        } = chartProps ?? {}

        const labels = data.rows?.map((row) => row.slice(0, -1).join(', ')) ?? []
        const values = data.rows?.map((row) => Number(row[row.length - 1])) ?? []

        const customChartLabelsPlugin: Plugin<PieChartVariant> = getCustomChartLabelsPlugin({
          theme,
          hideTotal
        })

        const customPlugins = {
          customCanvasBackgroundColor: {
            color: card ? 'transparent' : theme?.getVar('--propel-color-background')
          },
          title: {
            display: isPie && !hideTotal,
            text: `Total: ${totalValue.toLocaleString()}`,
            position: totalPosition,
            font: {
              size: getPixelFontSizeAsNumber(theme?.getVar('--propel-font-size-2')) ?? 12
            }
          },
          legend: {
            display: showValues ? false : !hideLegend,
            position: legendPosition,
            labels: {
              usePointStyle: true,
              pointStyle: '*',
              pointStyleWidth: 8,
              boxHeight: 6,
              font: {
                size: getPixelFontSizeAsNumber(theme?.getVar('--propel-font-size-1')) ?? 12
              }
            }
          },
          emptyDoughnut: {
            color: theme?.getVar('--propel-accent-11'),
            width: 2,
            radiusDecrease: 20
          },
          customChartLabelsPlugin
        }

        const datasets = isDoughnut ? { cutout: '75%' } : { cutout: '0' }

        const otherIndex = labels.findIndex((label) => label === 'Other')

        if (otherIndex !== -1 && otherColor != null) {
          const isArbitraryGray = otherColor != null && !grayColors.includes(otherColor as GrayColors)

          const grayColor: PaletteColor = {
            name: 'gray',
            primary: isArbitraryGray
              ? handleArbitraryColor(otherColor ?? '')
              : theme.tokens[`${otherColor ?? theme.grayColor}8`] ?? radixColors.gray.gray8,
            secondary: isArbitraryGray
              ? handleArbitraryColor(otherColor ?? '')
              : theme.tokens[`${otherColor ?? theme.grayColor}10`] ?? radixColors.gray.gray10
          }

          chartColorPalette[otherIndex] = grayColor.primary
        }

        let config: ChartConfiguration<PieChartVariant> = {
          ...chartConfig,
          type: variant,
          data: {
            labels: labels,
            datasets: [
              {
                data: values,
                backgroundColor: chartColorPalette,
                borderWidth: 0,
                offset: 4,
                hoverOffset: 20,
                ...datasets
              }
            ]
          },
          options: {
            ...chartConfig.options,
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: 10
            },
            plugins: {
              ...chartConfig.options?.plugins,
              ...customPlugins
            },
            scales: {
              x: {
                display: false
              },
              y: {
                display: false
              }
            }
          },
          plugins: [customCanvasBackgroundColor, customChartLabelsPlugin, emptyStatePlugin]
        }

        if (chartConfigProps) {
          // @TODO: fix this complex type
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          config = chartConfigProps(config)
        }

        if (chartRef.current) {
          const chart = chartRef.current

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          chart.options = { ...config.options }

          if (JSON.stringify(chart.data) !== JSON.stringify(config.data)) {
            chart.data = { ...config.data }
          }

          chart.resize()
          chart.update('none')
          return
        }

        chartRef.current = new ChartJS(canvasRef.current, config) as ChartJS
        canvasRef.current.style.borderRadius = '0px'
      },
      [
        theme,
        chartConfig,
        defaultChartColorPalette,
        chartProps,
        card,
        isPie,
        totalValue,
        showValues,
        isDoughnut,
        otherColor,
        variant,
        chartConfigProps
      ]
    )

    React.useEffect(() => {
      if (!isEmptyState) {
        renderChart(data)
      }
    }, [isEmptyState, data, renderChart])

    const otherLabel = chartProps?.otherLabel ?? 'Other'

    // Calculate the other value and add it to the leaderboardData
    const fetchedData = React.useMemo(() => {
      if (!leaderboardData || !counterData) {
        return
      }

      const leaderboardTotalValue =
        leaderboardData?.leaderboard?.rows.reduce((a, b) => a + Number(b[b.length - 1]), 0) ?? 0
      const counterValue = Number(counterData?.counter?.value ?? '0')

      if (counterValue > leaderboardTotalValue && showGroupByOther) {
        leaderboardData?.leaderboard?.rows.push([otherLabel, (counterValue - leaderboardTotalValue).toString()])
      }

      return leaderboardData
    }, [leaderboardData, counterData, showGroupByOther, otherLabel])

    const loadingStyles = {
      opacity: isLoading || isLoadingStatic ? '0.3' : '1',
      transition: 'opacity 0.2s ease-in-out'
    }

    // @TODO: we should abstract this logic to a hook
    React.useEffect(() => {
      function handlePropsMismatch() {
        if (isStatic && !headers && !rows) {
          log.error('InvalidPropsError: You must pass either `headers` and `rows` or `query` props')
          setPropsMismatch(true)
          return
        }

        if (isStatic && (!headers || !rows)) {
          log.error('InvalidPropsError: When passing the data via props you must pass both `headers` and `rows`')
          setPropsMismatch(true)

          return
        }

        if (!isStatic && (hasError?.name === 'AccessTokenError' || !query.metric)) {
          log.error(
            'InvalidPropsError: When opting for fetching data you must pass at least `accessToken` and `metric` in the `query` prop'
          )
          setPropsMismatch(true)
          return
        }

        if (variant !== 'pie' && variant !== 'doughnut') {
          log.error('InvalidPropsError: `variant` prop must be either `pie` or `doughnut`')
          setPropsMismatch(false)
        }

        setPropsMismatch(false)
      }

      if (!isLoadingStatic) {
        handlePropsMismatch()
      }
    }, [isStatic, headers, rows, query, isLoadingStatic, variant, hasError?.name, log])

    React.useEffect(() => {
      if (isStatic) {
        setData({ headers, rows })
      }
    }, [isStatic, isLoadingStatic, variant, headers, rows, setData])

    React.useEffect(() => {
      if (fetchedData?.leaderboard && !isStatic) {
        setData(fetchedData.leaderboard)
      }
    }, [fetchedData, variant, isStatic, setData])

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

    const isNoContainerRef = (variant === 'pie' || variant === 'doughnut') && !canvasRef.current

    if (((isStatic && isLoadingStatic) || (!isStatic && isLoading)) && isNoContainerRef) {
      destroyChart()

      const loaderProps: LoaderProps = { ...loaderPropsInitial }

      if (renderLoaderComponent) {
        return themeWrapper(renderLoaderComponent({ loaderProps, Loader, theme }))
      }

      return <Loader ref={setRef} {...loaderProps} />
    }

    if (isEmptyState && renderEmptyComponent) {
      destroyChart()

      return themeWrapper(renderEmptyComponent({ theme }))
    }

    const getListItem = () => {
      if (showValues) {
        const _rows = isStatic ? rows : fetchedData?.leaderboard?.rows

        return (
          <div className={classnames(componentStyles.pieChartList, labelListClassName)}>
            <ul>
              {_rows?.map((row, index) => (
                <li key={`label-${index}`}>
                  <span>{row[0]}</span>
                  <span>{parseFloat(row[1] ?? '0').toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      }
    }

    return (
      <div
        ref={setRef}
        className={classnames(componentStyles.rootPieChart, className)}
        style={style}
        {...parsedProps}
        data-container
      >
        <div>
          <canvas id={id} ref={canvasRef} role="img" style={loadingStyles} />
        </div>
        {getListItem()}
      </div>
    )
  }
)

PieChartComponent.displayName = 'PieChartComponent'

// @TODO: fix this complex type
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const PieChart = withContainer(PieChartComponent, ErrorFallback) as typeof PieChartComponent
