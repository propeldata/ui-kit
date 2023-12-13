import type { ChartConfiguration, ScaleOptionsByType } from 'chart.js'
import { DeepPartial } from 'chart.js/dist/types/utils'
import { FilterInput, TimeRangeInput, TimeSeriesGranularity, TimeSeriesLabels } from '../../helpers'
import type { ErrorFallbackProps } from '../ErrorFallback'
import type { DataComponentProps } from '../shared.types'

export type ChartScales = DeepPartial<{ [key: string]: ScaleOptionsByType<'linear' | 'logarithmic'> }>

export type TimeSeriesChartVariant = 'bar' | 'line'

export type TimeSeriesData = {
  values?: Array<number | string | null>
  labels?: string[]
}

export type TimeSeriesQueryProps = {
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

  /** Granularity that the chart will respond to */
  granularity?: TimeSeriesGranularity

  /** Filters that the chart will respond to */
  filters?: FilterInput[]

  /** Timestamp format that the chart will respond to */
  timestampFormat?: string

  /** Interval in milliseconds for refetching the data */
  refetchInterval?: number

  /** Whether to retry on errors. */
  retry?: boolean

  /** This prop allows you to override the URL for Propel's GraphQL API. You shouldn't need to set this unless you are testing. */
  propelApiUrl?: string

  /** Indicates specific time zone region */
  timeZone?: string
}

export interface TimeSeriesChartProps {
  /** When true, shows grid lines */
  grid?: boolean

  /** When true, fills the area under the line */
  fillArea?: boolean
}

export interface TimeSeriesBaseProps extends ErrorFallbackProps, DataComponentProps {
  /** If passed along with `values` the component will ignore the built-in GraphQL operations */
  labels?: TimeSeriesData['labels']

  /** If passed along with `labels` the component will ignore the built-in GraphQL operations  */
  values?: TimeSeriesData['values']

  /** When true, shows a skeleton loader */
  loading?: boolean

  /** Canvas aria-label prop, if not passed we handle it */
  ariaLabel?: string

  /** Canvas role prop, if not passed we handle it */
  role?: string

  /** Time zone to use (for example, "America/Los_Angeles", "Europe/Berlin", or "UTC"). Defaults to the client's local time zone. */
  timeZone?: string

  /** TimeSeries query props */
  query?: TimeSeriesQueryProps

  /** Optional props that are used to configure the chart component. */
  chartProps?: TimeSeriesChartProps

  /** @deprecated ~~Format function for labels, must return an array with the new labels~~ the type is deprecated, use `chartConfigProps` instead */
  labelFormatter?: (labels: TimeSeriesLabels) => TimeSeriesLabels
}

export interface TimeSeriesLineProps extends TimeSeriesBaseProps {
  variant?: 'line'
  chartConfigProps?: (config: ChartConfiguration<'line'>) => ChartConfiguration<'line'>
}

export interface TimeSeriesBarProps extends TimeSeriesBaseProps {
  variant?: 'bar'
  chartConfigProps?: (config: ChartConfiguration<'bar'>) => ChartConfiguration<'bar'>
}

export type TimeSeriesProps = TimeSeriesLineProps | TimeSeriesBarProps
