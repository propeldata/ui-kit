'use client'

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
  useEmptyableData,
  withThemeWrapper
} from '../../helpers'
import { useLeaderboard } from '../../hooks/useLeaderboard'
import {
  useParsedComponentProps,
  accentColors as accentColorsDict,
  AccentColors,
  handleArbitraryColor
} from '../../themes'
import { ErrorFallback, ErrorFallbackProps } from '../ErrorFallback'
import { Loader, LoaderProps } from '../Loader'
import { useSetupTheme } from '../ThemeProvider'
import { withContainer } from '../withContainer'
import componentStyles from './Leaderboard.module.scss'
import type { LeaderboardData, LeaderboardProps } from './Leaderboard.types'
import { getTableSettings, getValueWithPrefixAndSufix } from './utils'
import { ValueBar } from './ValueBar'

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
      tableProps,
      chartProps,
      labelFormatter,
      timeZone,
      loaderProps: loaderPropsInitial,
      renderLoader,
      errorFallbackProps: errorFallbackPropsInitial,
      errorFallback,
      renderEmpty,
      style,
      accentColors = [],
      card = false,
      ...rest
    },
    forwardedRef
  ) => {
    const { themeSettings, parsedProps } = useParsedComponentProps({
      ...rest,
      accentColor: (accentColors[0] as AccentColors) ?? rest.accentColor
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
    } = useSetupTheme<'bar'>({
      componentContainer,
      renderLoader,
      errorFallback,
      renderEmpty,
      ...themeSettings
    })

    const [propsMismatch, setPropsMismatch] = React.useState(false)

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

    const destroyChart = React.useCallback(() => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }, [chartRef])

    const { data, isEmptyState, setData } = useEmptyableData<LeaderboardData>({
      onEmptyData: destroyChart,
      isDataEmpty: (data) => data.rows?.length === 0
    })

    const renderChart = React.useCallback(
      (data?: LeaderboardData) => {
        if (!canvasRef.current || !data || variant === 'table' || !theme || !chartConfig) {
          return
        }

        const { labelPosition = 'axis', showBarValues = false } = chartProps ?? {}

        const labels =
          formatLabels({
            labels: data.rows?.map((row) => row.slice(0, row.length - 1)) as LeaderboardLabels,
            formatter: labelFormatter
          }) || []

        const values =
          data.rows?.map((row) => (row[row.length - 1] === null ? null : Number(row[row.length - 1]))) || []

        const customChartLabelsPlugin: Plugin<'bar'> = getCustomChartLabelsPlugin({
          theme,
          labelPosition,
          showBarValues
        })

        const customPlugins = {
          customCanvasBackgroundColor: {
            color: card ? 'transparent' : theme?.getVar('--propel-color-background')
          },
          legend: {
            display: false
          },
          customChartLabelsPlugin
        }

        const borderRadius = Math.max(
          getPixelFontSizeAsNumber(theme?.getVar('--propel-radius-2')),
          getPixelFontSizeAsNumber(theme?.getVar('--propel-radius-full'))
        )

        const accentColor = accentColors[0] ?? theme.accentColor

        let config: ChartConfiguration<'bar'> = {
          ...chartConfig,
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                data: values,
                backgroundColor: accentColorsDict.includes(accentColor as AccentColors)
                  ? theme?.getVar('--propel-accent-8')
                  : handleArbitraryColor(accentColor),
                hoverBackgroundColor: accentColorsDict.includes(accentColor as AccentColors)
                  ? theme?.getVar('--propel-accent-10')
                  : handleArbitraryColor(accentColor),
                barThickness: labelPosition === 'top' ? 8 : 17,
                borderRadius,
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
                  color: theme?.getVar('--propel-gray-a8')
                },
                border: {
                  color: theme?.getVar('--propel-gray-a8')
                },
                ticks: {
                  color: theme?.getVar('--propel-gray-9'),
                  font: {
                    size: getPixelFontSizeAsNumber(theme?.getVar('--propel-font-size-1'))
                  }
                },
                beginAtZero: true
              },
              y: {
                display: labelPosition === 'axis',
                grid: {
                  drawOnChartArea: true,
                  drawTicks: false,
                  color: theme?.getVar('--propel-gray-a8')
                },
                border: {
                  display: false
                },
                ticks: {
                  padding: 17,
                  color: theme?.getVar('--propel-gray-9'),
                  font: {
                    size: getPixelFontSizeAsNumber(theme?.getVar('--propel-font-size-1'))
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

          chart.resize()
          chart.update('none')
          return
        }

        chartRef.current = new ChartJS(canvasRef.current, config)
        canvasRef.current.style.borderRadius = '0px'
      },
      [variant, theme, chartConfig, chartProps, labelFormatter, card, accentColors, chartConfigProps]
    )

    React.useEffect(() => {
      if (!isEmptyState) {
        renderChart(data)
      }
    }, [isEmptyState, data, renderChart])

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
          (hasError?.name === 'AccessTokenError' || !query.metric || !query.dimensions || !query.rowLimit)
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
        setData({ headers, rows })
      }
    }, [isStatic, isLoadingStatic, variant, headers, rows, setData])

    React.useEffect(() => {
      if (fetchedData?.leaderboard && !isStatic) {
        setData(fetchedData.leaderboard)
      }
    }, [fetchedData, variant, isStatic, setData])

    React.useEffect(() => {
      if (variant === 'table') {
        destroyChart()
      }
    }, [variant, destroyChart])

    React.useEffect(() => {
      return () => {
        destroyChart()
      }
    }, [destroyChart])

    React.useEffect(() => {
      if (variant === 'table') {
        destroyChart()
      }
    }, [variant, destroyChart])

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
      destroyChart()

      return themeWrapper(renderEmptyComponent({ theme }))
    }

    if (variant === 'bar') {
      return (
        <div
          ref={setRef}
          className={classnames(componentStyles.rootLeaderboard, className)}
          style={style}
          {...parsedProps}
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
    } = tableProps ?? {}

    const isValueBar = isValidValueBar && hasValueBar

    return (
      <div
        ref={setRef}
        className={classnames(componentStyles.rootLeaderboard, className)}
        style={{ ...style, ...loadingStyles }}
        {...parsedProps}
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
