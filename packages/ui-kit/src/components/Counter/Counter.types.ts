import type { FilterInput, TimeRangeInput } from '../../helpers'
import type { DataComponentProps } from '../shared.types'
import type { ThemeComponentProps } from '../../themes'

export type CounterQueryProps = {
  /** Time range that the chart will respond to. Will be ignored when value is passed */
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

  /** Metric unique name will be ignored when value is passed */
  metric?: string

  /** Filters that the chart will respond to */
  filters?: FilterInput[]

  /** Interval in milliseconds for refetching the data */
  refetchInterval?: number

  /** Whether to retry on errors. */
  retry?: boolean

  /** This prop allows you to override the URL for Propel's GraphQL API. You shouldn't need to set this unless you are testing. */
  propelApiUrl?: string
  /** Indicates specific time zone region */
  timeZone?: string
}

export interface CounterProps
  extends ThemeComponentProps,
    Omit<React.ComponentProps<'span'>, 'style'>,
    DataComponentProps {
  /** If passed, the component will ignore the built-in GraphQL operations */
  value?: string

  /** Symbol to be shown before the value text */
  prefixValue?: string

  /** Symbol to be shown after the value text */
  sufixValue?: string

  /** When true, formats value to locale string */
  localize?: boolean

  /** Time zone to use (for example, "America/Los_Angeles", "Europe/Berlin", or "UTC"). Defaults to the client's local time zone. */
  timeZone?: string

  /** Counter query props */
  query?: CounterQueryProps

  /** When true, shows a skeleton loader */
  loading?: boolean
}
