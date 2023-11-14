import type { Chart } from 'chart.js'
import { DimensionInput, FilterInput, Sort, ThemeCSSProperties, TimeRangeInput } from '../../helpers'
import type { ErrorFallbackProps } from '../ErrorFallback'
import type { LoaderProps } from '../Loader'
import type { DefaultThemes } from '../ThemeProvider'

/**
 * @deprecated the type is deprecated, use LeaderboardChartVariant or TimeSeriesChartVariant instead
 */
export type ChartVariant = 'bar' | 'line'

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
}

export type LeaderboardTableProps = {
  /** Whether the table header should remain fixed while scrolling */
  stickyHeader?: boolean
  hasValueBar?: boolean
  localize?: boolean
  prefixValue?: string
  sufixValue?: string
}

export interface LeaderboardProps extends ErrorFallbackProps, React.ComponentProps<'div'> {
  style?: ThemeCSSProperties

  baseTheme?: DefaultThemes

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

  tableProps?: LeaderboardTableProps

  /** @deprecated ~~Format function for labels, must return an array with the new labels~~ the type is deprecated, use `chartConfigProps` instead */
  labelFormatter?: (labels: string[]) => string[]

  /** An optional prop that provides access to the Chart.js API, allowing for further customization of chart settings. */
  chartConfigProps?: (config: Chart['config']) => typeof config

  /** Optional porps that are used to configure the Loader component. */
  loaderProps?: LoaderProps

  /** Optional porps that are used to configure the ErrorFallback component. */
  errorFallbackProps?: ErrorFallbackProps
}
