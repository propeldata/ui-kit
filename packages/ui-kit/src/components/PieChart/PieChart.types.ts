import type { ChartConfiguration } from 'chart.js'
import { DimensionInput, Sort } from '../../graphql'
import { AccentColors, GrayColors, ThemeSettingProps } from '../../themes'
import { DataComponentProps, ChartQueryProps } from '../shared.types'

export type PieChartVariant = 'pie' | 'doughnut'

export interface ChartProps {
  /** Sets the position of the labels */
  labelPosition?: 'axis' | 'inside' | 'top'

  /** Sets the other label text
   * @default Other
   */
  otherLabel?: string

  /** Hides the legend on chart if it is set the true
   * @default false
   */
  hideLegend?: boolean

  /** Sets the position of the legend
   * @default top
   */
  legendPosition?: 'top' | 'bottom' | 'left' | 'right'

  /** Shows the values on chart if it is set the true
   * @default false
   */
  showValues?: boolean

  /**
   * Sets the chart color palette
   * @deprecated This property is deprecated and will be removed in a future version. Use `accentColors` instead.
   */
  chartColorPalette?: string[]

  /** Hides the total value on chart if it is set the true
   * @default false
   */
  hideTotal?: boolean

  /** Sets the position of the total value for Pie Chart
   * @default top
   */
  totalPosition?: 'top' | 'bottom'
}

export interface PieChartData {
  headers?: string[]
  rows?: Array<Array<string | null>>
}

export interface PieChartQueryProps extends ChartQueryProps {
  /** The number of rows to be returned. It can be a number between 1 and 1,000 */
  rowLimit?: number

  /** The sort order of the rows. It can be ascending (ASC) or descending (DESC) order. Defaults to descending (DESC) order when not provided. */
  sort?: Sort

  /** @deprecated This prop is deprecated, use `dimensions` instead. */
  dimension?: DimensionInput

  /** Dimensions to group the Metric values by. Typically, Dimensions in a piechart is what you want to compare and rank. */
  dimensions?: DimensionInput[]
}

export interface PieChartProps extends ThemeSettingProps, DataComponentProps<'div'> {
  /** @deprecated This type is deprecated, use `errorFallbackProps` and `errorFallback` instead */
  error?: {
    title: string
    body: string
  } | null

  /** The variant the chart will respond to, can be either `pie` or `doughnut`. */
  variant?: PieChartVariant

  /** When true, shows a skeleton loader */
  loading?: boolean

  /** Time zone to use (for example, "America/Los_Angeles", "Europe/Berlin", or "UTC"). Defaults to the client's local time zone */
  timeZone?: string

  /** If passed along with `rows` the component will ignore the built-in GraphQL operations. */
  headers?: string[]

  /** If passed along with `headers` the component will ignore the built-in GraphQL operations. */
  rows?: string[][]

  /** PieChart query props */
  query?: PieChartQueryProps

  /** Optional props that are used to configure the chart component. */
  chartProps?: ChartProps

  /** Provides className to style label list of chart. */
  labelListClassName?: string

  /** A list of accent colors the PieChart component will use, those will be picked in order */
  accentColors?: (AccentColors | string)[]

  /** Color that will be used for `other` */
  otherColor?: GrayColors | string

  /** If set to true, shows the `other` slice of the pie chart, defaults to true */
  showGroupByOther?: boolean

  /** An optional prop that provides access to the Chart.js API, allowing for further customization of chart settings. */
  chartConfigProps?: (config: ChartConfiguration<'pie' | 'doughnut'>) => ChartConfiguration<'pie' | 'doughnut'>
}
