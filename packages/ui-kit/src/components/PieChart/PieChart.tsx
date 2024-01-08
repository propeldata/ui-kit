import React from 'react'
import { Chart as ChartJS, ChartConfiguration, Plugin } from 'chart.js/auto'
import classnames from 'classnames'
import componentStyles from './PieChart.module.scss'

import { customCanvasBackgroundColor, getCustomChartLabelsPlugin, useCombinedRefsCallback } from '../../helpers'
import { useSetupTheme } from '../ThemeProvider'
import { useCounter, useLeaderboard } from '../../hooks'
import { ErrorFallback } from '../ErrorFallback'
import { Loader } from '../Loader'
import { withContainer } from '../withContainer'
import { PieChartProps, PieChartData } from './PieChart.types'

const defaultChartColorPalette: string[] = [
  componentStyles.color_blue_800,
  componentStyles.color_blue_700,
  componentStyles.color_blue_600,
  componentStyles.color_blue_500,
  componentStyles.color_blue_400,
  componentStyles.color_blue_300,
  componentStyles.color_blue_200,
  componentStyles.color_blue_100,
  componentStyles.color_blue_50,
  componentStyles.color_blue_25
]

let idCounter = 0

export const PieChartComponent = React.forwardRef<HTMLDivElement, PieChartProps>(
  (
    {
      variant = 'pie',
      headers,
      rows,
      query,
      error,
      loaderProps,
      errorFallbackProps,
      card = false,
      className,
      style,
      baseTheme = 'lightTheme',
      loading: isLoadingStatic = false,
      chartProps = {},
      chartConfigProps,
      ...rest
    }: PieChartProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>
  ) => {
    const innerRef = React.useRef<HTMLDivElement>(null)
    const { componentContainer, setRef } = useCombinedRefsCallback({ innerRef, forwardedRef })
    const { theme, chartConfig } = useSetupTheme<'pie' | 'doughnut'>({ componentContainer, baseTheme })
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

    /**
     * Fetches the leaderboard data from the API
     */
    const {
      data: leaderboardData,
      isLoading: leaderboardIsLoading,
      error: leaderboardHasError
    } = useLeaderboard({ ...query })

    /**
     * Fetches the counter data from the API
     */
    const { data: counterData, isLoading: counterIsLoading, error: counterHasError } = useCounter({ ...query })

    const isLoading = leaderboardIsLoading || counterIsLoading

    const hasError = leaderboardHasError || counterHasError

    const isPie = variant === 'pie'
    const isDoughnut = variant === 'doughnut'

    const showValues = chartProps?.showValues ?? false

    const renderChart = React.useCallback(
      (data?: PieChartData) => {
        if (!canvasRef.current || !data || !theme || !chartConfig) {
          return
        }

        const { chartColorPlatte = defaultChartColorPalette, legendPosition = 'top', hideLegend = false } = chartProps

        const labels = data.rows?.map((row) => row[0]) ?? []

        const values = data.rows?.map((row) => Number(row[1])) ?? []

        const customChartLabelsPlugin: Plugin<'pie' | 'doughnut'> = getCustomChartLabelsPlugin({
          theme
        })

        const customPlugins = {
          customCanvasBackgroundColor: {
            color: card ? theme?.bgPrimary : 'transparent'
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
          customChartLabelsPlugin
        }

        const datasets = isDoughnut ? { cutout: '75%' } : { cutout: '0' }

        if (chartRef.current) {
          const chart = chartRef.current

          chart.data.labels = labels
          Object.assign(chart.data.datasets[0], {
            type: variant,
            data: values,
            backgroundColor: chartColorPlatte,
            ...datasets
          })

          chart.options.plugins = {
            ...chart.options.plugins,
            ...customPlugins
          }

          chart.update()
          return
        }

        let config: ChartConfiguration<'pie' | 'doughnut'> = {
          ...chartConfig,
          type: variant,
          data: {
            labels: labels,
            datasets: [
              {
                data: values,
                backgroundColor: chartColorPlatte,
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
              padding: 4
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
          plugins: [customCanvasBackgroundColor, customChartLabelsPlugin]
        }

        if (chartConfigProps) {
          config = chartConfigProps(config)
        }

        chartRef.current = new ChartJS(canvasRef.current, config) as ChartJS
        canvasRef.current.style.borderRadius = '0px'
      },
      [variant, theme, card, chartProps, chartConfig, isDoughnut, showValues, chartConfigProps]
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
            !query.dimensions ||
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
      return <ErrorFallback {...errorFallbackProps} error={error} />
    }

    const isNoContainerRef = (variant === 'pie' || variant === 'doughnut') && !canvasRef.current

    if (((isStatic && isLoadingStatic) || (!isStatic && isLoading)) && isNoContainerRef) {
      destroyChart()
      return <Loader {...loaderProps} />
    }

    const totalValue = isStatic ? rows?.reduce((a, b) => a + Number(b[1]), 0) ?? 0 : Number(counterData?.counter?.value)

    const getListItem = () => {
      if (showValues) {
        const _rows = isStatic ? rows : fetchedData?.leaderboard?.rows

        return (
          <div className={classnames(componentStyles.pieChartList, className)}>
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
      <>
        <div ref={setRef} className={classnames(componentStyles.rootPieChart, className)} style={style} {...rest}>
          <canvas id={id} ref={canvasRef} role="img" style={loadingStyles} />
        </div>
        {isPie && (
          <div className={classnames(componentStyles.pieChartTotalValue, className)}>
            <span>Total: </span>
            <span>{totalValue.toLocaleString()}</span>
          </div>
        )}
        {getListItem()}
      </>
    )
  }
)

PieChartComponent.displayName = 'PieChartComponent'

export const PieChart = withContainer(PieChartComponent, ErrorFallback) as typeof PieChartComponent
