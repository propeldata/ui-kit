import { Chart as ChartJS, ChartConfiguration } from 'chart.js'
import classnames from 'classnames'
import React from 'react'
import {
  customCanvasBackgroundColor,
  formatLabels,
  getPixelFontSizeAsNumber,
  getTimeZone,
  PROPEL_GRAPHQL_API_ENDPOINT,
  useCombinedRefsCallback,
  useLeaderboardQuery,
  useSetupComponentDefaultChartStyles
} from '../../helpers'
import { ErrorFallback } from '../ErrorFallback'
import { Loader } from '../Loader'
import { useGlobalChartConfigProps, useTheme } from '../ThemeProvider'
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
      baseTheme = 'lightTheme',
      labelFormatter,
      timeZone,
      loaderProps,
      errorFallbackProps,
      style,
      card = false,
      ...rest
    },
    forwardedRef
  ) => {
    const innerRef = React.useRef<HTMLDivElement>(null)
    const { componentContainer, setRef } = useCombinedRefsCallback({ innerRef, forwardedRef })
    const theme = useTheme({ componentContainer, baseTheme })

    const [propsMismatch, setPropsMismatch] = React.useState(false)
    const globalChartConfigProps = useGlobalChartConfigProps()
    useSetupComponentDefaultChartStyles({ theme, globalChartConfigProps: globalChartConfigProps })

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
        if (!canvasRef.current || !data || variant === 'table' || !theme) {
          return
        }

        const labels = formatLabels({ labels: data.rows?.map((row) => row[0]), formatter: labelFormatter }) || []
        const values =
          data.rows?.map((row) => (row[row.length - 1] === null ? null : Number(row[row.length - 1]))) || []

        const customPlugins = {
          customCanvasBackgroundColor: {
            color: card ? theme?.bgPrimary : 'transparent'
          }
        }

        if (chartRef.current) {
          const chart = chartRef.current
          chart.data.labels = labels
          chart.data.datasets[0].data = values
          chart.data.datasets[0].backgroundColor = theme?.accent
          chart.options.plugins = {
            ...chart.options.plugins,
            ...customPlugins
          }

          // @TODO: need improvement
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          chart.options.scales.x.border.color = theme?.colorSecondary
          chart.options.scales.x.grid.color = theme?.colorSecondary
          chart.options.scales.y.grid.color = theme?.colorSecondary

          chart.update()
          return
        }

        let config: ChartConfiguration<'bar'> = {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                data: values,
                backgroundColor: theme?.accent,
                barThickness: 17,
                borderWidth: 0
              }
            ]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: parseInt(theme?.spaceXxs as string)
            },
            plugins: customPlugins,
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
                display: true,
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
          plugins: [customCanvasBackgroundColor]
        }

        if (chartConfigProps) {
          config = chartConfigProps(config)
        }

        chartRef.current = new ChartJS(canvasRef.current, config)
        canvasRef.current.style.borderRadius = '0px'
      },
      [variant, theme, card, labelFormatter, chartConfigProps]
    )

    const destroyChart = () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }

    const {
      isInitialLoading: isLoadingQuery,
      error: hasError,
      data: fetchedData
    } = useLeaderboardQuery(
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
        leaderboardInput: {
          metricName: query?.metric,
          filters: query?.filters,
          sort: query?.sort,
          rowLimit: query?.rowLimit ?? 100,
          dimensions: query?.dimensions,
          timeZone: timeZone ?? getTimeZone(),
          timeRange: {
            relative: query?.timeRange?.relative ?? null,
            n: query?.timeRange?.n ?? null,
            start: query?.timeRange?.start ?? null,
            stop: query?.timeRange?.stop ?? null
          }
        }
      },
      {
        refetchInterval: query?.refetchInterval,
        retry: query?.retry,
        enabled: !isStatic
      }
    )

    const loadingStyles = {
      opacity: isLoadingQuery || isLoadingStatic ? '0.3' : '1',
      transition: 'opacity 0.2s ease-in-out'
    }

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
          (!query.accessToken || !query.metric || !query.timeRange || !query.dimensions || !query.rowLimit)
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
    }, [isStatic, headers, rows, query, isLoadingStatic, variant])

    React.useEffect(() => {
      if (isStatic) {
        renderChart({ headers, rows })
      }
    }, [isStatic, isLoadingStatic, variant, headers, rows, renderChart])

    React.useEffect(() => {
      if (fetchedData && !isStatic) {
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
      return <ErrorFallback {...errorFallbackProps} error={error} />
    }

    const isNoContainerRef = (variant === 'bar' && !canvasRef.current) || (variant === 'table' && !innerRef.current)

    if (((isStatic && isLoadingStatic) || (!isStatic && isLoadingQuery)) && isNoContainerRef) {
      destroyChart()
      return <Loader {...loaderProps} />
    }

    if (variant === 'bar') {
      return (
        <div ref={setRef} className={classnames(componentStyles.rootLeaderboard, className)} style={style} {...rest}>
          <canvas id={id} ref={canvasRef} role="img" style={loadingStyles} />
        </div>
      )
    }

    const tableHeaders = headers?.length ? headers : fetchedData?.leaderboard.headers
    const tableRows = isStatic ? rows : fetchedData?.leaderboard.rows

    const { headersWithoutValue, isOrdered, maxValue, rowsWithoutValue, valueHeader, valuesByRow } = getTableSettings({
      headers: tableHeaders,
      rows: tableRows
    })

    return (
      <div
        ref={setRef}
        className={classnames(componentStyles.rootLeaderboard, className)}
        style={{ ...style, ...loadingStyles }}
        {...rest}
      >
        <table cellSpacing={0}>
          <thead className={tableProps?.stickyHeader && componentStyles.stickyHeader}>
            <tr>
              {headersWithoutValue?.map((header, index) => (
                <th key={`${header}-${index}`}>{header}</th>
              ))}
              <th className={componentStyles.valueHeader}>{valueHeader}</th>
              {tableProps?.hasValueBar && <th />}
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
                <td className={componentStyles.valueCell}>
                  {getValueWithPrefixAndSufix({
                    localize: tableProps?.localize,
                    prefix: tableProps?.prefixValue,
                    sufix: tableProps?.sufixValue,
                    value: valuesByRow?.[rowIndex] ?? undefined
                  })}
                </td>
                {tableProps?.hasValueBar && (
                  <td className={componentStyles.valueBarCell}>
                    <ValueBar value={valuesByRow?.[rowIndex] ?? 0} maxValue={maxValue ?? 0} />
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
