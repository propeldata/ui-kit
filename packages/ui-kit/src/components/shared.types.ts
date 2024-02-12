import { FilterInput, MetricInput, TimeRangeInput } from '../helpers'
import type { ErrorFallbackProps, ErrorFallback } from './ErrorFallback'
import type { LoaderProps, Loader } from './Loader'

/** Shared props for the data components. */

export interface FallbackComponents {
  /**
   * A fallback react component that will be used when the component is in loading state.
   *
   * You can also use a callback to get the `LoaderProps` for your custom component or set a wrapper
   * around the UI-Kit's Loader component.
   *
   * This component will be used by all the ThemeProvider's child components.
   */
  loaderFallback?:
    | React.ReactElement
    | ((props: LoaderProps | undefined, baseComponent: typeof Loader) => React.ReactElement)

  /**
   * A fallback react component that will be used when the component is in error state.
   *
   * You can also use a callback to get the `ErrorFallbackProps` for your custom component or set a wrapper
   * around the UI-Kit's ErrorFallback component.
   *
   * This component will be used by all the ThemeProvider's child components.
   */
  errorFallback?:
    | React.ReactElement
    | ((props: ErrorFallbackProps | undefined, baseComponent: typeof ErrorFallback) => React.ReactElement)

  /**
   * A fallback react component that will be used when the component is in empty state, which means no data or empty data was received.
   *
   * This component will be used by all the ThemeProvider's child components.
   */
  emptyFallback?: React.ReactElement
}

export interface DataComponentProps extends FallbackComponents {
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

  /**
   * Specify the time range for a time series, counter, or leaderboard Metric query
   * @type TimeRangeInput
   */
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
   * The `metric` prop allows you to specify which metric to query.
   * You can query predefined metrics by passing their name or ID as a string, or
   * you can query metrics on-the-fly by passing an inline metric definition to the prop.
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

  /** When false, the component will not make any GraphQL requests, default is true. */
  enabled?: boolean
}
