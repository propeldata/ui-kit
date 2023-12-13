import type { ChartConfiguration } from 'chart.js'
import { DimensionInput, FilterInput, LeaderboardLabels, Sort, TimeRangeInput } from '../../helpers'
import type { ErrorFallbackProps } from '../ErrorFallback'
import type { DataComponentProps } from '../shared.types'

export type LeaderboardChartVariant = 'bar' | 'table'

export type LeaderboardData = {
  headers?: string[]
  rows?: Array<Array<string | null>>
}

export type LeaderboardQueryProps = {
  /**
   * Access token used for the query. While you can pass this one to each component, we recommend wrapping components in the `AccessTokenProvider` instead:
   * @example
   * ```jsx
   * <AccessTokenProvider fetchToken={fetchToken}>
   *   <Counter />
   *   <TimeSeries />
   *   <Leaderboard />
   * </AccessTokenProvider>
   * ```
   * */
  accessToken?: string

  /** Metric unique name */
  metric?: string

  /** Time range that the chart will respond to */
  timeRange?: TimeRangeInput

  /** Filters that the chart will respond to */
  filters?: FilterInput[]

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

  /** This prop allows you to override the URL for Propel's GraphQL API. You shouldn't need to set this unless you are testing. */
  propelApiUrl?: string

  /** Indicates specific time zone region */
  timeZone?: string
}

export type LeaderboardTableProps = {
  /** Whether the table header should remain fixed while scrolling */
  stickyHeader?: boolean

  /** Stick the values column on the right side of the table */
  stickyValues?: boolean

  /** Whether the table shows a value bar. It will not show the value bar if the values are non-numeric. */
  hasValueBar?: boolean

  /** When true, formats value to locale string */
  localize?: boolean

  /** Symbol to be shown before the value text */
  prefixValue?: string

  /** Symbol to be shown after the value text */
  sufixValue?: string
}

export type LeaderboardChartProps = {
  /** Whether the chart should show a value inside the bar */
  showBarValues?: boolean

  /** Sets the position of the labels */
  labelPosition?: 'axis' | 'inside' | 'top'
}

export interface LeaderboardProps extends ErrorFallbackProps, DataComponentProps {
  /** The variant the chart will respond to, can be either `bar` or `table` */
  variant?: LeaderboardChartVariant

  /** If passed along with `rows` the component will ignore the built-in GraphQL operations */
  headers?: string[]

  /** If passed along with `headers` the component will ignore the built-in GraphQL operations */
  rows?: string[][]

  /** When true, shows a skeleton loader */
  loading?: boolean

  /** Time zone to use (for example, "America/Los_Angeles", "Europe/Berlin", or "UTC"). Defaults to the client's local time zone */
  timeZone?: string

  /** Leaderboard query props */
  query?: LeaderboardQueryProps

  /** Optional props that are used to configure the table component. */
  tableProps?: LeaderboardTableProps

  /** Optional props that are used to configure the chart component. Only used when `variant` is "bar". */
  chartProps?: LeaderboardChartProps

  /** @deprecated ~~Format function for labels, must return an array with the new labels~~ the type is deprecated, use `chartConfigProps` instead */
  labelFormatter?: (labels: LeaderboardLabels) => LeaderboardLabels

  /** An optional prop that provides access to the Chart.js API, allowing for further customization of chart settings. */
  chartConfigProps?: (config: ChartConfiguration<'bar'>) => ChartConfiguration<'bar'>
}
