import { FilterInput, TimeRangeInput } from '../../helpers'
import type { ChartStyles } from '../../themes'

export type CounterQueryProps = {
  /** Time range that the chart will respond to. Will be ignored when value is passed */
  timeRange?: TimeRangeInput
  /** This should eventually be replaced to customer's app credentials. Will be ignored when value is passed */
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
}

export interface CounterProps extends React.ComponentProps<'span'> {
  /** If passed, the component will ignore the built-in GraphQL operations */
  value?: string
  /** Symbol to be shown before the value text */
  prefixValue?: string
  /** Symbol to be shown after the value text */
  sufixValue?: string
  /** Basic styles initial state */
  styles?: ChartStyles
  /** When true, formats value to locale string */
  localize?: boolean
  /** Time zone to use (for example, "America/Los_Angeles", "Europe/Berlin", or "UTC"). Defaults to the client's local time zone. */
  timeZone?: string
  /** Counter query props */
  query?: CounterQueryProps
  /** When true, shows a skeleton loader */
  loading?: boolean
}
