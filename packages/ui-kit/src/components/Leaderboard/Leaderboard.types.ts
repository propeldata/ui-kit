import { DimensionInput, FilterInput, Propeller, Sort, TimeRangeInput } from '../../helpers'
import { ChartStyles } from '../../themes'
import type { ErrorFallbackProps } from '../ErrorFallback'

/**
 * @deprecated the type is deprecated, use LeaderboardChartVariant or TimeSeriesChartVariant instead
 */
export type ChartVariant = 'bar' | 'line'

export type LeaderboardChartVariant = 'bar' | 'table'

export type LeaderboardData = {
  headers?: string[]
  rows?: Array<Array<string | null>>
}

export interface LeaderboardProps extends ErrorFallbackProps, React.ComponentProps<'canvas'> {
  /** The variant the chart will respond to, can be either `bar` or `table` */
  variant?: LeaderboardChartVariant

  /** `styles` attribute can be either `BarStyles` or `TableStyles` */
  styles?: ChartStyles

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
