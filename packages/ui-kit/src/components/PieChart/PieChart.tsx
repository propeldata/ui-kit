import { Chart as ChartJS, ChartConfiguration, Plugin } from 'chart.js/auto'
import classnames from 'classnames'
import React from 'react'
import {
  customCanvasBackgroundColor,
  getCustomChartLabelsPlugin,
  getTimeZone,
  useCombinedRefsCallback,
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
import { emptyStatePlugin } from './plugins/empty'

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
      baseTheme = 'lightTheme',
      loading: isLoadingStatic = false,
      chartProps = {},
      labelListClassName,
      chartConfigProps,
      ...rest
    }: PieChartProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>
  ) => {
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
      baseTheme,
      renderLoader,
      errorFallback,
      renderEmpty
    })

    const [isEmptyState, setIsEmptyState] = React.useState(false)
    const [propsMismatch, setPropsMismatch] = React.useState(false)

    const idRef = React.useRef(idCounter++)
    const id = `piechart-${idRef.current}`

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
    } = useLeaderboard({ ...query, timeZone, dimensions: [query?.dimension ?? { columnName: '' }], enabled: !isStatic })

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

    const defaultChartColorPalette = React.useMemo(
      () => [
        theme?.colorBlue800,
        theme?.colorBlue700,
        theme?.colorBlue600,
        theme?.colorBlue500,
        theme?.colorBlue400,
        theme?.colorBlue300,
        theme?.colorBlue200,
        theme?.colorBlue100,
        theme?.colorBlue50,
        theme?.colorBlue25
      ],
      [theme]
    )

    const totalValue = isStatic ? rows?.reduce((a, b) => a + Number(b[1]), 0) ?? 0 : Number(counterData?.counter?.value)

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
        } = chartProps

        const labels = data.rows?.map((row) => row[0]) ?? []
        const values = data.rows?.map((row) => Number(row[1])) ?? []

        if (values.length === 0 && renderEmptyComponent) {
          setIsEmptyState(true)
          return
        }

        const customChartLabelsPlugin: Plugin<PieChartVariant> = getCustomChartLabelsPlugin({
          theme,
          hideTotal
        })

        const customPlugins = {
          customCanvasBackgroundColor: {
            color: card ? theme?.bgPrimary : 'transparent'
          },
          title: {
            display: isPie && !hideTotal,
            text: `Total: ${totalValue.toLocaleString()}`,
            position: totalPosition
          },
          legend: {
            display: showValues ? false : !hideLegend,
            position: legendPosition,
            labels: {
              usePointStyle: true,
              pointStyle: '*',
              pointStyleWidth: 8,
              boxHeight: 6
            }
          },
          emptyDoughnut: {
            color: theme?.colorPrimary,
            width: 2,
            radiusDecrease: 20
          },
          customChartLabelsPlugin
        }

        const datasets = isDoughnut ? { cutout: '75%' } : { cutout: '0' }

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

          // const newOptions =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          chart.options = { ...config.options }

          if (JSON.stringify(chart.data) !== JSON.stringify(config.data)) {
            chart.data = { ...config.data }
          }

          chart.update()
          return
        }

        chartRef.current = new ChartJS(canvasRef.current, config) as ChartJS
        canvasRef.current.style.borderRadius = '0px'
      },
      [
        variant,
        theme,
        card,
        chartProps,
        chartConfig,
        isDoughnut,
        showValues,
        isPie,
        totalValue,
        defaultChartColorPalette,
        chartConfigProps,
        renderEmptyComponent
      ]
    )

    const destroyChart = () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }

    const otherLabel = chartProps?.otherLabel ?? 'Other'

    // Calculate the other value and add it to the leaderboardData
    const fetchedData = React.useMemo(() => {
      if (!leaderboardData || !counterData) {
        return
      }

      const leaderboardTotalValue = leaderboardData?.leaderboard?.rows.reduce((a, b) => a + Number(b[1]), 0) ?? 0
      const counterValue = Number(counterData?.counter?.value ?? '0')

      if (counterValue > leaderboardTotalValue) {
        leaderboardData?.leaderboard?.rows.push([otherLabel, (counterValue - leaderboardTotalValue).toString()])
      }

      return leaderboardData
    }, [leaderboardData, counterData, otherLabel])

    const loadingStyles = {
      opacity: isLoading || isLoadingStatic ? '0.3' : '1',
      transition: 'opacity 0.2s ease-in-out'
    }

    // @TODO: we should abstract this logic to a hook
    React.useEffect(() => {
      function handlePropsMismatch() {
        if (isStatic && !headers && !rows) {
          // console.error('InvalidPropsError: You must pass either `headers` and `rows` or `query` props') we will set logs as a feature later
          setPropsMismatch(true)
          return
        }

        if (isStatic && (!headers || !rows)) {
          // console.error('InvalidPropsError: When passing the data via props you must pass both `headers` and `rows`') we will set logs as a feature later
          setPropsMismatch(true)

          return
        }

        if (
          !isStatic &&
          (hasError?.name === 'AccessTokenError' ||
            !query.metric ||
            !query.timeRange ||
            !query.dimension ||
            !query.rowLimit)
        ) {
          // console.error(
          //   'InvalidPropsError: When opting for fetching data you must pass at least `accessToken`, `metric`, `dimensions`, `rowLimit` and `timeRange` in the `query` prop'
          // ) we will set logs as a feature later
          setPropsMismatch(true)
          return
        }

        if (variant !== 'pie' && variant !== 'doughnut') {
          // console.error('InvalidPropsError: `variant` prop must be either `pie` or `doughnut`') we will set logs as a feature later
          setPropsMismatch(false)
        }

        setPropsMismatch(false)
      }

      if (!isLoadingStatic) {
        handlePropsMismatch()
      }
    }, [isStatic, headers, rows, query, isLoadingStatic, variant, hasError?.name])

    React.useEffect(() => {
      if (isStatic) {
        renderChart({ headers, rows })
      }
    }, [isStatic, isLoadingStatic, variant, headers, rows, renderChart])

    React.useEffect(() => {
      if (fetchedData?.leaderboard && !isStatic) {
        renderChart(fetchedData.leaderboard)
      }
    }, [fetchedData, variant, isStatic, renderChart])

    React.useEffect(() => {
      return () => {
        destroyChart()
      }
    }, [])

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
        {...rest}
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
