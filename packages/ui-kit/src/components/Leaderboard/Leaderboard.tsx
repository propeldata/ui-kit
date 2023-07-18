import React from 'react'
import {
  customCanvasBackgroundColor,
  DimensionInput,
  FilterInput,
  Propeller,
  PROPEL_GRAPHQL_API_ENDPOINT,
  Sort,
  TimeRangeInput,
  useLeaderboardQuery
} from '../../helpers'
import { css } from '@emotion/css'
import { BarController, BarElement, CategoryScale, Chart as ChartJS, Colors, LinearScale, Tooltip } from 'chart.js'
import { defaultChartHeight, defaultStyles } from './defaults'
import { ErrorFallback, ErrorFallbackProps } from './ErrorFallback'
import { Loader } from './Loader'
import type { ChartPlugins, ChartVariant, LeaderboardData, Styles } from './types'
import {
  getTableSettings,
  getValueWithPrefixAndSufix,
  updateChartConfig,
  updateChartStyles,
  useSetupDefaultStyles
} from './utils'
import { ValueBar } from './ValueBar'

/**
 * It registers only the modules that will be used
 * in the context of a BarChart and LineChart so
 * we reduce bundle weight
 */
ChartJS.register(BarController, BarElement, Tooltip, LinearScale, CategoryScale, Colors)

let idCounter = 0

export interface LeaderboardProps extends ErrorFallbackProps, React.ComponentProps<'canvas'> {
  /** The variant the chart will respond to, can be either `bar` or `table` */
  variant?: ChartVariant

  /** `styles` attribute can be either `BarStyles` or `TableStyles` */
  styles?: Styles

  /** If passed along with `rows` the component will ignore the built-in graphql operations */
  headers?: string[]

  /** If passed along with `headers` the component will ignore the built-in graphql operations */
  rows?: string[][]

  /** When true, shows a skeleton loader */
  loading?: boolean

  query?: {
    /** This should eventually be replaced to customer's app credentials */
    accessToken?: string

    /** Metric unique name */
    metric?: string

    /** Time range that the chart will respond to */
    timeRange?: TimeRangeInput

    /** Filters that the chart will respond to */
    filters?: FilterInput[]

    /** Propeller that the chart will respond to */
    propeller?: Propeller

    /** The number of rows to be returned. It can be a number between 1 and 1,000 */
    rowLimit?: number

    /** The sort order of the rows. It can be ascending (ASC) or descending (DESC) order. Defaults to descending (DESC) order when not provided. */
    sort?: Sort

    /** One or many Dimensions to group the Metric values by. Typically, Dimensions in a leaderboard are what you want to compare and rank. */
    dimensions?: DimensionInput[]

    /** Interval in milliseconds for refetching the data */
    refetchInterval?: number

    /** Whether to retry on errors. */
    retry?: boolean
  }
}

export function Leaderboard(props: LeaderboardProps) {
  const { variant = 'bar', styles, headers, rows, query, error, loading: isLoadingStatic = false, ...rest } = props

  const [propsMismatch, setPropsMismatch] = React.useState(false)

  const idRef = React.useRef(idCounter++)
  const id = `leaderboard-${idRef.current}`

  /**
   * The html node where the chart will render
   */
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  const chartRef = React.useRef<ChartJS | null>()

  const tableRef = React.useRef<HTMLDivElement>(null)

  /**
   * Checks if the component is in `static` or `connected` mode
   */
  const isStatic = !query

  useSetupDefaultStyles(styles)

  const renderChart = React.useCallback(
    (data?: LeaderboardData) => {
      if (!canvasRef.current || !data || variant === 'table') return

      const labels = data.rows?.map((row) => row[0]) || []
      const values = data.rows?.map((row) => (row[row.length - 1] === null ? null : Number(row[row.length - 1]))) || []

      const hideGridLines = styles?.canvas?.hideGridLines || false

      const customPlugins: ChartPlugins = {
        customCanvasBackgroundColor: {
          color: styles?.canvas?.backgroundColor
        }
      }

      const backgroundColor = styles?.bar?.backgroundColor || defaultStyles.bar.backgroundColor
      const borderColor = styles?.bar?.borderColor || defaultStyles?.bar.borderColor
      const borderWidth = styles?.bar?.borderWidth || defaultStyles.bar.borderWidth
      const hoverBorderColor = styles?.bar?.hoverBorderColor || defaultStyles.bar.hoverBorderColor

      if (chartRef.current) {
        updateChartConfig({
          chart: chartRef.current,
          labels,
          values,
          customPlugins
        })

        updateChartStyles({ chart: chartRef.current, styles })

        chartRef.current.update()
        return
      }

      chartRef.current = new ChartJS(canvasRef.current, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor,
              borderColor,
              borderWidth,
              hoverBorderColor
            }
          ]
        },
        options: {
          indexAxis: 'y',
          responsive: !styles?.canvas?.width,
          maintainAspectRatio: false,
          layout: {
            padding: styles?.canvas?.padding || defaultStyles.canvas.padding
          },
          plugins: customPlugins,
          scales: {
            x: {
              display: !hideGridLines,
              grid: {
                drawOnChartArea: false
              },
              beginAtZero: true
            },
            y: {
              display: !hideGridLines,
              grid: { drawOnChartArea: true }
            }
          }
        },
        plugins: [customCanvasBackgroundColor]
      })

      canvasRef.current.style.borderRadius = styles?.canvas?.borderRadius || defaultStyles.canvas.borderRadius
    },
    [styles, variant]
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
      endpoint: PROPEL_GRAPHQL_API_ENDPOINT,
      fetchParams: {
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${query?.accessToken}`
        }
      }
    },
    {
      leaderboardInput: {
        metricName: query?.metric,
        filters: query?.filters,
        propeller: query?.propeller,
        sort: query?.sort,
        rowLimit: query?.rowLimit ?? 100,
        dimensions: query?.dimensions,
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
  }, [isStatic, isLoadingStatic, styles, variant, headers, rows, renderChart])

  React.useEffect(() => {
    if (fetchedData && !isStatic) {
      renderChart(fetchedData.leaderboard)
    }
  }, [fetchedData, styles, variant, isStatic, renderChart])

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
    return <ErrorFallback error={error} styles={styles} />
  }

  const isNoContainerRef = (variant === 'bar' && !canvasRef.current) || (variant === 'table' && !tableRef.current)

  if (((isStatic && isLoadingStatic) || (!isStatic && isLoadingQuery)) && isNoContainerRef) {
    destroyChart()
    return <Loader styles={styles} />
  }

  if (variant === 'bar') {
    return (
      <div
        className={css`
          width: ${styles?.canvas?.width};
          height: ${styles?.canvas?.height || defaultChartHeight};
        `}
      >
        <canvas
          id={id}
          ref={canvasRef}
          width={styles?.canvas?.width}
          height={styles?.canvas?.height || defaultChartHeight}
          role="img"
          style={loadingStyles}
          {...rest}
        />
      </div>
    )
  }

  const tableHeaders = headers?.length ? headers : fetchedData?.leaderboard.headers
  const tableRows = isStatic ? rows : fetchedData?.leaderboard.rows

  const { hasValueBar, headersWithoutValue, isOrdered, maxValue, rowsWithoutValue, valueHeader, valuesByRow } =
    getTableSettings({ headers: tableHeaders, rows: tableRows, styles })

  return (
    <div ref={tableRef} className={getContainerStyles(styles)} style={loadingStyles}>
      <table cellSpacing={0} className={tableStyles}>
        <thead className={getTableHeadStyles(styles)}>
          <tr>
            {headersWithoutValue?.map((header, index) => (
              <th className={getTableHeaderStyles(styles)} key={`${header}-${index}`}>
                {header}
              </th>
            ))}
            <th className={getTableValueHeaderStyles(styles)}>{valueHeader}</th>
            {hasValueBar && <th />}
          </tr>
        </thead>
        <tbody className={getTableBodyStyles(styles)}>
          {rowsWithoutValue?.map((cells, rowIndex) => (
            <tr key={rowIndex}>
              {cells.map((cell, cellIndex) => (
                <td className={getTableCellStyles(styles)} key={`${cell}-${cellIndex}`}>
                  {isOrdered && cellIndex === 0 && `${rowIndex + 1}. `}
                  {cell}
                </td>
              ))}
              <td className={getTableValueCellStyles(styles)}>
                {getValueWithPrefixAndSufix({
                  localize: styles?.table?.valueColumn?.localize,
                  prefix: styles?.table?.valueColumn?.prefixValue,
                  sufix: styles?.table?.valueColumn?.sufixValue,
                  value: valuesByRow?.[rowIndex] ?? undefined
                })}
              </td>
              {hasValueBar && (
                <td className={valueBarCellStyles}>
                  <ValueBar value={valuesByRow?.[rowIndex] ?? 0} maxValue={maxValue ?? 0} styles={styles} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const getContainerStyles = (styles?: Styles) => css`
  overflow: auto;
  font-size: ${styles?.font?.size || defaultStyles.font?.size};
  width: ${styles?.table?.width || defaultStyles.table?.width};
  height: ${styles?.table?.height || defaultStyles.table?.height};
`

const tableStyles = css`
  width: 100%;
`

const getTableHeadStyles = (styles?: Styles) => css`
  font-size: ${styles?.table?.header?.font?.size || defaultStyles.table.header.font.size};
  font-family: ${styles?.table?.header?.font?.family || defaultStyles.table.header.font.family};
  font-weight: ${styles?.table?.header?.font?.weight || defaultStyles.table.header.font.weight};
  font-style: ${styles?.table?.header?.font?.style || defaultStyles.table.header.font.style};
  line-height: ${styles?.table?.header?.font?.lineHeight || defaultStyles.table.header.font.lineHeight};
  background-color: ${styles?.table?.header?.backgroundColor || defaultStyles.table.header.backgroundColor};
  text-align: ${styles?.table?.header?.align || defaultStyles.table.header.align};
  color: ${styles?.table?.header?.font?.color || defaultStyles.table.header.font.color};
  ${styles?.table?.stickyHeader && stickyHeaderStyles}
`

const stickyHeaderStyles = css`
  position: sticky;
  top: 0;
  z-index: 9999;
`

const getTableHeaderStyles = (styles?: Styles) => css`
  padding: ${styles?.table?.padding || defaultStyles.table.padding};
  font-weight: ${styles?.table?.header?.font?.weight || defaultStyles.table.header.font.weight};
`

const getTableValueHeaderStyles = (styles?: Styles) => css`
  position: sticky;
  right: 0;
  text-align: ${styles?.table?.valueColumn?.align || defaultStyles.table.valueColumn.align};
  padding: ${styles?.table?.padding || defaultStyles.table.padding};
  font-weight: ${styles?.table?.header?.font?.weight || defaultStyles.table.header.font.weight};
  background-color: ${styles?.table?.header?.backgroundColor || defaultStyles.table.header.backgroundColor};
`

const getTableBodyStyles = (styles?: Styles) => css`
  text-align: ${styles?.table?.columns?.align || defaultStyles.table?.columns?.align};
  color: ${styles?.table?.columns?.font?.color || defaultStyles.table.columns.font.color};
  font-size: ${styles?.table?.columns?.font?.size || defaultStyles.table.columns.font.size};
  font-family: ${styles?.table?.columns?.font?.family || defaultStyles.table.columns.font.family};
  font-weight: ${styles?.table?.columns?.font?.weight || defaultStyles.table.columns.font.weight};
  font-style: ${styles?.table?.columns?.font?.style || defaultStyles.table.columns.font.style};
  line-height: ${styles?.table?.columns?.font?.lineHeight || defaultStyles.table.columns.font.lineHeight};
`

const getTableCellStyles = (styles?: Styles) => css`
  padding: ${styles?.table?.padding || defaultStyles.table?.padding};
  background-color: ${styles?.table?.backgroundColor || defaultStyles.table.backgroundColor};
  border-top: 1px solid #e6e8f0;
`

const getTableValueCellStyles = (styles?: Styles) => css`
  font-size: ${styles?.table?.valueColumn?.font?.size || defaultStyles.table.valueColumn.font.size};
  font-family: ${styles?.table?.valueColumn?.font?.family || defaultStyles.table.valueColumn.font.family};
  font-weight: ${styles?.table?.valueColumn?.font?.weight || defaultStyles.table.valueColumn.font.weight};
  font-style: ${styles?.table?.valueColumn?.font?.style || defaultStyles.table.valueColumn.font.style};
  line-height: ${styles?.table?.valueColumn?.font?.lineHeight || defaultStyles.table.valueColumn.font.lineHeight};
  position: sticky;
  right: 0;
  border-top: 1px solid #e6e8f0;
  color: ${styles?.table?.valueColumn?.font?.color || defaultStyles.table.valueColumn.font.color};
  text-align: ${styles?.table?.valueColumn?.align || defaultStyles.table.valueColumn.align};
  padding: ${styles?.table?.padding || defaultStyles.table.padding};
  background-color: ${styles?.table?.backgroundColor || defaultStyles.table.backgroundColor};
`

const valueBarCellStyles = css`
  width: 20%;
  border-top: 1px solid #e6e8f0;
  padding-right: 6px;
`
