import { ThemeComponentProps } from '../themes'
import { FilterInput, MetricInput, TimeRangeInput } from '../graphql'
import type { ErrorFallback as ErrorFallbackComponent, ErrorFallbackProps } from './ErrorFallback'
import type { Loader as LoaderComponent, LoaderProps } from './Loader'
import type { ThemeStateProps } from './ThemeProvider/ThemeProvider.types'
import { ButtonProps } from './Button'

/** Shared props for the data components. */

export interface FallbackComponents {
  components?: {
    Button?: (props: ButtonProps) => React.ReactElement
  }

  /**
   * A fallback react component that will be used when the component is in error state.
   *
   * You can also use a callback to get the `ErrorFallbackProps` for your custom component or set a wrapper
   * around the UI-Kit's ErrorFallback component.
   *
   * This component will be used by all the ThemeProvider's child components.
   */
  errorFallback?: ({
    errorFallbackProps,
    ErrorFallback,
    theme
  }: {
    errorFallbackProps: ErrorFallbackProps | undefined
    ErrorFallback: typeof ErrorFallbackComponent
    theme: ThemeStateProps
  }) => React.ReactElement

  /**
   * A fallback react component that will be used when the component is in loading state.
   *
   * You can also use a callback to get the `LoaderProps` for your custom component or set a wrapper
   * around the UI-Kit's Loader component.
   *
   * This component will be used by all the ThemeProvider's child components.
   */
  renderLoader?: ({
    loaderProps,
    Loader,
    theme
  }: {
    loaderProps: LoaderProps | undefined
    Loader: typeof LoaderComponent
    theme: ThemeStateProps
  }) => React.ReactElement

  /**
   * A fallback react component that will be used when the component is in empty state, which means no data or empty data was received.
   *
   * This component will be used by all the ThemeProvider's child components.
   */
  renderEmpty?: ({ theme }: { theme: ThemeStateProps }) => React.ReactElement
}

export type DataComponentProps<T extends keyof JSX.IntrinsicElements> = ThemeComponentProps &
  Omit<React.ComponentPropsWithoutRef<T>, 'style' | 'className'> &
  FallbackComponents & {
    /** @deprecated Optional props that are used to configure the Loader component. This type is deprecated, use `renderLoader` instead. */
    loaderProps?: LoaderProps

    /** @deprecated Optional props that are used to configure the ErrorFallback component. This type is deprecated, use `errorFallback` instead. */
    errorFallbackProps?: ErrorFallbackProps

    /** When true, wraps the component in a card */
    card?: boolean

    /** Props for the Card component */
    cardProps?: React.ComponentPropsWithoutRef<'div'>
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

export interface PaginationProps {
  /**
   * The number of rows to be returned when paging forward. It can be a number between 1 and 1,000.
   * @default 50
   * */
  first?: number

  /**
   * The number of rows to be returned when paging forward. It can be a number between 1 and 1,000.
   * @default 50
   * */
  last?: number

  /** The cursor to use when paging forward. */
  after?: string

  /** The cursor to use when paging backward. */
  before?: string
}
