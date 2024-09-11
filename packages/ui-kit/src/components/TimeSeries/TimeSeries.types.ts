import type { ChartConfiguration, ScaleOptionsByType } from 'chart.js'
import { DeepPartial } from 'chart.js/dist/types/utils'
import { TimeSeriesGranularity } from '../../graphql'
import { TimeSeriesLabels } from '../../helpers'
import { ThemeSettingProps } from '../../themes'
import type { DataComponentProps, QueryProps } from '../shared.types'

export type ChartScales = DeepPartial<{ [key: string]: ScaleOptionsByType<'linear' | 'logarithmic'> }>

export type TimeSeriesChartVariant = 'bar' | 'line'

export type TimeSeriesData = {
  values?: (number | string | null)[]
  labels?: string[]
  groups?: {
    values?: (number | string | null)[]
    labels?: string[]
    group?: (string | null)[]
  }[]
}

export interface TimeSeriesQueryProps extends QueryProps {
  /** Granularity that the chart will respond to */
  granularity?: TimeSeriesGranularity

  /** Timestamp format that the chart will respond to */
  timestampFormat?: string

  /** Query groups based on columns for multi-dimensional time series */
  groupBy?: string[]
}

export interface TimeSeriesChartProps {
  /** When true, shows grid lines */
  grid?: boolean

  /** When true, fills the area under the line */
  fillArea?: boolean
}

export interface TimeSeriesBaseProps extends ThemeSettingProps, DataComponentProps<'div'> {
  /** @deprecated This type is deprecated, use `errorFallbackProps` and `errorFallback` instead */
  error?: {
    title: string
    body: string
  } | null

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

  /** Time zone to use (for example, "America/Los_Angeles", "Europe/Berlin", or "UTC"). Defaults to the client's local time zone */
  timeZone?: string

  /** TimeSeries query props */
  query?: TimeSeriesQueryProps

  /** Optional props that are used to configure the chart component. */
  chartProps?: TimeSeriesChartProps

  /** @deprecated Format function for labels, must return an array with the new labels. This type is deprecated, use `chartConfigProps` instead. */
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
