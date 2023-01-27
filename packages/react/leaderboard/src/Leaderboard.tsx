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

/**
 * It registers only the modules that will be used
 * in the context of a BarChart and LineChart so
 * we reduce bundle weight
 */
ChartJS.register(BarController, BarElement, Tooltip, LinearScale, CategoryScale, Colors)

export interface LeaderboardProps extends ErrorFallbackProps {
  /** The variant the chart will respond to, can be either `bar` or `table` */
  variant?: ChartVariant
  /** `styles` attribute can be either `BarStyles` or `TableStyles` */
  styles?: Styles
  /** If passed along with `rows` the component will ignore the built-in graphql operations */
  headers?: string[]
  /** If passed along with `headers` the component will ignore the built-in graphql operations */
  rows?: string[][]
  /** When true, shows a skeleton loader */
  loading: boolean
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
  const { styles, headers, rows, query, error, loading = false } = props

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

  const getVariant = () => {
    if (rows?.[0].length) {
      return rows[0].length > 2 ? 'table' : 'bar'
    }
    if (query?.dimensions?.length) {
      return query.dimensions.length > 2 ? 'table' : 'bar'
    }
    return 'bar'
  }

  const renderChart = (data?: LeaderboardData) => {
    if (!canvasRef.current || !data || getVariant() === 'table') return

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
      } catch {
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
  }, [isDumb, loading, headers, rows])

  React.useEffect(() => {
    if (serverData && !isDumb) {
      renderChart(serverData)
    }

    return () => {
      destroyChart()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverData, isDumb])

  if (isLoading || loading) {
    return <Loader />
  }

  if (hasError) {
    return <ErrorFallback error={error} styles={styles} />
  }

  if (getVariant() === 'bar') {
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
        />
      </div>
    )
  }

  if (getVariant() === 'table') {
    const tableHeaders = isDumb ? headers : serverData?.headers
    const tableRows = isDumb ? rows : serverData?.rows

    const headersWithoutValue = tableHeaders?.slice(0, tableHeaders.length - 1)
    const valueHeader = tableHeaders?.[tableHeaders.length - 1]

    const rowsWithoutValue = tableRows?.map((row) => row.slice(0, row.length - 1))
    const valuesByRow = tableRows?.map((row) => row[row.length - 1])

    const isOrdered = styles?.table?.ordered || defaultStyles.table?.ordered

    return (
      <div
        className={css`
          overflow: auto;
          font-size: ${styles?.font?.size || defaultStyles.font?.size};
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
              background-color: ${styles?.table?.header?.backgroundColor ||
              styles?.table?.backgroundColor ||
              defaultStyles.table?.header?.backgroundColor};
              text-align: ${styles?.table?.header?.align ||
              styles?.table?.columns?.align ||
              defaultStyles.table?.header?.align};
              color: ${styles?.table?.header?.font?.color || defaultStyles.table?.header?.font?.color};
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
                  styles?.table?.backgroundColor ||
                  defaultStyles.table?.header?.backgroundColor};
                `}
              >
                {valueHeader}
              </th>
            </tr>
          </thead>
          <tbody
            className={css`
              text-align: ${styles?.table?.columns?.align || defaultStyles.table?.columns?.align};
              color: ${styles?.table?.columns?.font?.color || defaultStyles.table?.columns?.font?.color};
              font-weight: ${styles?.table?.columns?.font?.weight || defaultStyles.table?.columns?.font?.weight};
            `}
          >
            {rowsWithoutValue?.map((cells, rowIndex) => (
              <>
                <tr key={rowIndex}>
                  {cells.map((cell, cellIndex) => (
                    <>
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
                    </>
                  ))}
                  <td
                    className={css`
                      position: sticky;
                      right: 0;
                      border-top: 1px solid #e6e8f0;
                      color: ${styles?.table?.valueColumn?.font?.color ||
                      defaultStyles.table?.valueColumn?.font?.color};
                      font-weight: ${styles?.table?.valueColumn?.font?.weight ||
                      defaultStyles.table?.valueColumn?.font?.weight};
                      text-align: ${styles?.table?.valueColumn?.align ||
                      styles?.table?.columns?.align ||
                      defaultStyles.table?.valueColumn?.align};
                      padding: ${styles?.table?.padding || defaultStyles.table?.padding};
                      background-color: ${styles?.table?.backgroundColor || defaultStyles.table?.backgroundColor};
                    `}
                  >
                    {valuesByRow?.[rowIndex]}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return <ErrorFallback error={error} styles={styles} />
}
