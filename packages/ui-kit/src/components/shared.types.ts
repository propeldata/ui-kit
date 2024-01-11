import { FilterInput, MetricInput, TimeRangeInput } from 'src/helpers'
import type { ErrorFallbackProps } from './ErrorFallback'
import type { LoaderProps } from './Loader'

/** Shared props for the data components. */

export type DataComponentProps = {
  /** Optional props that are used to configure the Loader component. */
  loaderProps?: LoaderProps

  /** Optional props that are used to configure the ErrorFallback component. */
  errorFallbackProps?: ErrorFallbackProps

  /** When true, wraps the component in a card */
  card?: boolean
}

export interface QueryProps {
  /** Indicates specific time zone region */
  timeZone?: string

  /** Specify the time range for a time series, counter, or leaderboard Metric query */
  timeRange?: TimeRangeInput

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

  /**
   * The metric query is used to query a Metric in counter, time series, or leaderboard format.
   * If it is passed a `string`, it will be used as the metric name.
   * If it is passed a `MetricInput`, it will be used as the metric query.
   * @type string | MetricInput
   * */
  metric?: string | MetricInput

  /** Filters that the chart will respond to */
  filters?: FilterInput[]

  /** Interval in milliseconds for refetching the data */
  refetchInterval?: number

  /** Whether to retry on errors. */
  retry?: boolean

  /** This prop allows you to override the URL for Propel's GraphQL API. You shouldn't need to set this unless you are testing. */
  propelApiUrl?: string
}
