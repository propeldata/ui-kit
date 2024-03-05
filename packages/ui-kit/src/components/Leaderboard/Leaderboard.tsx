import { Chart as ChartJS, ChartConfiguration, Plugin } from 'chart.js'
import classnames from 'classnames'
import React from 'react'
import {
  customCanvasBackgroundColor,
  formatLabels,
  getCustomChartLabelsPlugin,
  getPixelFontSizeAsNumber,
  getTimeZone,
  LeaderboardLabels,
  useCombinedRefsCallback,
  withThemeWrapper
} from '../../helpers'
import { ErrorFallback, ErrorFallbackProps } from '../ErrorFallback'
import { Loader, LoaderProps } from '../Loader'
import { useSetupTheme } from '../ThemeProvider'
import { withContainer } from '../withContainer'
import componentStyles from './Leaderboard.module.scss'
import type { LeaderboardData, LeaderboardProps } from './Leaderboard.types'
import { getTableSettings, getValueWithPrefixAndSufix } from './utils'
import { ValueBar } from './ValueBar'
import { useLeaderboard } from '../../hooks/useLeaderboard'

let idCounter = 0

export const LeaderboardComponent = React.forwardRef<HTMLDivElement, LeaderboardProps>(
  (
    {
      variant = 'bar',
      headers,
      rows,
      query,
      error,
      className,
      chartConfigProps,
      loading: isLoadingStatic = false,
      tableProps = {},
      chartProps = {},
      baseTheme = 'lightTheme',
      labelFormatter,
      timeZone,
      loaderProps: loaderPropsInitial,
      renderLoader,
      errorFallbackProps: errorFallbackPropsInitial,
      errorFallback,
      renderEmpty,
      style,
      card = false,
      ...rest
    },
    forwardedRef
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
    } = useSetupTheme<'bar'>({
      componentContainer,
      baseTheme,
      renderLoader,
      errorFallback,
      renderEmpty
    })

    const [propsMismatch, setPropsMismatch] = React.useState(false)
    const [isEmptyState, setIsEmptyState] = React.useState(false)

    const idRef = React.useRef(idCounter++)
    const id = `leaderboard-${idRef.current}`

    /**
     * The html node where the chart will render
     */
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const chartRef = React.useRef<ChartJS | null>()

    /**
     * Checks if the component is in `static` or `connected` mode
     */
    const isStatic = !query

    const renderChart = React.useCallback(
      (data?: LeaderboardData) => {
        if (!canvasRef.current || !data || variant === 'table' || !theme || !chartConfig) {
          return
        }

        const { labelPosition = 'axis', showBarValues = false } = chartProps

        const labels =
          formatLabels({
            labels: data.rows?.map((row) => row.slice(0, row.length - 1)) as LeaderboardLabels,
            formatter: labelFormatter
          }) || []

        const values =
          data.rows?.map((row) => (row[row.length - 1] === null ? null : Number(row[row.length - 1]))) || []

        if (values.length === 0 && renderEmptyComponent) {
          setIsEmptyState(true)
          return
        }

        const customChartLabelsPlugin: Plugin<'bar'> = getCustomChartLabelsPlugin({
          theme,
          labelPosition,
          showBarValues
        })

        const customPlugins = {
          customCanvasBackgroundColor: {
            color: card ? theme?.bgPrimary : 'transparent'
          },
          legend: {
            display: false
          },
          customChartLabelsPlugin
        }

        let config: ChartConfiguration<'bar'> = {
          ...chartConfig,
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                data: values,
                backgroundColor: theme?.accent,
                barThickness: labelPosition === 'top' ? 8 : 17,
                borderRadius: parseInt(theme?.borderRadiusXs as string) ?? 4,
                borderWidth: 0
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
                display: true,
                grid: {
                  drawOnChartArea: false,
                  color: theme.colorSecondary
                },
                border: {
                  color: theme.colorSecondary
                },
                ticks: {
                  font: {
                    size: getPixelFontSizeAsNumber(theme.tinyFontSize)
                  }
                },
                beginAtZero: true
              },
              y: {
                display: labelPosition === 'axis',
                grid: {
                  drawOnChartArea: true,
                  drawTicks: false,
                  color: theme.colorSecondary
                },
                border: {
                  display: false
                },
                ticks: {
                  padding: 17,
                  font: {
                    size: getPixelFontSizeAsNumber(theme.tinyFontSize)
                  }
                }
              }
            }
          },
          plugins: [customCanvasBackgroundColor, customChartLabelsPlugin]
        }

        if (chartConfigProps) {
          config = chartConfigProps(config)
        }

        if (chartRef.current) {
          const chart = chartRef.current

          chart.options = { ...config.options }

          if (JSON.stringify(chart.data) !== JSON.stringify(config.data)) {
            chart.data = { ...config.data }
          }

          chart.update('none')
          return
        }

        chartRef.current = new ChartJS(canvasRef.current, config)
        canvasRef.current.style.borderRadius = '0px'
      },
      [variant, theme, card, chartProps, chartConfig, chartConfigProps, labelFormatter, renderEmptyComponent]
    )

    const destroyChart = () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }

    const {
      data: fetchedData,
      isLoading,
      error: hasError
    } = useLeaderboard({ ...query, timeZone: getTimeZone(query?.timeZone ?? timeZone), enabled: !isStatic })

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

        if (variant !== 'bar' && variant !== 'table') {
          // console.error('InvalidPropsError: `variant` prop must be either `bar` or `table`') we will set logs as a feature later
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
      if (variant === 'table') {
        destroyChart()
      }
    }, [variant])

    React.useEffect(() => {
      return () => {
        destroyChart()
      }
    }, [])

    React.useEffect(() => {
      if (variant === 'table') {
        destroyChart()
      }
    }, [variant])

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

    const isNoContainerRef =
      (variant === 'bar' && !canvasRef.current) ||
      (variant === 'table' && !innerRef?.current?.getAttribute('data-container'))

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

    if (variant === 'bar') {
      return (
        <div
          ref={setRef}
          className={classnames(componentStyles.rootLeaderboard, className)}
          style={style}
          {...rest}
          data-container
        >
          <canvas id={id} ref={canvasRef} role="img" style={loadingStyles} />
        </div>
      )
    }

    const tableHeaders = headers?.length ? headers : fetchedData?.leaderboard?.headers
    const tableRows = isStatic ? rows : fetchedData?.leaderboard?.rows

    const {
      headersWithoutValue,
      isOrdered,
      maxValue,
      rowsWithoutValue,
      valueHeader,
      valuesByRow,
      numberValuesByRow,
      isValidValueBar
    } = getTableSettings({
      headers: tableHeaders,
      rows: tableRows
    })

    const {
      stickyHeader = false,
      hasValueBar = false,
      localize = false,
      prefixValue,
      sufixValue,
      stickyValues = false
    } = tableProps

    const isValueBar = isValidValueBar && hasValueBar

    return (
      <div
        ref={setRef}
        className={classnames(componentStyles.rootLeaderboard, className)}
        style={{ ...style, ...loadingStyles }}
        {...rest}
        data-container
      >
        <table cellSpacing={0} className={classnames(stickyValues && componentStyles.stickyValues)}>
          <thead className={classnames(stickyHeader && componentStyles.stickyHeader)}>
            <tr>
              {headersWithoutValue?.map((header, index) => (
                <th key={`${header}-${index}`}>{header}</th>
              ))}
              <th
                data-role="table-value"
                className={classnames(componentStyles.valueHeader, isValueBar && componentStyles.valueWithValueBar)}
              >
                {valueHeader}
              </th>
              {isValueBar && <th data-role="table-value-bar" />}
            </tr>
          </thead>
          <tbody>
            {rowsWithoutValue?.map((cells, rowIndex) => (
              <tr key={rowIndex}>
                {cells.map((cell, cellIndex) => (
                  <td key={`${cell}-${cellIndex}`}>
                    {isOrdered && cellIndex === 0 && `${rowIndex + 1}. `}
                    {cell}
                  </td>
                ))}
                <td
                  data-role="table-value"
                  className={classnames(componentStyles.valueCell, isValueBar && componentStyles.valueWithValueBar)}
                >
                  {getValueWithPrefixAndSufix({
                    localize: localize,
                    prefix: prefixValue,
                    sufix: sufixValue,
                    value: valuesByRow?.[rowIndex] ?? undefined
                  })}
                </td>
                {isValueBar && (
                  <td data-role="table-value-bar">
                    <ValueBar value={numberValuesByRow?.[rowIndex] ?? 0} maxValue={maxValue ?? 0} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
)

LeaderboardComponent.displayName = 'LeaderboardComponent'

export const Leaderboard = withContainer(LeaderboardComponent, ErrorFallback) as typeof LeaderboardComponent
