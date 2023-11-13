import { Chart as ChartJS } from 'chart.js'
import classnames from 'classnames'
import React from 'react'
import {
  customCanvasBackgroundColor,
  formatLabels,
  getTimeZone,
  PROPEL_GRAPHQL_API_ENDPOINT,
  useCombinedRefs,
  useLeaderboardQuery,
  useSetupComponentDefaultChartStyles
} from '../../helpers'
import { ChartPlugins } from '../../themes'
import { ErrorFallback } from '../ErrorFallback'
import { Loader } from '../Loader'
import { useGlobalChartProps, useTheme } from '../ThemeProvider'
import { withContainer } from '../withContainer'
import componentStyles from './Leaderboard.module.scss'
import type { LeaderboardData, LeaderboardProps } from './Leaderboard.types'
import { getTableSettings, getValueWithPrefixAndSufix } from './utils'
import { ValueBar } from './ValueBar'

let idCounter = 0

export const LeaderboardComponent = React.forwardRef<HTMLDivElement | HTMLTableElement, LeaderboardProps>(
  (
    {
      variant = 'bar',
      headers,
      rows,
      query,
      error,
      className,
      loading: isLoadingStatic = false,
      tableProps,
      labelFormatter,
      timeZone,
      loaderProps,
      errorFallbackProps,
      ...rest
    },
    forwardedRef
  ) => {
    const [propsMismatch, setPropsMismatch] = React.useState(false)
    const theme = useTheme(className)
    const globalChartProps = useGlobalChartProps()
    useSetupComponentDefaultChartStyles({ theme, chartProps: globalChartProps })

    const idRef = React.useRef(idCounter++)
    const id = `leaderboard-${idRef.current}`

    /**
     * The html node where the chart will render
     */
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const chartRef = React.useRef<ChartJS | null>()
    const tableRef = React.useRef<HTMLDivElement>(null)
    const combinedRefs = useCombinedRefs(forwardedRef, tableRef)

    /**
     * Checks if the component is in `static` or `connected` mode
     */
    const isStatic = !query

    const renderChart = React.useCallback(
      (data?: LeaderboardData) => {
        if (!canvasRef.current || !data || variant === 'table') return

        const labels = formatLabels({ labels: data.rows?.map((row) => row[0]), formatter: labelFormatter }) || []
        const values =
          data.rows?.map((row) => (row[row.length - 1] === null ? null : Number(row[row.length - 1]))) || []

        const customPlugins: ChartPlugins = {
          customCanvasBackgroundColor: {
            color: theme?.bgPrimary
          }
        }

        if (chartRef.current) {
          const chart = chartRef.current
          chart.data.labels = labels
          chart.data.datasets[0].data = values

          chart.update()
          return
        }

        chartRef.current = new ChartJS(canvasRef.current, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                data: values,
                backgroundColor: theme?.accent,
                barThickness: 17,
                borderColor: theme?.accent,
                borderWidth: 0,
                hoverBorderColor: theme?.accentHover
              }
            ]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: parseInt(theme?.spaceXxs)
            },
            plugins: customPlugins,
            scales: {
              x: {
                display: true,
                grid: {
                  drawOnChartArea: false
                },
                beginAtZero: true
              },
              y: {
                display: true,
                grid: { drawOnChartArea: true }
              }
            }
          },
          plugins: [customCanvasBackgroundColor]
        })

        canvasRef.current.style.borderRadius = '0px'
      },
      [variant, labelFormatter, theme]
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

    const isNoContainerRef = (variant === 'bar' && !canvasRef.current) || (variant === 'table' && !tableRef.current)

    if (((isStatic && isLoadingStatic) || (!isStatic && isLoadingQuery)) && isNoContainerRef) {
      destroyChart()
      return <Loader {...loaderProps} />
    }

    if (variant === 'bar') {
      return (
        <div ref={forwardedRef} className={classnames(componentStyles.rootLeaderboard, className)} {...rest}>
          <canvas id={id} ref={canvasRef} role="img" style={loadingStyles} />
        </div>
      )
    }

    const tableHeaders = headers?.length ? headers : fetchedData?.leaderboard.headers
    const tableRows = isStatic ? rows : fetchedData?.leaderboard.rows

    const { headersWithoutValue, isOrdered, maxValue, rowsWithoutValue, valueHeader, valuesByRow } =
      // getTableSettings({ headers: tableHeaders, rows: tableRows, styles })
      getTableSettings({ headers: tableHeaders, rows: tableRows })

    return (
      <div
        ref={combinedRefs}
        className={classnames(
          componentStyles.rootLeaderboard,
          tableProps?.stickyHeader && componentStyles.stickyHeader
        )}
        style={loadingStyles}
      >
        <table cellSpacing={0}>
          {/* <thead className={ComponentStyles.getTableHeadStyles(styles)}> */}
          <thead>
            <tr>
              {headersWithoutValue?.map((header, index) => (
                // <th className={ComponentStyles.getTableHeaderStyles(styles)} key={`${header}-${index}`}>
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
                {/* <td className={ComponentStyles.getTableValueCellStyles(styles)}> */}
                <td className={componentStyles.valueCell}>
                  {getValueWithPrefixAndSufix({
                    localize: tableProps?.localize,
                    prefix: tableProps?.prefixValue,
                    sufix: tableProps?.sufixValue,
                    value: valuesByRow?.[rowIndex] ?? undefined
                  })}
                </td>
                {tableProps?.hasValueBar && (
                  // <td className={ComponentStyles.valueBarCellStyles(styles)}>
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
