import type { ChartConfiguration } from 'chart.js'
import { DimensionInput, Sort } from '../../graphql'
import { LeaderboardLabels } from '../../helpers'
import { AccentColors, ThemeSettingProps } from '../../themes'
import type { DataComponentProps, ChartQueryProps } from '../shared.types'

export type LeaderboardChartVariant = 'bar' | 'table'

export interface LeaderboardData {
  headers?: string[]
  rows?: Array<Array<string | null>>
}

export interface LeaderboardQueryProps extends ChartQueryProps {
  /** The number of rows to be returned. It can be a number between 1 and 1,000 */
  rowLimit?: number

  /** The sort order of the rows. It can be ascending (ASC) or descending (DESC) order. Defaults to descending (DESC) order when not provided. */
  sort?: Sort

  /** One or many Dimensions to group the Metric values by. Typically, Dimensions in a leaderboard are what you want to compare and rank. */
  dimensions?: DimensionInput[]
}

export interface LeaderboardTableProps {
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

export interface LeaderboardChartProps {
  /** Whether the chart should show a value inside the bar */
  showBarValues?: boolean

  /** Sets the position of the labels */
  labelPosition?: 'axis' | 'inside' | 'top'
}

export interface LeaderboardProps extends ThemeSettingProps, DataComponentProps<'div'> {
  /** @deprecated This type is deprecated, use `errorFallbackProps` and `errorFallback` instead */
  error?: {
    title: string
    body: string
  } | null

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

  /** A list of accent colors the Leaderboard component will use, those will be picked in order */
  accentColors?: (AccentColors | string)[]

  /** @deprecated Format function for labels, must return an array with the new labels the type is deprecated, use `chartConfigProps` instead. */
  labelFormatter?: (labels: LeaderboardLabels) => LeaderboardLabels

  /** An optional prop that provides access to the Chart.js API, allowing for further customization of chart settings. */
  chartConfigProps?: (config: ChartConfiguration<'bar'>) => ChartConfiguration<'bar'>

  /** Whether the headers should be prettified */
  prettifyHeaders?: boolean
}
