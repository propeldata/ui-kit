import React from 'react'
import request from 'graphql-request'
import {
  LeaderboardDocument,
  TimeRangeInput,
  FilterInput,
  Propeller,
  PROPEL_GRAPHQL_API_ENDPOINT,
  Sort,
  DimensionInput
} from '@propeldata/ui-kit-graphql'
import { BarController, BarElement, LinearScale, CategoryScale, Tooltip, Chart as ChartJS, Colors } from 'chart.js'
import { css } from '@emotion/css'

import { ErrorFallback, ErrorFallbackProps } from './ErrorFallback'
import type { ChartVariant, LeaderboardData, Styles } from './types'
import { defaultChartHeight, defaultStyles } from './defaults'
import { generateConfig, useSetupDefaultStyles } from './utils'
import { Loader } from './Loader'
import { ValueBar } from './ValueBar'

/**
 * It registers only the modules that will be used
 * in the context of a BarChart and LineChart so
 * we reduce bundle weight
 */
ChartJS.register(BarController, BarElement, Tooltip, LinearScale, CategoryScale, Colors)

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
  }
}

export function Leaderboard(props: LeaderboardProps) {
  const { variant = 'bar', styles, headers, rows, query, error, loading = false, ...rest } = props

  const [hasError, setHasError] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [serverData, setServerData] = React.useState<LeaderboardData>()

  const id = React.useId()

  /**
   * The html node where the chart will render
   */
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  const chartRef = React.useRef<ChartJS | null>()

  /**
   * Checks if the component is in `dumb` or `smart` mode
   */
  const isDumb = !query

  useSetupDefaultStyles(styles)

  const renderChart = (data?: LeaderboardData) => {
    if (!canvasRef.current || !data || variant === 'table') return

    chartRef.current = new ChartJS(canvasRef.current, generateConfig({ styles, data }))

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
    canvasRef.current.style.borderRadius = styles?.canvas?.borderRadius || defaultStyles.canvas?.borderRadius!
  }

  const destroyChart = () => {
    if (chartRef.current) {
      chartRef.current.destroy()
      chartRef.current = null
    }
  }

  /**
   * Fetches the leaderboard data
   * when the user doesn't provide
   * its on `headers` and `rows`
   */
  const fetchData = async () => {
    if (!query?.accessToken || !query?.metric || !query?.timeRange) {
      console.error(
        'InvalidPropsError: When not passing `headers` and `rows` you must provide `accessToken`, `metric`, `timeRange`, `dimensions` and `rowLimit` in the `query` prop'
      )
      throw new Error('InvalidPropsError')
    }

    const response = await request(
      PROPEL_GRAPHQL_API_ENDPOINT,
      LeaderboardDocument,
      {
        uniqueName: query.metric,
        leaderboardInput: {
          timeRange: query.timeRange,
          filters: query.filters,
          propeller: query.propeller,
          sort: query.sort,
          rowLimit: query.rowLimit,
          dimensions: query.dimensions
        }
      },
      {
        authorization: `Bearer ${query?.accessToken}`
      }
    )

    const metricData = response.metricByName.leaderboard

    const headers = metricData.headers
    const rows = metricData.rows

    return { headers, rows }
  }

  React.useEffect(() => {
    async function fetchChartData() {
      try {
        setIsLoading(true)
        const data = await fetchData()
        setServerData(data)
      } catch (error) {
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }
    if (!isDumb && !serverData) {
      fetchChartData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverData, isDumb])

  React.useEffect(() => {
    if (isDumb) {
      renderChart({ headers, rows })
    }

    return () => {
      destroyChart()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDumb, loading, headers, rows, variant])

  React.useEffect(() => {
    if (serverData && !isDumb) {
      renderChart(serverData)
    }

    return () => {
      destroyChart()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverData, isDumb, variant])

  React.useEffect(() => {
    try {
      if (variant !== 'bar' && variant !== 'table') {
        console.error('InvalidPropsError: `variant` prop must be either `bar` or `table`')
        throw new Error('InvalidPropsError')
      }
      setHasError(false)
    } catch {
      setHasError(true)
    }
  }, [variant])

  if (isLoading || loading) {
    return <Loader styles={styles} />
  }

  if (hasError) {
    return <ErrorFallback error={error} styles={styles} />
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
          {...rest}
        />
      </div>
    )
  }

  if (variant === 'table') {
    const tableHeaders = isDumb ? headers : serverData?.headers
    const tableRows = isDumb ? rows : serverData?.rows

    const headersWithoutValue = tableHeaders?.slice(0, tableHeaders.length - 1)
    const valueHeader = tableHeaders?.[tableHeaders.length - 1]

    const rowsWithoutValue = tableRows?.map((row) => row.slice(0, row.length - 1))
    const valuesByRow = tableRows?.map((row) => parseInt(row[row.length - 1]))
    const maxValue = Math.max(...(valuesByRow || []))

    const isOrdered = styles?.table?.isOrdered || defaultStyles.table?.isOrdered

    const hasValueBar = styles?.table?.hasValueBar || defaultStyles.table?.hasValueBar

    return (
      <div
        className={css`
          overflow: auto;
          font-size: ${styles?.font?.size || defaultStyles.font?.size};
          width: ${styles?.table?.width || defaultStyles.table?.width};
          height: ${styles?.table?.height || defaultStyles.table?.height};
        `}
      >
        <table
          cellSpacing={0}
          className={css`
            width: 100%;
          `}
        >
          <thead
            className={css`
              font-size: ${styles?.table?.header?.font?.size ||
              styles?.font?.size ||
              defaultStyles.table?.header?.font?.size};
              font-family: ${styles?.table?.header?.font?.family ||
              styles?.font?.family ||
              defaultStyles.table?.header?.font?.family};
              font-weight: ${styles?.table?.header?.font?.weight ||
              styles?.font?.weight ||
              defaultStyles.table?.header?.font?.weight};
              font-style: ${styles?.table?.header?.font?.style ||
              styles?.font?.style ||
              defaultStyles.table?.header?.font?.style};
              line-height: ${styles?.table?.header?.font?.lineHeight ||
              styles?.font?.lineHeight ||
              defaultStyles.table?.header?.font?.lineHeight};
              background-color: ${styles?.table?.header?.backgroundColor ||
              styles?.table?.backgroundColor ||
              defaultStyles.table?.header?.backgroundColor};
              text-align: ${styles?.table?.header?.align ||
              styles?.table?.columns?.align ||
              defaultStyles.table?.header?.align};
              color: ${styles?.table?.header?.font?.color ||
              styles?.font?.color ||
              defaultStyles.table?.header?.font?.color};
              ${styles?.table?.stickyHeader &&
              css`
                position: sticky;
                top: 0;
                z-index: 9999;
              `}
            `}
          >
            <tr>
              {headersWithoutValue?.map((header, index) => (
                <th
                  className={css`
                    padding: ${styles?.table?.padding || defaultStyles.table?.padding};
                    font-weight: ${styles?.table?.header?.font?.weight ||
                    styles?.table?.columns?.font?.weight ||
                    defaultStyles.table?.header?.font?.weight};
                  `}
                  key={`${header}-${index}`}
                >
                  {header}
                </th>
              ))}
              <th
                className={css`
                  position: sticky;
                  right: 0;
                  text-align: ${styles?.table?.valueColumn?.align ||
                  styles?.table?.columns?.align ||
                  defaultStyles.table?.valueColumn?.align};
                  padding: ${styles?.table?.padding || defaultStyles.table?.padding};
                  font-weight: ${styles?.table?.header?.font?.weight ||
                  styles?.table?.columns?.font?.weight ||
                  defaultStyles.table?.header?.font?.weight};
                  background-color: ${styles?.table?.header?.backgroundColor ||
                  defaultStyles.table?.header?.backgroundColor};
                `}
              >
                {valueHeader}
              </th>
              {hasValueBar && <th />}
            </tr>
          </thead>
          <tbody
            className={css`
              text-align: ${styles?.table?.columns?.align || defaultStyles.table?.columns?.align};
              color: ${styles?.table?.columns?.font?.color ||
              styles?.font?.color ||
              defaultStyles.table?.columns?.font?.color};
              font-size: ${styles?.table?.columns?.font?.size ||
              styles?.font?.size ||
              defaultStyles.table?.columns?.font?.size};
              font-family: ${styles?.table?.columns?.font?.family ||
              styles?.font?.family ||
              defaultStyles.table?.columns?.font?.family};
              font-weight: ${styles?.table?.columns?.font?.weight ||
              styles?.font?.weight ||
              defaultStyles.table?.columns?.font?.weight};
              font-style: ${styles?.table?.columns?.font?.style ||
              styles?.font?.style ||
              defaultStyles.table?.columns?.font?.style};
              line-height: ${styles?.table?.columns?.font?.lineHeight ||
              styles?.font?.lineHeight ||
              defaultStyles.table?.columns?.font?.lineHeight};
            `}
          >
            {rowsWithoutValue?.map((cells, rowIndex) => (
              <tr key={rowIndex}>
                {cells.map((cell, cellIndex) => (
                  <td
                    className={css`
                      padding: ${styles?.table?.padding || defaultStyles.table?.padding};
                      background-color: ${styles?.table?.backgroundColor || defaultStyles.table?.backgroundColor};
                      border-top: 1px solid #e6e8f0;
                    `}
                    key={`${cell}-${cellIndex}`}
                  >
                    {isOrdered && cellIndex === 0 && `${rowIndex + 1}. `}
                    {cell}
                  </td>
                ))}
                <td
                  className={css`
                    font-size: ${styles?.table?.valueColumn?.font?.size ||
                    styles?.font?.size ||
                    defaultStyles.table?.valueColumn?.font?.size};
                    font-family: ${styles?.table?.valueColumn?.font?.family ||
                    styles?.font?.family ||
                    defaultStyles.table?.valueColumn?.font?.family};
                    font-weight: ${styles?.table?.valueColumn?.font?.weight ||
                    styles?.font?.weight ||
                    defaultStyles.table?.valueColumn?.font?.weight};
                    font-style: ${styles?.table?.valueColumn?.font?.style ||
                    styles?.font?.style ||
                    defaultStyles.table?.valueColumn?.font?.style};
                    line-height: ${styles?.table?.valueColumn?.font?.lineHeight ||
                    styles?.font?.lineHeight ||
                    defaultStyles.table?.valueColumn?.font?.lineHeight};

                    position: sticky;
                    right: 0;
                    border-top: 1px solid #e6e8f0;
                    color: ${styles?.table?.valueColumn?.font?.color ||
                    styles?.font?.color ||
                    defaultStyles.table?.valueColumn?.font?.color};
                    text-align: ${styles?.table?.valueColumn?.align ||
                    styles?.table?.columns?.align ||
                    defaultStyles.table?.valueColumn?.align};
                    padding: ${styles?.table?.padding || defaultStyles.table?.padding};
                    background-color: ${styles?.table?.backgroundColor || defaultStyles.table?.backgroundColor};
                  `}
                >
                  {styles?.table?.valueColumn?.locale
                    ? valuesByRow?.[rowIndex].toLocaleString()
                    : valuesByRow?.[rowIndex]}
                </td>
                {hasValueBar && (
                  <td
                    className={css`
                      width: 20%;
                      border-top: 1px solid #e6e8f0;
                    `}
                  >
                    <ValueBar
                      value={valuesByRow?.[rowIndex] || 0}
                      maxValue={maxValue || 0}
                      color={
                        styles?.table?.valueBar?.color || styles?.font?.color || defaultStyles.table?.valueBar?.color
                      }
                      backgroundColor={
                        styles?.table?.valueBar?.backgroundColor || defaultStyles.table?.valueBar?.backgroundColor
                      }
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return <ErrorFallback error={error} styles={styles} />
}
